import { createAuthClient } from '@neon/auth';

export const NEON_AUTH_URL =
  (import.meta.env?.VITE_NEON_AUTH_URL as string) ||
  'https://ep-bitter-paper-azrnco1h.neonauth.c-3.ap-southeast-1.aws.neon.tech/neondb/auth';

export const authClient = createAuthClient(NEON_AUTH_URL);
