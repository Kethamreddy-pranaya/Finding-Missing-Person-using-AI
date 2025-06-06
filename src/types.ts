export interface MissingPerson {
  id: string;
  name: string;
  age: number;
  lastSeen: string;
  location: string;
  description: string;
  photoUrl: string;
  contactInfo: string;
  dateReported: string;
  status: 'missing' | 'found';
}

export interface SearchResult {
  person: MissingPerson;
  similarity: number;
}