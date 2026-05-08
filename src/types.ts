export interface Source {
  name: string;
  url: string;
  desc?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: Source[];
  related?: string[];
  raw?: string;
}

export interface ApiMessage {
  role: 'user' | 'assistant';
  content: string;
}
