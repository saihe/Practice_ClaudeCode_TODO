export type Status = 'TODO' | 'DOING' | 'DONE';

export interface Card {
  id: string;
  text: string;
  status: Status;
  createdAt: number;
}

export const COLUMNS: { id: Status; label: string; color: string }[] = [
  { id: 'TODO', label: 'TODO', color: 'border-blue-500' },
  { id: 'DOING', label: 'DOING', color: 'border-amber-500' },
  { id: 'DONE', label: 'DONE', color: 'border-green-500' },
];
