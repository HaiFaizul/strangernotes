
import { Note, NotesStore } from "@/types/note";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

const STORAGE_KEY = "stranger-notes";
const BAD_WORDS = ["badword1", "badword2", "inappropriate"]; // Basic local filtering

// Initialize storage with sample data if empty
export const initializeStorage = async (): Promise<void> => {
  const { data: existingNotes } = await supabase.from("notes").select("*").limit(1);
  
  if (!existingNotes || existingNotes.length === 0) {
    const initialNotes: Omit<Note, "id" | "createdAt">[] = [
      {
        content: "Sometimes the smallest acts of kindness make the biggest impact on someone's day.",
        author: "",
        isAnonymous: true,
      },
      {
        content: "The universe has a way of guiding you exactly where you need to be, even when it feels like you're lost.",
        author: "",
        isAnonymous: true,
      },
      {
        content: "Your struggles don't define you, but the way you overcome them does.",
        author: "Maya",
        isAnonymous: false,
      },
      {
        content: "Take a deep breath. You've survived 100% of your worst days so far.",
        author: "",
        isAnonymous: true,
      },
      {
        content: "It's okay to not be okay. Feel your emotions, then let them go like leaves on a stream.",
        author: "Jamie",
        isAnonymous: false,
      },
      {
        content: "Growth happens outside your comfort zone. Do one thing today that challenges you.",
        author: "",
        isAnonymous: true,
      },
      {
        content: "We're all just walking each other home.",
        author: "",
        isAnonymous: true,
      },
    ];
    
    // Insert initial data
    for (const note of initialNotes) {
      await addNote(note);
    }
  }
};

// Get all notes from Supabase
export const getNotes = async (): Promise<Note[]> => {
  try {
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("is_flagged", false)
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("Error fetching notes:", error);
      return [];
    }
    
    return data.map(note => ({
      id: note.id,
      content: note.content,
      author: note.author || "",
      createdAt: note.created_at,
      isAnonymous: note.is_anonymous,
    }));
  } catch (error) {
    console.error("Failed to get notes:", error);
    return [];
  }
};

// Check content with our moderation edge function
const moderateContent = async (content: string): Promise<{ isFlagged: boolean, reason?: string }> => {
  try {
    // First do a simple local check
    if (containsInappropriateContent(content)) {
      return { isFlagged: true, reason: "Contains inappropriate language" };
    }
    
    // Then call the edge function for more advanced moderation
    const { data, error } = await supabase.functions.invoke("moderate-content", {
      body: { content },
    });
    
    if (error) {
      console.error("Error calling moderation function:", error);
      return { isFlagged: false }; // Default to not flagged on error
    }
    
    return data;
  } catch (error) {
    console.error("Failed to moderate content:", error);
    return { isFlagged: false }; // Default to not flagged on error
  }
};

// Add a new note to Supabase
export const addNote = async (note: Omit<Note, "id" | "createdAt">): Promise<boolean> => {
  try {
    // Check for inappropriate content
    const moderationResult = await moderateContent(note.content);
    
    if (moderationResult.isFlagged) {
      toast({
        title: "Note not saved",
        description: "Your note contains inappropriate content.",
        variant: "destructive"
      });
      return false;
    }
    
    const { error } = await supabase.from("notes").insert({
      content: note.content,
      author: note.isAnonymous ? null : note.author,
      is_anonymous: note.isAnonymous,
    });
    
    if (error) {
      console.error("Error adding note:", error);
      toast({
        title: "Error",
        description: "Failed to save your note. Please try again.",
        variant: "destructive"
      });
      return false;
    }
    
    toast({
      title: "Note saved",
      description: "Your note has been shared with strangers!",
    });
    
    return true;
  } catch (error) {
    console.error("Failed to add note:", error);
    toast({
      title: "Error",
      description: "Failed to save your note. Please try again.",
      variant: "destructive"
    });
    return false;
  }
};

// Simple check if content contains inappropriate words
const containsInappropriateContent = (content: string): boolean => {
  const normalized = content.toLowerCase();
  return BAD_WORDS.some(word => normalized.includes(word.toLowerCase()));
};

// Format the created date for display
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return "just now";
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }
  
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  return date.toLocaleDateString(undefined, options);
};

// Get a random color for note cards
export const getRandomNoteColor = (): string => {
  const colors = ["blue", "green", "yellow", "pink", "peach", "purple"];
  return colors[Math.floor(Math.random() * colors.length)];
};
