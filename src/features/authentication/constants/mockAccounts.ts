export interface MockAuthAccount {
  id: string;
  fullName: string;
  email: string;
  password: string;
  profileSlug: string;
}

export const defaultMockAccounts: MockAuthAccount[] = [
  {
    id: 'acct-john-doe',
    fullName: 'John Doe',
    email: 'john.doe@email.com',
    password: 'Alumni123!',
    profileSlug: 'john-doe',
  },
  {
    id: 'acct-sarah-johnson',
    fullName: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    password: 'Alumni123!',
    profileSlug: 'sarah-johnson',
  },
  {
    id: 'acct-emma-rodriguez',
    fullName: 'Emma Rodriguez',
    email: 'emma.rodriguez@email.com',
    password: 'Alumni123!',
    profileSlug: 'emma-rodriguez',
  },
] as const;
