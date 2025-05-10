
export interface Note {
  id: string;
  content: string;
  author: string;
  createdAt: string;
  isAnonymous: boolean;
}

export interface NotesStore {
  notes: Note[];
}
