export interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  is_archived: boolean;
  user_id: string;
  tags: string[];
}
