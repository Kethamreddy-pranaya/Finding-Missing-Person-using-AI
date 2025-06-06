import { MissingPerson } from './types';

export const mockMissingPersons: MissingPerson[] = [
  {
    id: '1',
    name: 'John Smith',
    age: 25,
    lastSeen: '2024-03-15',
    location: 'Central Park, New York',
    description: 'Last seen wearing a blue jacket and jeans',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    contactInfo: '+1 (555) 123-4567',
    dateReported: '2024-03-16',
    status: 'missing'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    age: 32,
    lastSeen: '2024-03-10',
    location: 'Downtown Seattle',
    description: 'Has a distinctive butterfly tattoo on right arm',
    photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
    contactInfo: '+1 (555) 987-6543',
    dateReported: '2024-03-11',
    status: 'missing'
  }
];