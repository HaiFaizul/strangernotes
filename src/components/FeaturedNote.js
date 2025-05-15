
import React, { useEffect, useState } from 'react';
import { useRandomization } from '../hooks/useRandomization';

/**
 * Component to display a single featured note on the homepage
 * @param {Object} props - Component props
 * @param {Array} props.notes - Array of notes to select from
 */
const FeaturedNote = ({ notes = [] }) => {
  const [featuredNote, setFeaturedNote] = useState(null);
  const { randomizedItems, markAsViewed } = useRandomization(notes, {
    prioritizeFamous: true,
    avoidRecent: true,
    recentKey: 'featured'
  });
  
  useEffect(() => {
    // Select the first note from the randomized list
    if (randomizedItems.length > 0) {
      setFeaturedNote(randomizedItems[0]);
      markAsViewed(randomizedItems[0]);
    }
  }, [randomizedItems]);
  
  if (!featuredNote) {
    return <div className="featured-note-placeholder">Loading featured note...</div>;
  }
  
  return (
    <div className="featured-note">
      <h2>Featured Note</h2>
      <div className="note-card">
        <h3>{featuredNote.title}</h3>
        <p>{featuredNote.content}</p>
        {featuredNote.timestamp && (
          <small>
            {new Date(featuredNote.timestamp).toLocaleDateString()}
          </small>
        )}
        {featuredNote.isFamous && <span className="famous-badge">★ Popular</span>}
      </div>
    </div>
  );
};

export default FeaturedNote;
