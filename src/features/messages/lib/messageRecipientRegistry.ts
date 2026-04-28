interface MessageRecipientRegistryEntry {
  memberId: string;
  fullName: string;
  avatar?: string;
  headline?: string;
  location?: string;
  graduationYear?: number;
  slug?: string;
  profileHref?: string;
}

const STORAGE_KEY = 'alumniapp.messages.recipientRegistry.v1';

function canUseStorage() {
  return typeof window !== 'undefined';
}

function readRegistry(): Record<string, MessageRecipientRegistryEntry> {
  if (!canUseStorage()) return {};

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return {};

  try {
    const parsed = JSON.parse(raw) as Record<string, MessageRecipientRegistryEntry>;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function writeRegistry(registry: Record<string, MessageRecipientRegistryEntry>) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(registry));
}

export function registerMessageRecipient(entry: MessageRecipientRegistryEntry) {
  if (!entry.memberId || !entry.fullName.trim()) return;

  const registry = readRegistry();
  registry[entry.memberId] = {
    ...registry[entry.memberId],
    ...entry,
  };
  writeRegistry(registry);
}

export function getRegisteredMessageRecipient(memberId: string) {
  if (!memberId) return undefined;
  return readRegistry()[memberId];
}

export function resetRegisteredMessageRecipients() {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(STORAGE_KEY);
}
