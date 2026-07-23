export interface Tag {
  id: string;
  name: string;
}

export interface NoteTag {
  tags: Tag;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  is_archived: boolean;
  user_id: string;
  note_tags: NoteTag[];
}
