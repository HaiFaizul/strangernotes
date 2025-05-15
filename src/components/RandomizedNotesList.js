
import React, { useEffect } from 'react';
import { useRandomization } from '../hooks/useRandomization';

/**
 * Component to display randomized notes
 * @param {Object} props - Component props
 * @param {Array} props.notes - Array of notes to display
 * @param {Function} props.onNoteSelect - Callback when note is selected
 */
const RandomizedNotesList = ({ notes = [], onNoteSelect }) => {
  const { randomizedItems, markAsViewed } = useRandomization(notes, {
    prioritizeFamous: true,
    avoidRecent: true,
    recentKey: 'notes'
  });
  
  // Listen for global randomize events
  useEffect(() => {
    const handleRandomize = () => {
      console.log('Randomizing notes based on global event');
      // The hook will handle re-randomization when dependencies change
      // This is just to log the event
    };
    
    document.addEventListener('strangernotesRandomize', handleRandomize);
    return () => document.removeEventListener('strangernotesRandomize', handleRandomize);
  }, []);
  
  const handleNoteClick = (note) => {
    markAsViewed(note);
    if (onNoteSelect) {
      onNoteSelect(note);
    }
  };
  
  return (
    <div className="notes-container">
      <h2>Notes</h2>
      {randomizedItems.length > 0 ? (
        <ul className="notes-list">
          {randomizedItems.map((note) => (
            <li 
              key={note.id} 
              className={`note-item ${note.isFamous ? 'famous' : ''}`}
              onClick={() => handleNoteClick(note)}
            >
              <h3>{note.title}</h3>
              <p>{note.content}</p>
              {note.timestamp && (
                <small>
                  {new Date(note.timestamp).toLocaleDateString()}
                </small>
              )}
              {note.isFamous && <span className="famous-badge">★</span>}
            </li>
          ))}
        </ul>
      ) : (
        <p>No notes available.</p>
      )}
    </div>
  );
};

export default RandomizedNotesList;
