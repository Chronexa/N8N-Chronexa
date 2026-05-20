import { connect } from "framer-api";
import express from "express";
import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

// Load .env from repo root regardless of working directory
config({ path: resolve(dirname(fileURLToPath(import.meta.url)), "../.env") });

const app = express();
app.use(express.json({ limit: "10mb" }));

const FRAMER_TOKEN      = process.env.FRAMER_API_TOKEN;
const FRAMER_PROJECT_URL = "https://framer.com/projects/Chronexa-Live--8SE3GXbiuF0thf9Gxje7-71i4E";
const BLOG_COLLECTION_ID = "L8b3IANtH";
const BRIDGE_SECRET     = process.env.BRIDGE_SECRET;

// Field IDs verified against live Framer Blog collection (May 2026)
const F = {
  hero:        "zD3ZKyyO9",  // image
  featured:    "vJMe6fpJL",  // boolean
  category:    "S9w7PJblN",  // enum
  title:       "eu1SUO8Ae",  // string
  excerpt:     "Ot6aVH0Gv",  // string
  readingTime: "MNIeHWzsi",  // string
  date:        "mmsKK_xBb",  // date
  body:        "fSfrbBQqV",  // formattedText — accepts HTML by default
  authorName:  "AblEkj9p6",  // enum
  authorTitle: "CEKcF7GJb",  // enum
  authorBio:   "x2h9g6E14",  // enum
  authorPhoto: "Kgwuwd_oX",  // image
};

// Enum case IDs — use these, not display names (verified May 2026)
const ENUM = {
  category_blog: "xw4CPPHov",
  author_name:   "U9xe5EOm0",  // Ankit Dhiman
  author_title:  "U9xe5EOm0",  // Head of Strategy
  author_bio:    "VGwxukezb",  // Ankit's bio
};

const AUTHOR_PHOTO = "https://framerusercontent.com/images/LElfCqPloHvI8coMyyhlnArxdJc.png";

function auth(req, res, next) {
  if (BRIDGE_SECRET && req.headers["x-bridge-secret"] !== BRIDGE_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

async function getBlog(framer) {
  const collections = await framer.getCollections();
  const blog = collections.find(c => c.id === BLOG_COLLECTION_ID);
  if (!blog) throw new Error("Blog collection not found");
  return blog;
}

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "framer-bridge", collection: BLOG_COLLECTION_ID });
});

// POST /publish
// Body: { title, slug, meta_description, html_body, cover_image_url?, published_date? }
// Returns: { success, framer_item_id, slug }
app.post("/publish", auth, async (req, res) => {
  const { title, slug, meta_description, html_body, cover_image_url, published_date } = req.body;

  if (!title || !html_body || !slug) {
    return res.status(400).json({ error: "title, slug and html_body are required" });
  }

  let framer;
  try {
    framer = await connect(FRAMER_PROJECT_URL, FRAMER_TOKEN);
    const blog = await getBlog(framer);

    const fieldData = {
      [F.title]:       { type: "string",        value: title },
      [F.excerpt]:     { type: "string",        value: meta_description || "" },
      [F.body]:        { type: "formattedText", value: html_body },
      [F.date]:        { type: "date",          value: published_date || new Date().toISOString() },
      [F.featured]:    { type: "boolean",       value: true },
      [F.category]:    { type: "enum",          value: ENUM.category_blog },
      [F.readingTime]: { type: "string",        value: "" },
      [F.authorName]:  { type: "enum",          value: ENUM.author_name },
      [F.authorTitle]: { type: "enum",          value: ENUM.author_title },
      [F.authorBio]:   { type: "enum",          value: ENUM.author_bio },
      [F.authorPhoto]: { type: "image",         value: AUTHOR_PHOTO },
    };

    if (cover_image_url) {
      fieldData[F.hero] = { type: "image", value: cover_image_url };
    }

    // id: undefined lets Framer auto-assign; pass slug for lookup on updates
    let addError = null;
    try {
      await blog.addItems([{ id: undefined, slug, draft: false, fieldData }]);
    } catch (err) {
      if (err.message && err.message.toLowerCase().includes("duplicate")) {
        addError = err; // slug already exists — fall through to lookup
      } else {
        throw err;
      }
    }

    // Fetch item (newly created, or existing if slug was a duplicate)
    const allItems = await blog.getItems();
    const item = allItems.find(i => i.slug === slug);
    const framerItemId = item?.id ?? slug;

    if (addError) {
      // Slug already existed in Framer — return its ID without republishing
      await framer.disconnect();
      console.log(`Already exists: ${slug} (${framerItemId})`);
      return res.json({ success: true, framer_item_id: framerItemId, slug, already_existed: true });
    }

    await framer.publish();

    await framer.disconnect();
    console.log(`Published: ${slug} (${framerItemId})`);
    res.json({ success: true, framer_item_id: framerItemId, slug });

  } catch (err) {
    if (framer) try { await framer.disconnect(); } catch (_) {}
    console.error("Publish error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /item/:itemId
app.delete("/item/:itemId", auth, async (req, res) => {
  let framer;
  try {
    framer = await connect(FRAMER_PROJECT_URL, FRAMER_TOKEN);
    const blog = await getBlog(framer);
    await blog.removeItems([req.params.itemId]);
    await framer.publish();
    await framer.disconnect();
    res.json({ success: true, deleted: req.params.itemId });
  } catch (err) {
    if (framer) try { await framer.disconnect(); } catch (_) {}
    res.status(500).json({ error: err.message });
  }
});

// POST /publish-site — trigger a Framer deploy without changing content
app.post("/publish-site", auth, async (req, res) => {
  let framer;
  try {
    framer = await connect(FRAMER_PROJECT_URL, FRAMER_TOKEN);
    await framer.publish();
    await framer.disconnect();
    console.log("Site published");
    res.json({ success: true });
  } catch (err) {
    if (framer) try { await framer.disconnect(); } catch (_) {}
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Framer Bridge running on :${PORT}`));
