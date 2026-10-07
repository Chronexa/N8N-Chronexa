/** Brand marks for the growth pages. Files in public/logos and public/logos/tools. */
const T = (f: string) => `/logos/tools/${f}.svg`;
export const LOGOS: Record<string, string> = {
  Slack: '/logos/slack.svg', Gmail: '/logos/gmail.svg', Outlook: T('microsoftoutlook'), Teams: T('microsoftteams'),
  'Google Sheets': '/logos/googlesheets.svg', 'Google Drive': '/logos/gdrive.svg', 'Google Docs': T('googledocs'),
  Excel: T('microsoftexcel'), PowerPoint: T('microsoftpowerpoint'), SharePoint: '/logos/sharepoint.png',
  HubSpot: T('hubspot'), Salesforce: '/logos/salesforce.svg', Pipedrive: '/logos/zoho.svg', Zoho: '/logos/zoho.svg',
  QuickBooks: T('quickbooks'), Xero: T('xero'), Stripe: '/logos/stripe.png',
  Notion: T('notion'), Airtable: '/logos/airtable.svg', ClickUp: T('clickup'), Asana: T('asana'), Trello: '/logos/trello.svg', Jira: '/logos/jira.svg',
  Zendesk: T('zendesk'), Intercom: T('intercom'), Mailchimp: T('mailchimp'), Dropbox: T('dropbox'),
  Postgres: T('postgresql'), MySQL: T('mysql'), Snowflake: '/logos/snowflake.svg', Looker: T('looker'), SAP: '/logos/sap.svg', Oracle: '/logos/oracle.svg',
  Claude: T('claude'), ChatGPT: '/logos/openai.svg', OpenAI: '/logos/openai.svg', Gemini: '/logos/gemini.svg', Cursor: T('cursor'), Perplexity: '/logos/perplexity.svg',
  GitHub: '/logos/github.svg', AWS: '/logos/aws.svg', Twilio: '/logos/twilio.png', ElevenLabs: '/logos/elevenlabs.svg', Calendly: T('calendly'), WhatsApp: '/logos/whatsapp.svg',
  n8n: '/logos/n8n.svg', Zapier: T('zapier'), Make: T('make'), DocuSign: '/logos/docusign.svg', Shopify: '/logos/shopify.svg',
};
export const logoFor = (name: string) => LOGOS[name];
