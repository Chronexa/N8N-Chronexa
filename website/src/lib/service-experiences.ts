export type ServiceScenario = {
  label: string; input: string; stages: string[]; result: string; reason: string;
};
export type ServiceExperience = {
  title: string; intro: string; audience: string; question: string;
  mode: 'estimate' | 'priority' | 'document' | 'invoice' | 'timeline' | 'record' | 'ticket' | 'agent' | 'knowledge' | 'deployment' | 'integration' | 'legacy';
  layout: 'editorial' | 'workbench' | 'architecture';
  accent: string; outcome: string; measure: string; boundary: string;
  detailTitle?: string;
  scenarios: ServiceScenario[];
};

// Service-specific decision aids. Examples are illustrative, never production
// screenshots, client evidence, live integrations or performance promises.
export const serviceExperiences: Record<string, ServiceExperience> = {
  'ai-automation': {
    title: 'AI automation that fits the way you work.',
    intro: 'We build AI agents and automation for the repetitive work between your systems. Start with one process, agree how to measure it, and put it into use with your team.',
    audience: 'For operations teams handling the same work at growing volume.',
    mode: 'estimate', layout: 'editorial', accent: '#286148',
    question: 'How much time does one process use?',
    outcome: 'More capacity in the team you already have.',
    measure: 'Minutes of manual work per item, exception rate and completed volume.',
    boundary: 'Freed capacity is not automatically cash saved. We include running costs and remaining review work in the business case.',
    scenarios: [],
  },
  'business-process-automation-consulting': {
    title: 'Find the process worth automating first.',
    intro: 'Business process automation consulting that maps the actual work, costs the handoffs and gives you a practical order for investment.',
    audience: 'For leaders choosing between several automation projects.',
    mode: 'priority', layout: 'editorial', accent: '#66532f',
    question: 'Which kind of bottleneck are you dealing with?',
    outcome: 'A reasoned investment decision before a build starts.',
    measure: 'Time spent, frequency, exception rate and effort to implement.',
    boundary: 'The assessment produces a map and recommendation. A software build is a separate scope.',
    scenarios: [
      { label: 'Repeated data entry', input: 'The same fields move between systems every day.', stages: ['Observe the handoff', 'Count volume and handling time', 'Check access to both systems'], result: 'Assess for automation', reason: 'A frequent task with stable rules is a strong candidate. Confirm the exceptions before estimating savings.' },
      { label: 'Slow approvals', input: 'Work sits in a queue waiting for a decision.', stages: ['Identify the owner', 'Separate waiting from working', 'Review approval rules'], result: 'Fix the decision path first', reason: 'Routing and reminders can help. Software will not resolve an unclear approval policy.' },
      { label: 'One-off analysis', input: 'A different question arrives each month.', stages: ['Review the variation', 'Identify repeatable preparation', 'Keep judgement with the team'], result: 'Automate preparation selectively', reason: 'A fully automated process may cost more than it returns. Start with gathering and organising inputs.' },
    ],
  },
  'document-processing-automation': {
    title: 'From documents to data you can use.',
    intro: 'Document processing automation that reads PDFs, scans and forms, checks the fields and writes approved data into your systems.',
    audience: 'For teams copying information from recurring business documents.',
    mode: 'document', layout: 'workbench', accent: '#335b83',
    detailTitle: 'Check the fields before updating your records.',
    question: 'What happens when a document is unclear?',
    outcome: 'Your team reviews the exceptions and keeps the source in view.',
    measure: 'Field accuracy, review time and successful write-back on your sample documents.',
    boundary: 'Unreadable or conflicting fields wait for review. No value is filled in merely to complete a record.',
    scenarios: [
      { label: 'Readable form', input: 'Document: inspection form\nProperty reference: P-1042\nInspection date: 12 Sep 2026', stages: ['Classify the document', 'Extract reference and date', 'Validate required fields'], result: 'Ready for approved write-back', reason: 'Each value retains a reference to the original page so a reviewer can check it.' },
      { label: 'Unclear scan', input: 'Document: inspection form\nProperty reference: P-10?2\nInspection date: 12 Sep 2026', stages: ['Detect an uncertain field', 'Keep the original scan attached', 'Request reviewer confirmation'], result: 'Held for review', reason: 'The reference is incomplete. The system must not guess which property this belongs to.' },
    ],
  },
  'accounts-payable-automation': {
    title: 'Invoice processing with the checks built in.',
    intro: 'Accounts payable automation for capture, matching and approval routing. Finance keeps control of exceptions and posting.',
    audience: 'For finance teams managing invoice backlogs and approval queues.',
    mode: 'invoice', layout: 'workbench', accent: '#7b5038',
    detailTitle: 'A match is not payment approval.',
    question: 'Follow an invoice through the approval rules.',
    outcome: 'Less retyping. A clearer path from receipt to approval.',
    measure: 'Manual touches per invoice, approval time and duplicate exceptions.',
    boundary: 'Preparing an invoice does not authorise a payment. Posting and payment permissions are agreed separately.',
    scenarios: [
      { label: 'Matches the order', input: 'Invoice INV-042\nInvoice total: $2,400\nPurchase order: $2,400', stages: ['Check supplier and invoice ID', 'Match against the purchase order', 'Route to the named approver'], result: 'Ready for approval', reason: 'The amounts agree. A finance approver still authorises the next step under your policy.' },
      { label: 'Amount mismatch', input: 'Invoice INV-042\nInvoice total: $2,640\nPurchase order: $2,400', stages: ['Read the invoice total', 'Detect a $240 difference', 'Attach both records for review'], result: 'Posting blocked', reason: 'The difference exceeds the zero-tolerance rule in this example. Your team defines the real tolerance.' },
      { label: 'Duplicate', input: 'Invoice INV-042\nSupplier: Example supplier\nSame invoice already recorded', stages: ['Check supplier and invoice ID', 'Find the earlier record', 'Link the duplicate to the original'], result: 'Duplicate held', reason: 'No second posting is created. A reviewer can inspect the original transaction.' },
    ],
  },
  'ai-sales-outreach-engine': {
    title: 'A clear path from new lead to sales conversation.',
    intro: 'We connect lead research, CRM routing, email follow-up and AI voice agents. Your sales team gets the context and takes over when a conversation needs them.',
    audience: 'For B2B teams losing time between an enquiry and a useful response.',
    mode: 'timeline', layout: 'editorial', accent: '#335b83',
    question: 'See what changes when a lead replies.',
    outcome: 'Consistent follow-up with a clear human handover.',
    measure: 'Time to first response, qualified conversations, meetings attended and pipeline created.',
    boundary: 'Messaging, sending limits and approval rules are agreed with you. A reply stops the sequence; sales judgement stays human.',
    scenarios: [
      { label: 'New enquiry', input: 'A prospect requests a product conversation.', stages: ['Research company and fit', 'Create or update the CRM record', 'Prepare an approved first response', 'Schedule the next follow-up'], result: 'A lead with context and a named owner', reason: 'Research, routing and follow-up work inside the existing sales process. This example shows logic, not a promised response time.' },
      { label: 'Prospect replies', input: '“Can we discuss integration with our CRM?”', stages: ['Detect the reply', 'Cancel queued follow-ups', 'Attach conversation and research', 'Notify the account owner'], result: 'Sequence stopped. Sales takes over.', reason: 'The next action is a relevant conversation, not another automated follow-up.' },
      { label: 'Voice handover', input: 'A scheduling call becomes a technical question.', stages: ['Identify the automated assistant', 'Capture the question', 'Stop outside the approved scope', 'Arrange a call with the right person'], result: 'Context passed to a human', reason: 'Voice is optional. It handles agreed qualification and scheduling tasks, with disclosure and defined escalation.' },
    ],
  },
  'crm-automation-services': {
    title: 'A CRM that reflects what is actually happening.',
    intro: 'CRM automation services that capture activity, route work and connect account information across sales, finance and support.',
    audience: 'For teams whose reporting depends on people remembering to update records.',
    mode: 'record', layout: 'workbench', accent: '#566449',
    detailTitle: 'Each field has an owner.',
    question: 'Which system should own each field?',
    outcome: 'Current account records with fewer manual updates.',
    measure: 'Missing fields, duplicate records, routing time and reporting consistency.',
    boundary: 'We define field ownership before connecting systems. A deliberate sales update is not silently overwritten by a sync.',
    scenarios: [
      { label: 'New lead', input: 'Email: buyer@example.com\nCompany: Example Co\nOwner: not assigned', stages: ['Match by agreed identity fields', 'Check for an existing account', 'Assign by territory rules'], result: 'One record, assigned to the right owner', reason: 'Existing records are updated instead of creating a second account for every enquiry.' },
      { label: 'Finance update', input: 'CRM: invoice status unknown\nAccounting: invoice overdue\nSales owner: Priya', stages: ['Read accounting status', 'Update the finance-owned field', 'Keep the sales owner unchanged'], result: 'Sales sees the overdue invoice', reason: 'Accounting owns payment status. Sales owns the relationship. The integration respects both.' },
    ],
  },
  'customer-support-automation': {
    title: 'Resolve routine requests. Keep people close.',
    intro: 'Customer support automation connected to your helpdesk, billing and order systems. Routine requests get handled; complex cases reach a person with context.',
    audience: 'For support teams spending their day on repeat requests.',
    mode: 'ticket', layout: 'workbench', accent: '#286148',
    detailTitle: 'The request decides the route.',
    question: 'Which requests should the system handle?',
    outcome: 'A smaller routine queue and a better handover for complex work.',
    measure: 'Resolution rate, repeat contacts, handling time and customer satisfaction.',
    boundary: 'Account changes require verified identity and explicit permission. Complaints, disputes and requests for a person escalate.',
    scenarios: [
      { label: 'Invoice copy', input: '“Please resend my last invoice.”', stages: ['Verify the customer', 'Find the invoice in billing', 'Send through the approved channel'], result: 'Request resolved and logged', reason: 'The system completes an allowed task and records it in the helpdesk.' },
      { label: 'Billing dispute', input: '“This charge is wrong. I want a refund.”', stages: ['Read the account history', 'Attach the disputed charge', 'Route to the billing team'], result: 'Human review with full context', reason: 'This example does not authorise refunds. The customer does not need to repeat the story.' },
      { label: 'Missing account', input: '“Change my subscription.” No verified account.', stages: ['Check identity', 'Detect missing verification', 'Request the approved identity check'], result: 'No account change', reason: 'An unverified request never becomes permission to edit an account.' },
    ],
  },
  'ai-agent-development': {
    title: 'AI agents with a defined job and clear limits.',
    intro: 'AI agent development for work that needs several steps and judgement within boundaries. We connect the tools, enforce permissions and make each action traceable.',
    audience: 'For teams whose work varies too much for a fixed sequence.',
    mode: 'agent', layout: 'architecture', accent: '#685078',
    question: 'Test the boundary of an agent’s authority.',
    outcome: 'Useful autonomy within a scope you can inspect and test.',
    measure: 'Task completion, escalation quality, unauthorised-action attempts and cost per run.',
    boundary: 'Tool permissions enforce the limits. A prompt alone is not an access-control system.',
    scenarios: [
      { label: 'Allowed task', input: 'Task: prepare an account summary\nPermission: read CRM and approved documents', stages: ['Retrieve account context', 'Check source material', 'Prepare a cited summary'], result: 'Summary prepared', reason: 'The agent stays within read-only tools and the assigned task.' },
      { label: 'Restricted action', input: 'Request: change a customer contract\nPermission: read only', stages: ['Check requested tool action', 'Reject the write operation', 'Escalate with the request attached'], result: 'Action blocked by permissions', reason: 'The model cannot grant itself access to a tool or operation outside its configured scope.' },
      { label: 'Tool unavailable', input: 'The CRM cannot be reached.', stages: ['Record the failed step', 'Apply bounded retry rules', 'Escalate when retries are exhausted'], result: 'Run paused with a reason', reason: 'The agent does not invent account data to finish a task.' },
    ],
  },
  'private-rag-knowledge-systems': {
    title: 'Answers from your documents, with the source attached.',
    intro: 'Private RAG and knowledge systems that search approved files, respect access permissions and help your team verify the answer.',
    audience: 'For teams searching policies, contracts, manuals and past work.',
    mode: 'knowledge', layout: 'editorial', accent: '#66532f',
    question: 'An answer is only useful when you can check it.',
    outcome: 'Less searching, with a clear route back to the evidence.',
    measure: 'Correct answers on your test set, citation accuracy and permission checks.',
    boundary: 'When the accessible documents do not answer a question, the system should say so. Retrieval reduces risk; evaluation remains essential.',
    scenarios: [
      { label: 'Answer in the files', input: 'Example policy · Section 4\n“Travel expenses must be submitted within 30 days.”', stages: ['Question: when are expenses due?', 'Retrieve an accessible passage', 'Attach the source section'], result: 'Within 30 days. [1]', reason: '[1] Example policy, Section 4. This demonstration uses fictional policy text, not a customer document.' },
      { label: 'No source', input: 'Question: what is the overseas accommodation limit?\nAvailable policy: submission deadlines only', stages: ['Search approved material', 'Check whether it supports an answer', 'Report the missing information'], result: 'No supported answer in the available files.', reason: 'The system should not infer an allowance from a document that only describes deadlines.' },
      { label: 'Restricted document', input: 'Question: what is this client’s agreed rate?\nRequester has no access to the contract', stages: ['Apply document permissions', 'Exclude restricted passages', 'Answer only from accessible sources'], result: 'Restricted content is not returned.', reason: 'Permissions apply before retrieval so private text does not enter the answering context.' },
    ],
  },
  'secure-ai-deployment': {
    title: 'AI deployment on infrastructure you control.',
    intro: 'We design and deploy AI systems around your access, hosting and data-handling requirements, with the documentation your technical team needs.',
    audience: 'For technical leaders choosing where sensitive AI workloads can run.',
    mode: 'deployment', layout: 'architecture', accent: '#335b83',
    question: 'Compare the deployment boundaries.',
    outcome: 'A documented operating environment with explicit access and data rules.',
    measure: 'Access tests, data-flow checks, retention behaviour and operational recovery.',
    boundary: 'A private environment does not automatically establish compliance. We map the technical controls to your stated requirements.',
    scenarios: [
      { label: 'Private cloud', input: 'Your cloud account\nPrivate application and document storage', stages: ['Restrict network access', 'Choose an approved model endpoint', 'Record access and retention rules'], result: 'Infrastructure in your account', reason: 'An external model endpoint can still receive data. The architecture documents that boundary explicitly.' },
      { label: 'Self-hosted model', input: 'Your environment\nApplication, documents and model hosted together', stages: ['Provision model compute', 'Restrict outbound connections', 'Plan updates, backups and monitoring'], result: 'Model processing stays inside the chosen boundary', reason: 'You take on compute capacity and model operations. We test workload quality and latency before committing.' },
      { label: 'On-premises', input: 'Your facility\nLocal application, storage and inference', stages: ['Assess hardware capacity', 'Integrate identity and logging', 'Define a recovery and update process'], result: 'Local infrastructure with an operating plan', reason: 'Hardware, support and recovery remain real costs. Suitability depends on the workload and required isolation.' },
    ],
  },
  'system-data-integration': {
    title: 'Connected systems. Consistent records.',
    intro: 'System integration services that connect the software you already run, define which data wins and recover visibly when a connection fails.',
    audience: 'For teams exporting, cleaning and re-entering the same data.',
    mode: 'integration', layout: 'architecture', accent: '#286148',
    question: 'Follow a record when the connection fails.',
    outcome: 'Reliable data movement with clear ownership and recovery.',
    measure: 'Successful syncs, data freshness, duplicates and recovery time.',
    boundary: 'Source-of-truth rules, rate limits and write permissions are agreed before a live sync starts.',
    scenarios: [
      { label: 'Normal sync', input: 'CRM → Accounting\nAccount ID: C-1042\nBilling address changed', stages: ['Validate the source fields', 'Apply the agreed field mapping', 'Write using a stable record ID'], result: 'Accounting record updated', reason: 'The stable ID makes the update repeatable without creating duplicate records.' },
      { label: 'Destination offline', input: 'CRM → Accounting\nThe accounting API is unavailable', stages: ['Retain the event in a queue', 'Retry within agreed limits', 'Alert the responsible team'], result: 'Record held for recovery', reason: 'The update is not discarded. Recovery resumes from a known checkpoint.' },
      { label: 'Conflicting edits', input: 'CRM and accounting contain different billing addresses.', stages: ['Check field ownership', 'Apply the approved conflict rule', 'Log the chosen value and source'], result: 'A defined rule decides the update', reason: 'If no rule covers the conflict, it is held for review instead of using whichever job runs last.' },
    ],
  },
  'legacy-system-modernization': {
    title: 'Extend the system your business depends on.',
    intro: 'Legacy system modernization that creates a supported route to your data and automates one useful process around the software you already use.',
    audience: 'For teams whose essential software is difficult to connect or replace.',
    mode: 'legacy', layout: 'architecture', accent: '#7b5038',
    question: 'What access does the existing system allow?',
    outcome: 'A practical integration route and a safer basis for future change.',
    measure: 'Data completeness, access reliability, load on the original system and recovery behaviour.',
    boundary: 'Read access is assessed first. Writes need separate approval, a tested recovery path and confirmed vendor constraints.',
    scenarios: [
      { label: 'Supported API', input: 'Existing software exposes a vendor-supported API.', stages: ['Confirm supported operations', 'Build a documented adapter', 'Test one process against it'], result: 'Connect through the supported interface', reason: 'Versioning, limits and authentication become explicit parts of the integration.' },
      { label: 'Export or database', input: 'No API. A scheduled export or authorised database access exists.', stages: ['Start with read-only access', 'Validate completeness and format', 'Expose a controlled interface'], result: 'Automate around a defined data feed', reason: 'Freshness depends on the export schedule. Database access must respect vendor support and production load.' },
      { label: 'Screen access only', input: 'No supported API, database access or usable export.', stages: ['Confirm vendor restrictions', 'Assess UI stability and failure risk', 'Compare automation with replacement'], result: 'Assess feasibility before a build', reason: 'Screen automation can be fragile. A replacement or vendor change may be the better investment.' },
    ],
  },
};
