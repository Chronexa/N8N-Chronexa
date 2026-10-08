/**
 * Per-page identity for the growth pages: accent colour, hero visual, tool logos and an
 * example engagement. Stories are composites written to show how an engagement runs;
 * they are labelled as examples on the page and never name a client.
 */
export type Visual =
  | { type: 'list'; title: string; rows: { k: string; v?: string }[]; foot?: string }
  | { type: 'timeline'; title: string; days: { d: string; t: string; done?: boolean }[]; foot?: string }
  | { type: 'board'; title: string; before: string[]; after: string[] }
  | { type: 'bars'; title: string; rows: { k: string; v: number; label: string }[]; foot?: string }
  | { type: 'chat'; title: string; q: string; steps: string[]; a: string; sources: string[] }
  | { type: 'hub'; title: string; center: string; tools: string[]; foot?: string }
  | { type: 'slack'; channel: string; time: string; lines: { k: string; t: string }[] }
  | { type: 'inbox'; rows: { from: string; s: string; tag: string; tone: 'hot' | 'draft' | 'done' | 'esc' }[] }
  | { type: 'migrate'; from: string[]; to: string[]; steps: { k: string; v: string }[] }
  | { type: 'ladder'; levels: { k: string; d: string; v: string }[] }
  | { type: 'roi' };

export type Extra = {
  accent: string;
  visual: Visual;
  tools: string[];
  story: { label: string; who: string; situation: string; built: string[]; result: { k: string; v: string }[] };
  buildsStyle?: 'cards' | 'list';
  flip?: boolean;
};

