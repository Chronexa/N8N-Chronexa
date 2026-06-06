# Next.js Migration Architecture (Framer -> Code)

Claude, the user is migrating their `chronexa.io` Framer site into this custom Next.js application for absolute SEO control and Sanity CMS automation (via n8n). I was dismissed mid-execution. 

Here is the exact architectural state and context you need to continue the work:

## 1. Tech Stack & Styling Rules
- **Framework:** Next.js 15 (App Router). TypeScript enabled.
- **Styling:** **NO TAILWIND.** The user explicitly mandated a highly-premium Vanilla CSS approach. I built a strict Design System in `src/app/globals.css`.
- **Aesthetic:** High-contrast brutalist-lite. Deep blacks (`#0A0B0A`), off-whites (`#F4F4F4`), and a signature Neon Green (`#67B035`). Use CSS Modules for all components.

## 2. What Has Been Built So Far
- **Homepage (`src/app/page.tsx`):** I completely hardcoded the 10 visual sections of the live chronexa.io site into React components. It uses `page.module.css`. It needs refinement and component splitting (it's currently a massive file).
- **Global Layout (`src/app/layout.tsx`):** `Nav` and `Footer` components are injected here.
- **Service Pages (`src/app/services/`):** 5 Tier-1 SEO hubs have been generated. **CRITICAL:** I injected custom JSON-LD schema payloads via Next.js Metadata and `dangerouslySetInnerHTML`. Do not strip these out; they are vital for the B2B AI automation SEO strategy.

## 3. The Blog Architecture (Sanity.io)
The user utilizes n8n for automated blog generation. We opted for **Sanity.io** as the Headless CMS because of its zero DevOps requirement.
- **State:** `next-sanity` and `@portabletext/react` are installed.
- **Config:** `src/sanity/client.ts` contains the client. (It needs `NEXT_PUBLIC_SANITY_PROJECT_ID` in `.env`).
- **Dynamic Route:** `src/app/blog/[slug]/page.tsx` is scaffolded to render Sanity PortableText.
- **Redirects:** `next.config.ts` has an async `redirects()` function stubbed out. The user needs to map their 157 existing Framer blogs here to preserve domain authority.

## Next Steps for You (Claude)
1. Split `page.tsx` into modular React components (`Hero.tsx`, `FeatureGrid.tsx`, `IndustryCards.tsx`, etc.).
2. Fine-tune the CSS Modules to ensure pixel-perfect fidelity with the live `chronexa.io` site.
3. Finalize the Sanity schema deployment so the user can connect their n8n workflow.
