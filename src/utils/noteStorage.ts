
import { Note, NotesStore } from "@/types/note";
import { toast } from "@/components/ui/use-toast";

const STORAGE_KEY = "stranger-notes";
const BAD_WORDS = ["badword1", "badword2", "inappropriate"]; // Add real bad words here

// Initialize storage with sample data if empty
export const initializeStorage = (): void => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    const initialNotes: Note[] = [
      {
        id: "1",
        content: "Sometimes the smallest acts of kindness make the biggest impact on someone's day.",
        author: "",
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
        isAnonymous: true,
      },
      {
        id: "2",
        content: "The universe has a way of guiding you exactly where you need to be, even when it feels like you're lost.",
        author: "",
        createdAt: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day ago
        isAnonymous: true,
      },
      {
        id: "3",
        content: "Your struggles don't define you, but the way you overcome them does.",
        author: "Maya",
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
        isAnonymous: false,
      },
      {
        id: "4",
        content: "Take a deep breath. You've survived 100% of your worst days so far.",
        author: "",
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString(), // 5 hours ago
        isAnonymous: true,
      },
      {
        id: "5",
        content: "It's okay to not be okay. Feel your emotions, then let them go like leaves on a stream.",
        author: "Jamie",
        createdAt: new Date(Date.now() - 3600000 * 10).toISOString(), // 10 hours ago
        isAnonymous: false,
      },
      {
        id: "6",
        content: "Growth happens outside your comfort zone. Do one thing today that challenges you.",
        author: "",
        createdAt: new Date(Date.now() - 86400000 * 4).toISOString(), // 4 days ago
        isAnonymous: true,
      },
      {
        id: "7",
        content: "We're all just walking each other home.",
        author: "",
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
        isAnonymous: true,
      },
    ];
    
    saveNotes({ notes: initialNotes });
  }
};

// Save notes to localStorage
export const saveNotes = (data: NotesStore): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

// Get all notes from localStorage
export const getNotes = (): Note[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      initializeStorage();
      return getNotes();
    }
    const parsed = JSON.parse(data) as NotesStore;
    return parsed.notes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error("Failed to get notes:", error);
    return [];
  }
};

// Add a new note
export const addNote = (note: Omit<Note, "id" | "createdAt">): boolean => {
  try {
    // Check for inappropriate content
    if (containsInappropriateContent(note.content)) {
      toast({
        title: "Note not saved",
        description: "Your note contains inappropriate content.",
        variant: "destructive"
      });
      return false;
    }
    
    const notes = getNotes();
    const newNote: Note = {
      ...note,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    
    saveNotes({ notes: [newNote, ...notes] });
    
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

// Check if content contains inappropriate words
const containsInappropriateContent = (content: string): boolean => {
  const normalized = content.toLowerCase();
  return BAD_WORDS.some(word => normalized.includes(word.toLowerCase()));
};

// Generate a random ID
const generateId = (): string => {
  return Date.now().toString() + Math.floor(Math.random() * 1000).toString();
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
