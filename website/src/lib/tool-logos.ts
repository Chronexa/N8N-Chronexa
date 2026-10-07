/**
 * Tool name → logo, for the n8n portfolio. Files live in public/logos (site-wide
 * set) and public/logos/tools (brand icons fetched from simple-icons).
 * A tool with no public brand mark gets a monogram tile in its own colour
 * instead of a wrong or borrowed logo.
 */
export type ToolLogoInfo = { name: string; src?: string; color: string; initials?: string };

const L = (name: string, src: string | undefined, color: string, initials?: string): ToolLogoInfo => ({ name, src, color, initials });

const REGISTRY: Record<string, ToolLogoInfo> = {
  "anthropic claude": L("Anthropic Claude", "/logos/anthropic.svg", "#d97757"),
  "openai": L("OpenAI", "/logos/openai.svg", "#10a37f"),
  "google gemini": L("Google Gemini", "/logos/gemini.svg", "#8e75b2"),
  "perplexity": L("Perplexity", "/logos/tools/perplexity.svg", "#1fb8cd"),
  "exa": L("Exa", undefined, "#1f40ed", "Ex"),
  "baserow": L("Baserow", "/logos/tools/baserow.svg", "#5190ef"),
  "airtable": L("Airtable", "/logos/tools/airtable.svg", "#18bfff"),
  "google sheets": L("Google Sheets", "/logos/googlesheets.svg", "#34a853"),
  "google drive": L("Google Drive", "/logos/gdrive.svg", "#4285f4"),
  "google docs": L("Google Docs", "/logos/tools/googledocs.svg", "#4285f4"),
  "google calendar": L("Google Calendar", "/logos/tools/googlecalendar.svg", "#4285f4"),
  "google search console": L("Google Search Console", "/logos/tools/googlesearchconsole.svg", "#458cf5"),
  "gmail": L("Gmail", "/logos/gmail.svg", "#ea4335"),
  "email (imap)": L("Email (IMAP)", undefined, "#64748b", "@"),
  "slack": L("Slack", "/logos/slack.svg", "#611f69"),
  "whatsapp business": L("WhatsApp Business", "/logos/whatsapp.svg", "#25d366"),
  "meta": L("Meta", "/logos/tools/meta.svg", "#0467df"),
  "meta lead ads": L("Meta Lead Ads", "/logos/tools/meta.svg", "#0467df"),
  "meta graph api": L("Meta Graph API", "/logos/tools/meta.svg", "#0467df"),
  "meta conversions api": L("Meta Conversions API", "/logos/tools/meta.svg", "#0467df"),
  "shopify": L("Shopify", "/logos/shopify.svg", "#95bf47"),
  "salesforce": L("Salesforce", "/logos/salesforce.svg", "#00a1e0"),
  "stripe": L("Stripe", "/logos/stripe.png", "#635bff"),
  "docusign": L("DocuSign", "/logos/docusign.svg", "#ffcc22"),
  "zoom": L("Zoom", "/logos/tools/zoom.svg", "#0b5cff"),
  "calendly": L("Calendly", "/logos/tools/calendly.svg", "#006bff"),
  "linkedin": L("LinkedIn", "/logos/linkedin.png", "#0a66c2"),
  "reddit": L("Reddit", "/logos/tools/reddit.svg", "#ff4500"),
  "sanity": L("Sanity", "/logos/tools/sanity.svg", "#0d0e12"),
  "elevenlabs": L("ElevenLabs", "/logos/elevenlabs.svg", "#111111"),
  "retell ai": L("Retell AI", undefined, "#6d5efc", "Re"),
  "crunchbase": L("Crunchbase", "/logos/tools/crunchbase.svg", "#0288d1"),
  "apollo.io": L("Apollo.io", "/logos/apollo.png", "#ffd23f"),
  "brevo": L("Brevo", "/logos/tools/brevo.svg", "#0b996e"),
  "manyreach": L("ManyReach", undefined, "#22c55e", "Mr"),
  "gohighlevel": L("GoHighLevel", undefined, "#f7941d", "GH"),
  "affinity crm": L("Affinity CRM", undefined, "#5b4fff", "Af"),
  "karbon": L("Karbon", undefined, "#3b82f6", "Ka"),
  "imgbb": L("ImgBB", undefined, "#1d9bf0", "Ib"),
  "n8n": L("n8n", "/logos/n8n.svg", "#ea4b71"),
  "webhook": L("Webhook", undefined, "#9b59b6", "Wh"),
  "n8n scheduler": L("n8n Scheduler", "/logos/n8n.svg", "#ea4b71"),
};

export function toolLogo(name: string): ToolLogoInfo {
  const hit = REGISTRY[name.trim().toLowerCase()];
  if (hit) return hit;
  return { name, color: "#173a2d", initials: name.replace(/[^A-Za-z]/g, "").slice(0, 2) || "•" };
}

/** One tile per product in the stack band: the three Meta APIs read as "Meta". */
export function canonicalTool(name: string): string {
  return /^meta /i.test(name) ? "Meta" : name;
}
