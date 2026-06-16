// Canonical public site URL, used for metadata (OG/canonical), robots and the
// sitemap. Set APP_URL in production to the real domain (e.g.
// https://verumbiolabs.com); falls back to a placeholder for local/dev.
export const SITE_URL = (
  process.env.APP_URL ?? "https://verum-biolabs.test"
).replace(/\/$/, "");

/** Public support address, overridable via SUPPORT_EMAIL. */
export const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL ?? "support@verum-biolabs.test";
