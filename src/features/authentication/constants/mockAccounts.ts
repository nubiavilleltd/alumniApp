// export interface MockAuthAccount {
//   id: string;
//   fullName: string;
//   email: string;
//   password: string;
//   profileSlug: string;
// }

// export const defaultMockAccounts: MockAuthAccount[] = [
//   {
//     id: 'acct-john-doe',
//     fullName: 'John Doe',
//     email: 'john.doe@email.com',
//     password: 'Alumni123!',
//     profileSlug: 'john-doe',
//   },
//   {
//     id: 'acct-sarah-johnson',
//     fullName: 'Sarah Johnson',
//     email: 'sarah.johnson@email.com',
//     password: 'Alumni123!',
//     profileSlug: 'sarah-johnson',
//   },
//   {
//     id: 'acct-emma-rodriguez',
//     fullName: 'Emma Rodriguez',
//     email: 'emma.rodriguez@email.com',
//     password: 'Alumni123!',
//     profileSlug: 'emma-rodriguez',
//   },
// ] as const;







import type { AuthSessionUser } from '../types/auth.types';

export interface MockAuthAccount {
  // Auth
  id: string;
  slug: string;
  email: string;
  password: string;
  createdAt: string;
  role: 'member' | 'admin';

  // Registration fields
  surname: string;
  otherNames: string;
  nameInSchool: string;
  whatsappPhone: string;
  graduationYear: number;

  // Profile fields
  photo?: string;
  alternativePhone?: string;
  birthDate?: string;
  houseColor?: string;
  isClassCoordinator?: boolean;
  residentialAddress?: string;
  area?: string;
  city?: string;
  employmentStatus?: string;
  occupations?: string[];
  industrySectors?: string[];
  yearsOfExperience?: number;
  isVolunteer?: boolean;
}

export const defaultMockAccounts: MockAuthAccount[] = [
  {
    id: 'acct-adaeze-okonkwo',
    slug: 'adaeze-okonkwo',
    email: 'adaeze.okonkwo@email.com',
    password: 'Alumni123!',
    createdAt: '2024-03-15T10:30:00Z',
    role: 'admin',
    surname: 'Okonkwo',
    otherNames: 'Adaeze Chioma',
    nameInSchool: 'Adaeze Eze',
    whatsappPhone: '+234 8031234567',
    graduationYear: 1998,
    photo: 'https://images.unsplash.com/photo-1573497161161-c3e73707e25c?w=200&q=80',
    alternativePhone: '+234 9021234567',
    birthDate: '1980-06-12',
    houseColor: 'blue',
    isClassCoordinator: true,
    residentialAddress: '14 Admiralty Way, Lekki Phase 1',
    area: 'lekki',
    city: 'Lagos',
    employmentStatus: 'business-owner',
    occupations: ['entrepreneur', 'consultant'],
    industrySectors: ['banking-finance', 'nonprofit'],
    yearsOfExperience: 20,
    isVolunteer: true,
  },
  {
    id: 'acct-ngozi-ibrahim',
    slug: 'ngozi-ibrahim',
    email: 'ngozi.ibrahim@email.com',
    password: 'Alumni123!',
    createdAt: '2024-04-02T09:15:00Z',
    role: 'member',
    surname: 'Ibrahim',
    otherNames: 'Ngozi Blessing',
    nameInSchool: 'Ngozi Okafor',
    whatsappPhone: '+234 8056789012',
    graduationYear: 2002,
    photo: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&q=80',
    alternativePhone: '+234 7034567890',
    birthDate: '1984-11-03',
    houseColor: 'red',
    isClassCoordinator: false,
    residentialAddress: '5 Bode Thomas Street, Surulere',
    area: 'surulere',
    city: 'Lagos',
    employmentStatus: 'employed-full-time',
    occupations: ['doctor'],
    industrySectors: ['healthcare'],
    yearsOfExperience: 16,
    isVolunteer: false,
  },
  {
    id: 'acct-chidinma-eze',
    slug: 'chidinma-eze',
    email: 'chidinma.eze@email.com',
    password: 'Alumni123!',
    createdAt: '2024-04-20T14:45:00Z',
    role: 'member',
    surname: 'Eze',
    otherNames: 'Chidinma Sandra',
    nameInSchool: 'Chidinma Eze',
    whatsappPhone: '+234 8078901234',
    graduationYear: 2005,
    photo: 'https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?w=200&q=80',
    birthDate: '1987-02-28',
    houseColor: 'green',
    isClassCoordinator: true,
    residentialAddress: '22 Wuse Zone 5',
    area: 'abuja',
    city: 'Abuja',
    employmentStatus: 'self-employed',
    occupations: ['software-developer', 'entrepreneur'],
    industrySectors: ['information-technology'],
    yearsOfExperience: 11,
    isVolunteer: true,
  },
] as const;
