import { defaultMockAccounts, type MockAuthAccount } from '../constants/mockAccounts';
export { toAuthSessionUser } from '../utils/authUtils';

const MOCK_ACCOUNTS_STORAGE_KEY = 'openalumns.auth.mockAccounts';

function canUseStorage() {
  return typeof window !== 'undefined';
}

function readStoredAccounts(): MockAuthAccount[] {
  if (!canUseStorage()) return [...defaultMockAccounts];

  const storedValue = window.localStorage.getItem(MOCK_ACCOUNTS_STORAGE_KEY);
  if (!storedValue) {
    window.localStorage.setItem(MOCK_ACCOUNTS_STORAGE_KEY, JSON.stringify(defaultMockAccounts));
    return [...defaultMockAccounts];
  }
  try {
    const parsed = JSON.parse(storedValue) as MockAuthAccount[];
    if (!Array.isArray(parsed) || parsed.length === 0) throw new Error('Invalid');
    return parsed;
  } catch {
    window.localStorage.setItem(MOCK_ACCOUNTS_STORAGE_KEY, JSON.stringify(defaultMockAccounts));
    return [...defaultMockAccounts];
  }
}

function writeStoredAccounts(accounts: MockAuthAccount[]) {
  if (!canUseStorage()) return;
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

export function getMockAccountByMemberId(memberId: string) {
  return readStoredAccounts().find((account) => account.memberId === memberId);
}

export function updateMockAccountPassword(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const accounts = readStoredAccounts();
  const index = accounts.findIndex(
    (account) => account.email.trim().toLowerCase() === normalizedEmail,
  );
  if (index < 0) return null;

  const updatedAccount = { ...accounts[index], password };
  const nextAccounts = [...accounts];
  nextAccounts[index] = updatedAccount;
  writeStoredAccounts(nextAccounts);
  return updatedAccount;
}
