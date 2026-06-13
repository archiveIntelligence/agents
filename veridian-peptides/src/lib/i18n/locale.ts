// Lightweight i18n: a locale cookie + flat message dictionaries.
// EN is the source locale; DE is a full translation of the app chrome and
// primary storefront surfaces. Add keys here and they are available to both
// the server `getServerT()` helper and the client `useT()` hook.

export type Locale = "en" | "de";

export const LOCALE_COOKIE = "vp.locale";
export const DEFAULT_LOCALE: Locale = "en";

export const LOCALES: { code: Locale; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "de", label: "DE" },
];

export function isLocale(value: unknown): value is Locale {
  return value === "en" || value === "de";
}

type Messages = Record<string, string>;

const en: Messages = {
  "nav.allPeptides": "All Peptides",
  "nav.stacks": "Research Stacks",
  "nav.quality": "Quality & Testing",
  "nav.coa": "COA Vault",
  "nav.blog": "Research Blog",
  "header.signIn": "Sign in",
  "header.cart": "Cart",
  "footer.tagline":
    "Independently tested research peptides. Supplied strictly for laboratory research. Not for human consumption.",
  "footer.products": "Products",
  "footer.company": "Company",
  "footer.support": "Support",
  "footer.legal": "Legal",
  "footer.rights": "For research use only.",
  "home.hero.badge": "Independently HPLC tested",
  "home.hero.titleA": "Research peptides you can",
  "home.hero.titleHighlight": "verify",
  "home.hero.lead":
    "Every batch is tested by an independent laboratory and published in our public COA vault. Traceable purity, transparent sourcing, fast EU shipping.",
  "home.hero.shopAll": "Shop all peptides",
  "home.hero.browseCoa": "Browse COA vault",
  "home.hero.disclaimer": "For laboratory and research use only. Not for human consumption.",
  "home.stats.purity": "Average tested purity",
  "home.stats.countries": "Countries shipped",
  "home.stats.coa": "Batches with public COA",
  "home.stats.shipping": "Tracked shipping from",
  "home.featured": "Featured research peptides",
  "home.categories": "Browse by research area",
  "home.blog": "From the research blog",
  "home.viewAll": "View all",
  "common.cookie.text": "We use essential cookies to run this site. See our",
  "common.cookie.settings": "cookie settings",
  "common.cookie.essential": "Essential only",
  "common.cookie.acceptAll": "Accept all",
};

const de: Messages = {
  "nav.allPeptides": "Alle Peptide",
  "nav.stacks": "Research-Stacks",
  "nav.quality": "Qualität & Tests",
  "nav.coa": "COA-Archiv",
  "nav.blog": "Research-Blog",
  "header.signIn": "Anmelden",
  "header.cart": "Warenkorb",
  "footer.tagline":
    "Unabhängig getestete Research-Peptide. Ausschließlich für Laborforschung. Nicht zum menschlichen Verzehr.",
  "footer.products": "Produkte",
  "footer.company": "Unternehmen",
  "footer.support": "Support",
  "footer.legal": "Rechtliches",
  "footer.rights": "Nur für Forschungszwecke.",
  "home.hero.badge": "Unabhängig per HPLC getestet",
  "home.hero.titleA": "Research-Peptide, die du",
  "home.hero.titleHighlight": "verifizieren",
  "home.hero.lead":
    "Jede Charge wird von einem unabhängigen Labor getestet und in unserem öffentlichen COA-Archiv veröffentlicht. Nachvollziehbare Reinheit, transparente Herkunft, schneller EU-Versand.",
  "home.hero.shopAll": "Alle Peptide ansehen",
  "home.hero.browseCoa": "COA-Archiv öffnen",
  "home.hero.disclaimer": "Nur für Labor- und Forschungszwecke. Nicht zum menschlichen Verzehr.",
  "home.stats.purity": "Durchschnittliche Reinheit",
  "home.stats.countries": "Belieferte Länder",
  "home.stats.coa": "Chargen mit öffentlichem COA",
  "home.stats.shipping": "Versand mit Tracking ab",
  "home.featured": "Ausgewählte Research-Peptide",
  "home.categories": "Nach Forschungsbereich stöbern",
  "home.blog": "Aus dem Research-Blog",
  "home.viewAll": "Alle ansehen",
  "common.cookie.text": "Wir verwenden essenzielle Cookies für den Betrieb dieser Seite. Siehe unsere",
  "common.cookie.settings": "Cookie-Einstellungen",
  "common.cookie.essential": "Nur essenzielle",
  "common.cookie.acceptAll": "Alle akzeptieren",
};

const messages: Record<Locale, Messages> = { en, de };

export type TranslateFn = (key: string) => string;

export function translator(locale: Locale): TranslateFn {
  const dict = messages[locale] ?? en;
  return (key: string) => dict[key] ?? en[key] ?? key;
}
