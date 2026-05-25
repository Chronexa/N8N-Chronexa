/**
 * AEO FAQ injection.
 * For the top 20 posts (by word count), generate 4 contextual FAQ pairs via Claude Haiku
 * and inject an HTML FAQ section before the CTA <hr /> separator.
 * FAQ headings use H3 so they're directly eligible for Featured Snippets.
 *
 * Run: node scripts/inject-faq.mjs
 * Preview: node scripts/inject-faq.mjs --dry-run
 */
import { connect } from "framer-api";
import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

config({ path: resolve(dirname(fileURLToPath(import.meta.url)), "../.env") });

const PROJECT_URL  = "https://framer.com/projects/Chronexa-Live--8SE3GXbiuF0thf9Gxje7-71i4E";
const BLOG_COLL_ID = "L8b3IANtH";
const TOKEN        = process.env.FRAMER_API_TOKEN;
const ANTHROPIC    = process.env.ANTHROPIC_API_KEY;
const DRY_RUN      = process.argv.includes("--dry-run");

const F_BODY  = "fSfrbBQqV";
const F_TITLE = "eu1SUO8Ae";

// Top 20 live posts by word count (kp7ftpkdB drafted — script skips it at runtime)
const TARGETS = [
  "RZ3a46hmj", "UFJoheYCE", "MD33DQl0G", "tmUoq7zEY", "F9vhZX1mI",
  "tNB0UAurf", "ottIwhS0_", "Yf0yfj28f", "qrtcywVgt", "XU7PtD7id",
  "kmBXAUmit", "OrTIDa8EN", "jHctdbSRl", "bPqmnWozx", "bHMn4DBYt",
  "vAV1101IW", "LM8u6iAMK", "kEU4JaUbb", "uROWykGih", "nFssilqAG",
];

const SYSTEM_PROMPT = `You are an SEO and AEO (Answer Engine Optimization) specialist for Chronexa.io, an AI automation agency.

Given a blog post title and its opening text, generate exactly 4 FAQ pairs that:
1. Target question-style queries a buyer at this stage would actually search ("how do I...", "what does it cost to...", "how long does it take...", "what's the difference between...", "is X worth it for...")
2. Each answer is 2-3 sentences — direct and specific, not fluffy
3. At least one answer should reference Chronexa's specific approach or a concrete outcome (cost, time, percentage)
4. Questions should cover different angles: practical implementation, cost/ROI, comparison, and one "should I / is this right for me" style question
5. Tone: confident, expert, mid-market B2B. No hype words.

Return ONLY a JSON array with this exact structure, no explanation:
[
  {"question": "...", "answer": "..."},
  {"question": "...", "answer": "..."},
  {"question": "...", "answer": "..."},
  {"question": "...", "answer": "..."}
]`;

async function generateFAQ(title, bodySnippet) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": ANTHROPIC,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1000,
      system: SYSTEM_PROMPT,
      messages: [{
        role: "user",
        content: `Blog post title: "${title}"\n\nOpening text:\n${bodySnippet.slice(0, 600)}`,
      }],
    }),
  });
  if (!res.ok) throw new Error(`Anthropic ${res.status}: ${await res.text()}`);
  const data = await res.json();
  let text = data.content[0].text.trim()
    .replace(/^```[a-z]*\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();
  return JSON.parse(text);
}

function faqHtml(faqs) {
  const items = faqs.map(f =>
    `<h3 dir="auto">${f.question}</h3>\n<p dir="auto">${f.answer}</p>`
  ).join("\n");
  return `<div dir="auto">\n<h2 dir="auto">Frequently Asked Questions</h2>\n${items}\n</div>`;
}

function stripHtmlTags(html) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function run() {
  console.log(`Mode: ${DRY_RUN ? "DRY RUN" : "LIVE"}\n`);

  const framer = await connect(PROJECT_URL, TOKEN);
  const blog   = (await framer.getCollections()).find(c => c.id === BLOG_COLL_ID);
  const items  = await blog.getItems();
  const byId   = Object.fromEntries(items.map(i => [i.id, i]));

  let updated = 0;

  for (let i = 0; i < TARGETS.length; i++) {
    const id   = TARGETS[i];
    const item = byId[id];

    if (!item) { console.log(`⚠ Not found: ${id}`); continue; }
    if (item.draft) { console.log(`— Draft, skipping: ${item.slug}`); continue; }

    const body  = item.fieldData[F_BODY]?.value ?? "";
    const title = item.fieldData[F_TITLE]?.value ?? item.slug;

    // Idempotency: skip if FAQ heading already present
    if (body.includes("Frequently Asked Questions")) {
      console.log(`✓ Already has FAQ: ${item.slug}`);
      continue;
    }

    const snippet = stripHtmlTags(body);
    process.stdout.write(`[${i + 1}/${TARGETS.length}] ${title.slice(0, 55)}…\n`);

    if (DRY_RUN) {
      console.log(`  [DRY] Would inject FAQ`);
      updated++;
      if (i < TARGETS.length - 1) await sleep(200);
      continue;
    }

    let faqs;
    try {
      faqs = await generateFAQ(title, snippet);
    } catch (e) {
      console.error(`  ⚠ Claude error: ${e.message} — skipping`);
      continue;
    }

    if (!Array.isArray(faqs) || faqs.length < 4) {
      console.error(`  ⚠ Unexpected FAQ format — skipping`);
      continue;
    }

    console.log(`  → ${faqs.length} FAQ pairs generated`);
    faqs.forEach(f => console.log(`    Q: ${f.question.slice(0, 70)}`));

    const faqSection = faqHtml(faqs);

    // Insert before CTA <hr />, or append if not found
    let newBody;
    const hrIdx = body.indexOf("<hr />");
    newBody = hrIdx !== -1
      ? body.slice(0, hrIdx) + faqSection + "\n" + body.slice(hrIdx)
      : body + "\n" + faqSection;

    await blog.addItems([{
      id: item.id, slug: item.slug, draft: item.draft,
      fieldData: { [F_BODY]: { type: "formattedText", value: newBody } },
    }]);
    console.log(`  ✓ FAQ injected: ${item.slug}`);
    updated++;

    // Rate limit ~2 req/s
    if (i < TARGETS.length - 1) await sleep(600);
  }

  console.log(`\nTotal: ${updated} posts updated`);

  if (!DRY_RUN && updated > 0) {
    console.log("Publishing...");
    await framer.publish();
    console.log("✓ Published.");
  }

  await framer.disconnect();
}

run().catch(e => { console.error("FATAL:", e.message); process.exit(1); });
