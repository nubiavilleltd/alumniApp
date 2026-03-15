// features/marketplace/types/marketplace.types.ts

// ─── Business entity ──────────────────────────────────────────────────────────
export interface Business {
  // ── Relational keys ──────────────────────────────────────────────────────
  businessId: string;   // 'BIZ-{year}-{seq}' — stable unique ID
  ownerId:    string;   // FK → MockAuthAccount.memberId

  // ── Identity ──────────────────────────────────────────────────────────────
  slug:     string;
  name:     string;
  owner:    string;     // display name — denormalised for convenience

  // ── Details ───────────────────────────────────────────────────────────────
  category:    string;
  description: string;
  location:    string;
  phone:       string;
  website?:    string;
  images:      string[];
}

// ─── Service params / payloads ────────────────────────────────────────────────
export interface GetMarketplaceParams {
  search?:   string;
  category?: string;
  page?:     number;
}

export interface PostBusinessPayload {
  name:        string;
  category:    string;
  description: string;
  location:    string;
  phone:       string;
  website?:    string;
  images:      File[];
}