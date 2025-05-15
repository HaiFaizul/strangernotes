
import { useState, useEffect } from 'react';

/**
 * Custom hook to randomize content using the StrangerNotes utilities
 * @param {Array} items - Array of items to randomize
 * @param {Object} options - Options for randomization
 * @returns {Array} - Randomized array of items
 */
export function useRandomization(items = [], options = {}) {
  const [randomizedItems, setRandomizedItems] = useState([]);
  
  useEffect(() => {
    if (!items || items.length === 0) {
      setRandomizedItems([]);
      return;
    }
    
    // Use the global StrangerNotes utilities if available
    if (window.StrangerNotes?.randomizeContent) {
      const randomized = window.StrangerNotes.randomizeContent(items, options);
      setRandomizedItems(randomized);
    } else {
      // Fallback to basic randomization if utilities not available
      setRandomizedItems([...items].sort(() => Math.random() - 0.5));
      console.warn('StrangerNotes randomization utilities not found. Using basic randomization.');
    }
  }, [items, options.prioritizeFamous, options.avoidRecent]);
  
  // Function to mark an item as viewed
  const markAsViewed = (item) => {
    if (window.StrangerNotes?.markAsViewed && item) {
      window.StrangerNotes.markAsViewed(item, options.recentKey || 'items');
    }
  };
  
  return { randomizedItems, markAsViewed };
}
