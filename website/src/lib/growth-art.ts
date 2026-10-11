import type { ArtName } from './art';

/**
 * Art and at-a-glance answers for every page on the shared GrowthPage layout (2026-10-11).
 * Hero art sets the page's world; story art sits beside the example engagement. Answers are the
 * five things a buyer needs before anything else: what it is, who it is for, what they get, how it
 * is priced and how fast. Guides get no answer card; they lead with the explainer instead.
 */

export type GrowthArt = {
  hero: ArtName; heroPos?: string; story: ArtName; storyPos?: string;
  /** Frame a wide hero beside the copy (for films whose subject stands in the middle). */
  split?: boolean;
  /** Art beside a service page's long-form explainer, when it has one. */
  guide?: ArtName;
};

export const GROWTH_ART: Record<string, GrowthArt> = {
  'ai-consultant': { hero: 'light-rings', heroPos: '50% 40%', story: 'chrome-face', storyPos: '50% 30%', guide: 'spiral-sky' },
  'ai-automation-agency': { hero: 'galaxy-meditation', heroPos: '50% 50%', story: 'sunflower-sun', split: true },
  'how-we-work': { hero: 'cloud-tram', heroPos: '60% 50%', story: 'light-door', storyPos: '50% 45%' },
  'ai-knowledge-systems': { hero: 'painted-mind', heroPos: '50% 30%', story: 'knowledge-constellation' },
  'custom-mcp-server-development': { hero: 'wired-head', heroPos: '50% 30%', story: 'floating-islands' },
  'ai-roi-calculator': { hero: 'sunflower-sun', heroPos: '62% 40%', story: 'golden-train' },
  'automated-reporting': { hero: 'painted-thoughts', heroPos: '60% 40%', story: 'reader-daisies', storyPos: '50% 30%' },
  'ai-email-management': { hero: 'pigeon-rush', heroPos: '50% 35%', story: 'paper-birds' },
  'ai-training-for-employees': { hero: 'glitter-figure', heroPos: '50% 40%', story: 'galaxy-reach', storyPos: '62% 50%' },
  'tech-stack-migration': { hero: 'golden-train', heroPos: '60% 60%', story: 'floating-islands' },
  'what-is-ai-automation': { hero: 'human-machine', heroPos: '62% 50%', story: 'starlight-apprentice' },
  'ai-automation-cost': { hero: 'retro-desk', heroPos: '50% 40%', story: 'watermill' },
  'custom-software-development': { hero: 'desert-explorer', heroPos: '58% 50%', story: 'software-threshold' },
  'ui-ux-design-services': { hero: 'frame-walk', heroPos: '50% 40%', story: 'crt-head', storyPos: '50% 30%' },
  'dedicated-ai-engineers': { hero: 'astronaut-drift', heroPos: '60% 50%', story: 'human-machine-studio' },
  'shopify-seo-services': { hero: 'ocean-city', heroPos: '50% 30%', story: 'pink-smoke', storyPos: '50% 35%' },
  'shopify-migration-services': { hero: 'phone-portal', heroPos: '50% 40%', story: 'commerce-room' },
  'custom-shopify-store-cost': { hero: 'phone-products', heroPos: '50% 45%', story: 'pink-smoke', storyPos: '50% 35%' },
};

const PRICE = 'Audit free. First workflow free. Each next build fixed-price, agreed in writing.';
const FAST = 'First workflow live inside a week, then a release every week.';

