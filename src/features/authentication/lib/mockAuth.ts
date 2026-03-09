import { defaultMockAccounts, type MockAuthAccount } from '../constants/mockAccounts';
import type { AuthSessionUser } from '../types/auth.types';

const MOCK_ACCOUNTS_STORAGE_KEY = 'openalumns.auth.mockAccounts';

function canUseStorage() {
  return typeof window !== 'undefined';
}

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

function readStoredAccounts(): MockAuthAccount[] {
  if (!canUseStorage()) {
    return [...defaultMockAccounts];
  }

  const storedValue = window.localStorage.getItem(MOCK_ACCOUNTS_STORAGE_KEY);

  if (!storedValue) {
    window.localStorage.setItem(MOCK_ACCOUNTS_STORAGE_KEY, JSON.stringify(defaultMockAccounts));
    return [...defaultMockAccounts];
  }

  try {
    const parsed = JSON.parse(storedValue) as MockAuthAccount[];

    if (!Array.isArray(parsed) || parsed.length === 0) {
      throw new Error('Stored mock accounts are invalid');
    }

    return parsed;
  } catch {
    window.localStorage.setItem(MOCK_ACCOUNTS_STORAGE_KEY, JSON.stringify(defaultMockAccounts));
    return [...defaultMockAccounts];
  }
}

function writeStoredAccounts(accounts: MockAuthAccount[]) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(MOCK_ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
}

export function getMockAccounts() {
  return readStoredAccounts();
}

export function authenticateMockAccount(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();

  return readStoredAccounts().find(
    (account) =>
      account.email.trim().toLowerCase() === normalizedEmail && account.password === password,
  );
}

export function findMockAccountByEmail(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  return readStoredAccounts().find(
    (account) => account.email.trim().toLowerCase() === normalizedEmail,
  );
}

export function updateMockAccountPassword(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const accounts = readStoredAccounts();
  const accountIndex = accounts.findIndex(
    (account) => account.email.trim().toLowerCase() === normalizedEmail,
  );

  if (accountIndex < 0) {
    return null;
  }

  const updatedAccount = {
    ...accounts[accountIndex],
    password,
  };

  const nextAccounts = [...accounts];
  nextAccounts[accountIndex] = updatedAccount;
  writeStoredAccounts(nextAccounts);

  return updatedAccount;
}

export function toAuthSessionUser(account: MockAuthAccount): AuthSessionUser {
  return {
    id: account.id,
    fullName: account.fullName,
    email: account.email,
    avatarInitials: getInitials(account.fullName),
    profileHref: `/alumni/profiles/${account.profileSlug}`,
  };
}
