
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";
import { Note } from "@/types/note";
import { formatDate, getRandomNoteColor } from "@/utils/noteStorage";

interface NoteCardProps {
  note: Note;
  featured?: boolean;
  className?: string;
}

const NoteCard = ({ note, featured = false, className = "" }: NoteCardProps) => {
  const [color, setColor] = useState("blue");
  
  useEffect(() => {
    setColor(getRandomNoteColor());
  }, [note.id]);
  
  const colorClass = `note-colors-${color}`;
  
  return (
    <div 
      className={`note-card ${featured ? 'p-8' : 'p-6'} animate-fade-in ${colorClass} ${className}`}
    >
      <blockquote className={`${featured ? 'text-xl md:text-2xl' : 'text-md md:text-lg'} mb-4 font-medium`}>
        "{note.content}"
      </blockquote>
      
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          {note.isAnonymous ? (
            <>
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Anonymous</span>
              <span className="stranger-badge ml-1">
                <span className="align-middle">Stranger</span>
              </span>
            </>
          ) : (
            <>
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground font-medium">{note.author}</span>
            </>
          )}
        </div>
        
        <div className="text-sm text-muted-foreground">
          {formatDate(note.createdAt)}
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
