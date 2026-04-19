const MARKETPLACE_DRAFT_PREFILL_STORAGE_KEY = 'messages.marketplaceDraftPrefills';
const MONTH_IN_MS = 30 * 24 * 60 * 60 * 1000;

type MarketplaceDraftPrefillStore = Record<string, number>;

function getStorageKey(buyerMemberId: string, businessId: string) {
  return `${buyerMemberId}:${businessId}`;
}

function readMarketplaceDraftPrefillStore(): MarketplaceDraftPrefillStore {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const rawValue = window.localStorage.getItem(MARKETPLACE_DRAFT_PREFILL_STORAGE_KEY);
    if (!rawValue) {
      return {};
    }

    const parsedValue = JSON.parse(rawValue);
    if (!parsedValue || typeof parsedValue !== 'object') {
      return {};
    }

    return Object.entries(
      parsedValue as Record<string, unknown>,
    ).reduce<MarketplaceDraftPrefillStore>((store, [key, value]) => {
      if (typeof value === 'number' && Number.isFinite(value)) {
        store[key] = value;
      }

      return store;
    }, {});
  } catch {
    return {};
  }
}

function writeMarketplaceDraftPrefillStore(store: MarketplaceDraftPrefillStore) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(MARKETPLACE_DRAFT_PREFILL_STORAGE_KEY, JSON.stringify(store));
  } catch {
    // Ignore storage write failures and allow the draft suggestion to behave as a best-effort UX hint.
  }
}

export function shouldPrefillMarketplaceDraft(params: {
  buyerMemberId: string;
  businessId: string;
  now?: number;
}) {
  const { buyerMemberId, businessId, now = Date.now() } = params;
  const store = readMarketplaceDraftPrefillStore();
  const lastPrefilledAt = store[getStorageKey(buyerMemberId, businessId)];

  if (typeof lastPrefilledAt !== 'number') {
    return true;
  }

  return now - lastPrefilledAt >= MONTH_IN_MS;
}

export function recordMarketplaceDraftPrefill(params: {
  buyerMemberId: string;
  businessId: string;
  now?: number;
}) {
  const { buyerMemberId, businessId, now = Date.now() } = params;
  const store = readMarketplaceDraftPrefillStore();

  store[getStorageKey(buyerMemberId, businessId)] = now;
  writeMarketplaceDraftPrefillStore(store);
}
