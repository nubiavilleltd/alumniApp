// export interface LeadershipMember {
//   id: number;
//   name: string;
//   role: string;
//   image: string;
//   featured?: boolean;
//   bio?: string;
// }

// features/leadership/types/leadership.types.ts

export interface LeadershipMember {
  // ── Relational keys ──────────────────────────────────────────────────────
  memberId: string; // FK → MockAuthAccount.memberId
  chapterId?: string; // FK → Chapter.chapterId

  // ── Identity ──────────────────────────────────────────────────────────────
  id: number; // legacy display ordering key
  name: string;
  role: string; // 'President', 'Vice President', 'Secretary', etc.
  image: string;

  // ── Optional ──────────────────────────────────────────────────────────────
  featured?: boolean;
  bio?: string;
  since?: string; // ISO date — when they took on this role
}



export interface LeadershipFormPayload {
  memberId: string; // → user_id
  role: string; // → position_title
  photoFile?: File; // → leadership_photo (optional; backend falls back to avatar if omitted)
}


export interface LeadershipPositionOption {
  value: string;
  label: string;
}

export interface AdminFormPayload {
  memberId: string; // → user_id
  role: string; // → position_title
}



