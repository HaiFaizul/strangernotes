
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import NoteCard from "@/components/NoteCard";
import { Note } from "@/types/note";
import { getNotes, initializeStorage } from "@/utils/noteStorage";
import { ArrowRightIcon, PenIcon, Instagram } from "lucide-react";

const HomePage = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNoteIndex, setCurrentNoteIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadNotes = async () => {
      await initializeStorage();
      const allNotes = await getNotes();
      const prioritizedNotes = [...allNotes].sort((a, b) => {
        // Prioritize anonymous notes
        if (a.isAnonymous && !b.isAnonymous) return -1;
        if (!a.isAnonymous && b.isAnonymous) return 1;
        // Then sort by date
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      
      setNotes(prioritizedNotes);
      setLoading(false);
    };
    
    loadNotes();
  }, []);

  const handleNextNote = () => {
    if (notes.length === 0) return;
    setCurrentNoteIndex((prevIndex) => (prevIndex + 1) % notes.length);
  };

  const featuredNote = notes[currentNoteIndex];
  const moreNotes = notes.slice(1, 4);

  return (
    <div className="container max-w-4xl py-8 md:py-12">
      <section className="mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center">
          Whispers of Strangers
        </h1>
        <p className="text-center text-muted-foreground mb-4">
          Anonymous notes from people just like you, sharing their thoughts, wisdom, and inspiration.
        </p>
        
        <div className="flex justify-center mb-6">
          <a 
            href="https://www.instagram.com/hai_faizul/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-stranger hover:underline"
          >
            <Instagram size={18} />
            <span>@hai_faizul</span>
          </a>
        </div>

        {loading ? (
          <div className="h-48 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-stranger"></div>
          </div>
        ) : (
          <>
            {featuredNote && (
              <div className="mb-6">
                <NoteCard note={featuredNote} featured={true} />
                
                <div className="flex justify-center mt-6">
                  <Button onClick={handleNextNote} variant="outline" className="gap-2">
                    Another Note
                    <ArrowRightIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </section>

      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">More Notes from Strangers</h2>
          <Link to="/notes" className="text-stranger hover:underline flex items-center gap-1">
            View all notes
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 animate-pulse bg-muted rounded-xl"></div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {moreNotes.map((note) => (
              <div key={note.id} className="h-full">
                <NoteCard note={note} />
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-20">
        <Card className="bg-stranger/10 border-stranger/10">
          <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">Share Your Thoughts</h2>
              <p className="text-muted-foreground">
                What wisdom or encouragement would you like to share with the world? Your words could be exactly what someone needs today.
              </p>
            </div>
            <Button asChild size="lg" className="w-full md:w-auto">
              <Link to="/create" className="flex items-center gap-2">
                <PenIcon className="h-4 w-4" />
                Share a Note
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>
      
      <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p>Made with ❤️ | <a href="https://www.instagram.com/hai_faizul/" target="_blank" rel="noopener noreferrer" className="text-stranger hover:underline">@hai_faizul</a></p>
      </footer>
    </div>
  );
};

export default HomePage;