export const GROWTH_ANSWERS: Record<string, [string, string][]> = {
  'ai-consultant': [
    ['What it is', 'An AI consultant who audits how your company works, then builds what they recommend.'],
    ['Who it’s for', 'Owners and operators who know AI should help but not where, or who got a report that went nowhere.'],
    ['What you get', 'Where AI pays back in your business, ranked, with the case for each and the first one running.'],
    ['How it’s priced', PRICE],
    ['How fast', 'Findings within days. First workflow live inside a week.'],
  ],
  'ai-automation-agency': [
    ['What it is', 'An AI automation agency that learns how your company runs and automates the work your team repeats.'],
    ['Who it’s for', 'Growing service firms whose growth plan means hiring people to copy data between tools.'],
    ['What you get', 'Automations across email, CRM, reports and documents, with a person approving what matters.'],
    ['How it’s priced', PRICE],
    ['How fast', FAST],
  ],
  'how-we-work': [
    ['What it is', 'How every Chronexa engagement runs, from the free audit to the team that stays on.'],
    ['Who it’s for', 'Anyone deciding whether to work with us and what the first month looks like.'],
    ['What you get', 'An audit, one workflow built free, then builds priced against what they return.'],
    ['How it’s priced', PRICE],
    ['How fast', 'Audit in days. First workflow live inside a week.'],
  ],
  'ai-knowledge-systems': [
    ['What it is', 'One knowledge system holding your processes, past work, rules and client history, readable by AI.'],
    ['Who it’s for', 'Firms whose know-how lives in senior people’s heads and scattered drives.'],
    ['What you get', 'A permissioned source your agents and team can search and cite, kept in sync with your tools.'],
    ['How it’s priced', PRICE],
    ['How fast', 'First knowledge source connected inside a week.'],
  ],
  'custom-mcp-server-development': [
    ['What it is', 'Custom MCP servers that let Claude, ChatGPT and your agents use internal tools and databases safely.'],
    ['Who it’s for', 'Teams whose important systems have no AI connector: internal tools, older software, custom databases.'],
    ['What you get', 'A server with scoped permissions, an audit log and only the actions you approve.'],
    ['How it’s priced', 'Scoping free. Each server fixed-price, agreed in writing.'],
    ['How fast', 'First working connection inside a week. Larger systems in weekly releases.'],
  ],
  'ai-roi-calculator': [
    ['What it is', 'A calculator for the capacity and revenue automation could free up with the team you have.'],
    ['Who it’s for', 'Owners deciding whether automation is worth a conversation.'],
    ['What you get', 'Hours returned, clients per person and revenue per employee, from your own inputs.'],
    ['How it’s priced', 'Free. The free audit then replaces every assumption with your real numbers.'],
    ['How fast', 'About a minute.'],
  ],
  'automated-reporting': [
    ['What it is', 'Client reports, board packs and morning briefings that build themselves from your tools.'],
    ['Who it’s for', 'Teams that lose a day a week to pulling numbers and formatting reports.'],
    ['What you get', 'Reports drafted in your format and sent for a quick human check before they go out.'],
    ['How it’s priced', PRICE],
    ['How fast', 'First report automated inside a week.'],
  ],
  'ai-email-management': [
    ['What it is', 'AI that sorts every inbox, files what doesn’t matter and drafts replies that know the client.'],
    ['Who it’s for', 'Client-facing teams who spend the first hours of every day in email.'],
    ['What you get', 'Triage, drafted replies and CRM updates. Nothing is sent until a person says yes.'],
    ['How it’s priced', PRICE],
    ['How fast', 'First inbox live inside a week.'],
  ],
  'ai-training-for-employees': [
    ['What it is', 'Role-by-role training that makes your people AI-native on their own work.'],
    ['Who it’s for', 'Companies that bought AI tools and saw little change in how the work gets done.'],
    ['What you get', 'A plan per role, hands-on sessions on real tasks, and the workflows each team learns to run.'],
    ['How it’s priced', 'Training review free. Each programme fixed-price, agreed in writing.'],
    ['How fast', 'A plan per role within days of the review.'],
  ],
  'tech-stack-migration': [
    ['What it is', 'A move off the tools holding you back, onto a modern, AI-ready stack, without stopping work.'],
    ['Who it’s for', 'Companies running on spreadsheets, old CRMs or systems nothing can connect to.'],
    ['What you get', 'A migration plan, your data moved and checked, the new stack set up and your team trained.'],
    ['How it’s priced', 'Audit free. Migration fixed-price, agreed in writing.'],
    ['How fast', 'Planned in days, moved in stages so the business never stops.'],
  ],
  'custom-software-development': [
    ['What it is', 'Web apps, SaaS products, internal tools and MVPs, built by engineers working with AI agents.'],
    ['Who it’s for', 'Founders and teams who need software shipped fast without cutting corners.'],
    ['What you get', 'Working releases, tests and review on everything, and code you own outright.'],
    ['How it’s priced', 'Audit free. Each release scoped and priced in writing.'],
    ['How fast', 'First usable release in weeks, not months.'],
  ],
  'ui-ux-design-services': [
    ['What it is', 'Research, user journeys, interfaces and design systems for SaaS, internal tools and stores.'],
    ['Who it’s for', 'Products that work but confuse the people who use them.'],
    ['What you get', 'Designs made with engineers, so what you approve is what ships.'],
    ['How it’s priced', 'UX audit free. Each project scoped and priced in writing.'],
    ['How fast', 'Audit findings within days.'],
  ],
  'dedicated-ai-engineers': [
    ['What it is', 'Senior engineers who join your team and bring the AI agent setup that multiplies their output.'],
    ['Who it’s for', 'Teams that need senior engineering capacity now, not after a four-month hire.'],
    ['What you get', 'Engineers in your repos and standups, with coding agents and MCP connectors to your tools.'],
    ['How it’s priced', 'Scoping call free. Month to month, no long lock-in.'],
    ['How fast', 'Productive in two to three weeks.'],
  ],
  'shopify-seo-services': [
    ['What it is', 'Technical and content SEO for Shopify stores, fixed in the theme, not just reported.'],
    ['Who it’s for', 'Shopify brands whose organic traffic has stalled or never took off.'],
    ['What you get', 'Duplicate URLs fixed, collections built out, speed and AI-crawler issues handled, content that ranks.'],
    ['How it’s priced', 'SEO audit free. The work scoped and priced in writing.'],
    ['How fast', 'Audit findings within days.'],
  ],
  'shopify-migration-services': [
    ['What it is', 'A move to Shopify with your products, customers, content and rankings intact.'],
    ['Who it’s for', 'Brands on WooCommerce, Magento or a custom platform, ready to replatform.'],
    ['What you get', 'Every URL mapped and redirected, data imported and checked, a better store at launch.'],
    ['How it’s priced', 'Migration audit free. Migration fixed-price, agreed in writing.'],
    ['How fast', 'Your old store stays live until the new one is verified.'],
  ],
};