export const EXTRAS: Record<string, Extra> = {
  'how-we-work': {
    accent: '#dbfa80',
    visual: { type: 'timeline', title: 'YOUR FIRST WEEK WITH US', days: [
      { d: 'MON', t: 'Founder session: goals and the one lever', done: true },
      { d: 'TUE', t: 'Audit: tools, workflows, people, knowledge', done: true },
      { d: 'WED', t: 'Pick the highest-return workflow', done: true },
      { d: 'THU', t: 'Build on your real tools' },
      { d: 'FRI', t: 'Live, measured, handed to your team' },
    ], foot: 'Free. If it does not save time, you keep the audit and walk away.' },
    tools: ['Slack', 'Gmail', 'HubSpot', 'QuickBooks', 'Notion', 'n8n', 'Claude'],
    story: { label: 'EXAMPLE ENGAGEMENT', who: 'A 14-person accounting practice', situation: 'The founders wanted to grow from 120 to 200 clients without hiring. The audit showed 40% of staff time went on chasing documents and retyping figures between three tools.',
      built: ['Week 1 (free): automatic document chasing from the practice system', 'Weeks 2–4: client data synced across CRM, accounting and the document store', 'Month 2: a reviewer agent checking returns against the firm’s rules before partner sign-off'],
      result: [{ k: 'Staff hours on chasing', v: '-75%' }, { k: 'Clients per staff member', v: '2×' }, { k: 'New hires needed', v: '0' }] },
  },
  'ai-automation-agency': {
    accent: '#dbfa80',
    visual: { type: 'board', title: 'A TYPICAL MONDAY', before: ['Pull numbers from 4 tools', 'Write the client report', 'Answer 60 emails', 'Update the CRM by hand', 'Chase 12 missing documents'], after: ['Briefing waiting in Slack', 'Report drafted, needs 10 min review', 'Inbox sorted, replies drafted', 'CRM updated from email', 'Chasing runs itself'] },
    tools: ['Slack', 'Gmail', 'HubSpot', 'Salesforce', 'QuickBooks', 'Notion', 'Claude'],
    story: { label: 'EXAMPLE ENGAGEMENT', who: 'A 30-person B2B consultancy', situation: 'Consultants spent Fridays building client reports and Mondays catching up on email. Growth meant hiring analysts whose main job would be copying data.',
      built: ['Free first workflow: weekly client reports drafted from their CRM and time tracker', 'A company knowledge base of past reports, rates and methods', 'Inbox triage with drafted replies for every consultant'],
      result: [{ k: 'Report time per client', v: '6h → 1h' }, { k: 'Analyst hires avoided', v: '3' }, { k: 'Revenue per employee', v: '+60%' }] },
  },
  'ai-strategy-consulting': {
    accent: '#ffd36e',
    visual: { type: 'bars', title: 'YOUR AI ROADMAP, RANKED BY RETURN', rows: [
      { k: 'Client reporting automation', v: 100, label: '$140k/yr' },
      { k: 'Knowledge base for proposals', v: 64, label: '$90k/yr' },
      { k: 'Inbox and follow-up agent', v: 43, label: '$60k/yr' },
      { k: 'CRM data clean-up', v: 18, label: '$25k/yr' },
      { k: 'Website chatbot', v: 4, label: 'Not yet' },
    ], foot: 'Example roadmap. Your audit produces the real one.' },
    tools: ['Notion', 'Google Sheets', 'HubSpot', 'Slack', 'ChatGPT', 'Claude', 'Looker'],
    story: { label: 'EXAMPLE ENGAGEMENT', who: 'A 60-person marketing agency', situation: 'Leadership had a list of 25 AI ideas from a workshop and no idea which to start. The most popular idea, a client-facing chatbot, would have returned almost nothing.',
      built: ['A two-session audit mapping hours by team and task', 'A roadmap of 12 opportunities ranked by return', 'The top item, automated campaign reporting, built free in week one'],
      result: [{ k: 'Ideas cut from the list', v: '13' }, { k: 'First result', v: 'Day 7' }, { k: 'Hours back per month', v: '220' }] },
    buildsStyle: 'list',
  },
  'ai-consultant': {
    accent: '#f6c1d9',
    visual: { type: 'chat', title: 'ASK AN AI CONSULTANT', q: 'We have 25 AI ideas from a workshop. Where do we start?', steps: ['Mapped hours by team and task', 'Scored each idea on return and risk', 'Checked tools and data access'], a: 'Start with weekly client reporting: it frees the most hours and uses data you already have. The website chatbot can wait.', sources: ['Time map', 'Roadmap v1', 'Tool review'] },
    tools: ['Slack', 'Gmail', 'HubSpot', 'Notion', 'Google Sheets', 'QuickBooks', 'Claude'],
    story: { label: 'EXAMPLE ENGAGEMENT', who: 'A 45-person professional services firm', situation: 'Leadership had a long list of AI ideas from an offsite and two earlier vendor proposals that never shipped. Nobody could say which idea would pay back first.',
      built: ['A two-session audit mapping hours by team and task', 'A roadmap ranked by return, with the risky ideas parked', 'The top item, automated client reporting, built free inside the first week'],
      result: [{ k: 'Ideas parked', v: '14' }, { k: 'First live workflow', v: 'Day 7' }, { k: 'Hours back per month', v: '180' }] },
    buildsStyle: 'list',
  },
  'ai-knowledge-systems': {
    accent: '#b8f2c8',
    visual: { type: 'chat', title: 'ASK THE COMPANY BRAIN', q: 'What did we charge the last three clients for a full audit, and what discount rules apply?', steps: ['Searched 412 past proposals', 'Read pricing policy v7', 'Checked who may approve discounts'], a: '$18k, $22k and $19.5k. Discounts above 10% need a partner. One of the three had a multi-year rate.', sources: ['Proposal_Acme_2026.pdf', 'Pricing policy v7', 'Approval matrix'] },
    tools: ['Google Drive', 'SharePoint', 'Notion', 'Slack', 'Gmail', 'Claude', 'Postgres'],
    story: { label: 'EXAMPLE ENGAGEMENT', who: 'A 40-person advisory firm', situation: 'Two senior partners answered most internal questions and rewrote most drafts. Every new hire took four months to stop asking them.',
      built: ['Past proposals, reports and policies organised into one knowledge layer', 'Interviews with the partners to write down how they decide', 'An internal Q&A agent and a reviewer agent that cite every source'],
      result: [{ k: 'Partner hours on questions', v: '-70%' }, { k: 'New-hire ramp-up', v: '4 → 1.5 months' }, { k: 'Drafts rewritten by partners', v: '-60%' }] },
    flip: true,
  },
  'ai-integration-services': {
    accent: '#9fd8ff',
    visual: { type: 'hub', title: 'ONE CONNECTED STACK', center: 'Your data', tools: ['HubSpot', 'QuickBooks', 'Slack', 'Google Sheets', 'Gmail', 'Postgres'], foot: 'Every connection logs what it moved and alerts a person when something fails.' },
    tools: ['HubSpot', 'Salesforce', 'QuickBooks', 'Xero', 'Slack', 'Google Sheets', 'Postgres'],
    story: { label: 'EXAMPLE ENGAGEMENT', who: 'A 25-person property services company', situation: 'Jobs lived in an old desktop system, invoices in QuickBooks and customers in a CRM. An admin team of four retyped everything between them.',
      built: ['A bridge on top of the legacy system’s database, no replacement needed', 'Two-way sync between jobs, invoices and the CRM', 'Daily exception report for the few records that do not match'],
      result: [{ k: 'Hours retyping per week', v: '60 → 5' }, { k: 'Invoice errors', v: '-90%' }, { k: 'Systems replaced', v: '0' }] },
  },
  'custom-mcp-server-development': {
    accent: '#ffb38a',
    visual: { type: 'chat', title: 'CLAUDE + YOUR INTERNAL SYSTEMS', q: 'Which jobs for Harbor Foods are overdue, and draft an update to their ops lead.', steps: ['get_client("Harbor Foods")', 'list_jobs(status="overdue")', 'get_contact(role="ops lead")', 'create_draft_email(…) → waiting for approval'], a: '3 jobs overdue, longest by 6 days. Draft ready for your approval in Gmail.', sources: ['jobs-db (read)', 'crm (read)', 'gmail (draft only)'] },
    tools: ['Claude', 'ChatGPT', 'Cursor', 'n8n', 'Postgres', 'MySQL', 'Slack'],
    story: { label: 'EXAMPLE ENGAGEMENT', who: 'A 50-person logistics company', situation: 'Everyone used Claude daily, but the job system that ran the business was a 12-year-old internal tool. Answers about live jobs still meant opening five screens or asking ops.',
      built: ['A custom MCP server on the job database: read tools first', 'Per-user permissions copied from the existing system', 'Write actions (draft emails, status updates) behind approval, all logged'],
      result: [{ k: 'Ops questions answered in chat', v: '80%' }, { k: 'Time per lookup', v: '6 min → 20 s' }, { k: 'Unlogged AI actions', v: '0' }] },
    flip: true,
  },
  'ai-agent-development': {
    accent: '#dbfa80',
    visual: { type: 'list', title: 'AGENT: report-reviewer', rows: [
      { k: 'Read the draft client report', v: 'done' },
      { k: 'Check figures against source data', v: '2 issues' },
      { k: 'Check house style and rules', v: 'pass' },
      { k: 'Fix the routine issue itself', v: 'fixed' },
      { k: 'Escalate the judgement call', v: 'to partner' },
    ], foot: 'The agent approves the routine and escalates the rest. A person still owns the outcome.' },
    tools: ['Claude', 'OpenAI', 'n8n', 'Slack', 'Google Docs', 'Notion', 'HubSpot'],
    story: { label: 'EXAMPLE ENGAGEMENT', who: 'A 20-person research boutique', situation: 'Every client report went through three rounds of senior review. Most comments were the same: wrong number, off-style phrasing, missing source.',
      built: ['A knowledge layer of house style, past reports and data sources', 'A reviewer agent that checks every draft and fixes routine issues', 'Escalation to a senior only for judgement calls, with the evidence attached'],
      result: [{ k: 'Review rounds per report', v: '3 → 1' }, { k: 'Senior hours per week', v: '-18' }, { k: 'Errors reaching clients', v: 'Near zero' }] },
    buildsStyle: 'list',
  },
  'ai-roi-calculator': {
    accent: '#dbfa80',
    visual: { type: 'roi' },
    tools: ['Google Sheets', 'Excel', 'QuickBooks', 'HubSpot', 'Slack', 'Notion', 'Claude'],
    story: { label: 'EXAMPLE ENGAGEMENT', who: 'A 10-person bookkeeping firm', situation: 'The firm served 100 clients a month and turned new ones away. Each client took about six hours of manual reconciliation and chasing.',
      built: ['Bank and invoice data pulled automatically into the ledger', 'Exceptions flagged for review instead of every line checked', 'Monthly client summaries drafted automatically'],
      result: [{ k: 'Manual hours per client', v: '6 → 2' }, { k: 'Clients with the same team', v: '100 → 220' }, { k: 'Revenue per employee', v: '2.2×' }] },
  },
  'automated-reporting': {
    accent: '#ffd36e',
    visual: { type: 'slack', channel: '#founders', time: '7:58 AM', lines: [
      { k: '📈 Pipeline', t: '3 deals moved, 1 stalled for 14 days' },
      { k: '💸 Cash', t: '2 invoices overdue, $18,400' },
      { k: '⚠️ Clients', t: 'Northwind asked twice about timelines' },
      { k: '✅ Today', t: '2 deliverables due, both on track' },
      { k: '🎯 Your three priorities', t: 'Call Northwind · approve Q4 deck · sign 2 offers' },
    ] },
    tools: ['Slack', 'Teams', 'Google Sheets', 'Excel', 'PowerPoint', 'HubSpot', 'QuickBooks'],
    story: { label: 'EXAMPLE ENGAGEMENT', who: 'A 35-person digital agency', situation: 'Account managers rebuilt 40 monthly client reports by hand, and the founders started each day by opening six dashboards.',
      built: ['Free first workflow: the founders’ morning briefing in Slack', 'Monthly client reports drafted from ad, analytics and CRM data', 'Commentary written in the agency’s voice, approved in one click'],
      result: [{ k: 'Hours per report', v: '6 → 1' }, { k: 'Reporting hours per month', v: '240 → 40' }, { k: 'Founder dashboard time', v: '45 → 5 min' }] },
    flip: true,
  },
  'ai-email-management': {
    accent: '#cdb8ff',
    visual: { type: 'inbox', rows: [
      { from: 'Sarah · Northwind', s: 'Where are we on the Q4 delivery?', tag: 'Reply drafted', tone: 'draft' },
      { from: 'James · referral', s: 'Intro: looking for a new provider', tag: 'Urgent', tone: 'hot' },
      { from: 'Accounts · Acme', s: 'Question about invoice #2041', tag: 'Reply drafted', tone: 'draft' },
      { from: 'Legal · Delta Co', s: 'Proposed contract changes', tag: 'To partner', tone: 'esc' },
      { from: '31 newsletters and pitches', s: 'Filed automatically', tag: 'Filed', tone: 'done' },
    ] },
    tools: ['Gmail', 'Outlook', 'HubSpot', 'Salesforce', 'Slack', 'Notion', 'Claude'],
    story: { label: 'EXAMPLE ENGAGEMENT', who: 'A 12-person wealth advisory practice', situation: 'Advisors spent the first two hours of every day in email. Routine client questions about statements and transfers took the same answers, retyped.',
      built: ['Triage across advisor and shared inboxes', 'Drafted replies using client history and the firm’s policies', 'CRM notes and follow-up tasks created from every thread'],
      result: [{ k: 'Inbox time per advisor', v: '2.5h → 1h' }, { k: 'First reply', v: 'Same morning' }, { k: 'Missed follow-ups', v: 'Near zero' }] },
  },
  'ai-training-for-employees': {
    accent: '#ffb38a',
    visual: { type: 'list', title: 'TRAINING PLAN BY ROLE', rows: [
      { k: 'Founders: AI for decisions and strategy', v: '2 h' },
      { k: 'Managers: reporting and review with AI', v: '3 h' },
      { k: 'Client teams: research, drafting, replies', v: '4 h' },
      { k: 'Ops: running and fixing automations', v: '4 h' },
      { k: 'Everyone: data safety and limits', v: '1 h' },
    ], foot: 'Built from your audit, using your own documents and workflows.' },
    tools: ['Claude', 'ChatGPT', 'Gemini', 'Cursor', 'n8n', 'Notion', 'Slack'],
    story: { label: 'EXAMPLE ENGAGEMENT', who: 'A 45-person professional services firm', situation: 'The firm had bought AI licences for everyone. Three months later, a fifth of staff used them, and some were pasting client data into personal accounts.',
      built: ['Approved tools set up with company knowledge connected', 'Role-based sessions on each team’s real work', 'Clear data rules and a channel for questions'],
      result: [{ k: 'Staff using AI daily', v: '20% → 85%' }, { k: 'Hours saved per person', v: '5+/week' }, { k: 'Unapproved tool use', v: 'Stopped' }] },
    flip: true,
  },
  'tech-stack-migration': {
    accent: '#9fd8ff',
    visual: { type: 'migrate', from: ['Excel', 'Trello', 'Zoho'], to: ['HubSpot', 'Notion', 'Postgres'], steps: [
      { k: 'Audit tools and data quality', v: 'Week 1' }, { k: 'Clean and map', v: 'Week 2' }, { k: 'Run both in parallel', v: 'Week 3' }, { k: 'Switch and train', v: 'Week 4' },
    ] },
    tools: ['Excel', 'Trello', 'Zoho', 'HubSpot', 'Notion', 'Airtable', 'Postgres'],
    story: { label: 'EXAMPLE ENGAGEMENT', who: 'An 18-person training company', situation: 'Customers lived in spreadsheets, projects in Trello and invoices in an old CRM. No report could be trusted, and nothing could be automated.',
      built: ['Recommendation: keep invoicing, replace the CRM and spreadsheets', 'Data cleaned, de-duplicated and migrated in parallel', 'Integrations rebuilt and the team trained on day one'],
      result: [{ k: 'Tools holding customer data', v: '4 → 1' }, { k: 'Licence cost', v: '-45%' }, { k: 'Downtime', v: '0 days' }] },
  },
  'what-is-ai-automation': {
    accent: '#dbfa80',
    visual: { type: 'ladder', levels: [
      { k: 'Rules', d: 'When X happens, do Y', v: 'Your tools do this' },
      { k: 'AI', d: 'Read, write, classify, summarise', v: 'Useful' },
      { k: 'AI + company knowledge', d: 'Acts like an experienced employee', v: 'Where value is' },
    ] },
    tools: ['Zapier', 'Make', 'n8n', 'Claude', 'ChatGPT', 'Slack', 'HubSpot'],
    story: { label: 'WORKED EXAMPLE', who: 'One email, three levels', situation: 'A client emails asking why their monthly fee went up. Here is what each level of automation does with it.',
      built: ['Rules: the email is forwarded to the account manager', 'AI: the email is read, tagged as a billing question and a generic reply drafted', 'AI + knowledge: the reply cites the client’s contract, last year’s rate and the price change notice, ready for approval'],
      result: [{ k: 'Time to answer', v: '1 day → 5 min' }, { k: 'Senior input needed', v: 'Approval only' }, { k: 'Answer quality', v: 'Specific' }] },
    buildsStyle: 'list',
  },
  'ai-automation-cost': {
    accent: '#ffd36e',
    visual: { type: 'bars', title: 'PAYBACK, EXAMPLE BUILD', rows: [
      { k: 'Month 1: audit + free workflow', v: 0, label: '$0' },
      { k: 'Month 2: first paid build', v: 35, label: 'Cost' },
      { k: 'Month 3: hours returned', v: 60, label: '+$8k' },
      { k: 'Month 4: extra clients', v: 85, label: '+$14k' },
      { k: 'Month 6: cumulative return', v: 100, label: '+$40k' },
    ], foot: 'Illustrative. Your audit estimates your own payback before you commit.' },
    tools: ['QuickBooks', 'Xero', 'Stripe', 'HubSpot', 'Google Sheets', 'n8n', 'Claude'],
    story: { label: 'EXAMPLE ENGAGEMENT', who: 'A 22-person recruitment agency', situation: 'The agency had quotes from three vendors between $4k and $60k for “AI automation” and no way to compare them.',
      built: ['Free audit: candidate screening and client updates ranked highest', 'Free first workflow: candidate summaries drafted from CVs and notes', 'Next build priced against the measured hours it saved'],
      result: [{ k: 'Paid before seeing results', v: '$0' }, { k: 'Payback on first paid build', v: '7 weeks' }, { k: 'Consultant hours back', v: '90/month' }] },
    flip: true,
  },
};
