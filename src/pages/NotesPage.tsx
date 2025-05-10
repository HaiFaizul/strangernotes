
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import NoteCard from "@/components/NoteCard";
import { Note } from "@/types/note";
import { getNotes, initializeStorage } from "@/utils/noteStorage";
import { PenIcon, SearchIcon } from "lucide-react";

const NotesPage = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    initializeStorage();
    const allNotes = getNotes();
    const prioritizedNotes = [...allNotes].sort((a, b) => {
      // Prioritize anonymous notes
      if (a.isAnonymous && !b.isAnonymous) return -1;
      if (!a.isAnonymous && b.isAnonymous) return 1;
      // Then sort by date
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    
    setNotes(prioritizedNotes);
    setFilteredNotes(prioritizedNotes);
    setLoading(false);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (query.trim() === "") {
      setFilteredNotes(notes);
    } else {
      const filtered = notes.filter(
        (note) =>
          note.content.toLowerCase().includes(query) ||
          (!note.isAnonymous && note.author.toLowerCase().includes(query))
      );
      setFilteredNotes(filtered);
    }
  };

  return (
    <div className="container max-w-5xl py-8 md:py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold">All Notes</h1>
        
        <div className="flex w-full md:w-auto gap-4">
          <div className="relative flex-1 md:w-64">
            <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              value={searchQuery}
              onChange={handleSearch}
              className="pl-9"
            />
          </div>
          
          <Button asChild>
            <Link to="/create" className="whitespace-nowrap flex items-center gap-2">
              <PenIcon className="h-4 w-4" />
              Write a Note
            </Link>
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-60 animate-pulse bg-muted rounded-xl"></div>
          ))}
        </div>
      ) : (
        <>
          {filteredNotes.length === 0 ? (
            <div className="text-center py-16">
              <h2 className="text-xl font-medium mb-2">No notes found</h2>
              <p className="text-muted-foreground mb-6">
                {searchQuery ? "Try a different search term" : "Be the first to share a note!"}
              </p>
              <Button asChild>
                <Link to="/create">
                  <PenIcon className="h-4 w-4 mr-2" />
                  Write a Note
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredNotes.map((note) => (
                <NoteCard key={note.id} note={note} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default NotesPage;
