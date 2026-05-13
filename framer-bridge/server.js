import { connect } from "framer-api";
import express from "express";

const app = express();
app.use(express.json({ limit: "10mb" }));

const FRAMER_TOKEN = process.env.FRAMER_API_TOKEN;
const FRAMER_PROJECT_URL = "https://framer.com/projects/Chronexa-Live--8SE3GXbiuF0thf9Gxje7-71i4E";
const BLOG_COLLECTION_ID = "L8b3IANtH";
const BRIDGE_SECRET = process.env.BRIDGE_SECRET;

// Framer Blog field IDs
const FIELDS = {
  coverImage: "zD3ZKyyO9",
  published: "vJMe6fpJL",
  category: "S9w7PJblN",
  title: "eu1SUO8Ae",
  excerpt: "Ot6aVH0Gv",
  emptyString: "MNIeHWzsi",
  date: "mmsKK_xBb",
  body: "fSfrbBQqV",
  authorName: "AblEkj9p6",
  authorTitle: "CEKcF7GJb",
  authorBio: "x2h9g6E14",
  authorPhoto: "Kgwuwd_oX",
};

function auth(req, res, next) {
  if (BRIDGE_SECRET && req.headers["x-bridge-secret"] !== BRIDGE_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "framer-bridge" });
});

app.post("/publish", auth, async (req, res) => {
  const { title, slug, meta_description, html_body, cover_image_url, published_date } = req.body;

  if (!title || !html_body) {
    return res.status(400).json({ error: "title and html_body are required" });
  }

  let framer;
  try {
    framer = await connect(FRAMER_PROJECT_URL, FRAMER_TOKEN);

    const collections = await framer.getCollections();
    const blog = collections.find((c) => c.id === BLOG_COLLECTION_ID);
    if (!blog) throw new Error("Blog collection not found");

    const fieldData = {
      [FIELDS.title]: { type: "string", value: title },
      [FIELDS.excerpt]: { type: "string", value: meta_description || "" },
      [FIELDS.body]: { type: "formattedText", value: html_body },
      [FIELDS.date]: { type: "date", value: published_date || new Date().toISOString() },
      [FIELDS.published]: { type: "boolean", value: true },
      [FIELDS.category]: { type: "enum", value: "Blog" },
      [FIELDS.authorName]: { type: "enum", value: "Ankit Dhiman" },
      [FIELDS.authorTitle]: { type: "enum", value: "Head of Strategy" },
      [FIELDS.authorBio]: { type: "enum", value: "Ankit is the brains behind bold business roadmaps. He loves turning \"half-baked\" ideas into fully baked success stories — with a healthy dose of chaos management along the way." },
      [FIELDS.authorPhoto]: { type: "image", value: { url: "https://framerusercontent.com/images/LElfCqPloHvI8coMyyhlnArxdJc.png", resolution: "auto" } },
      [FIELDS.emptyString]: { type: "string", value: "" },
    };

    if (cover_image_url) {
      fieldData[FIELDS.coverImage] = { type: "image", value: { url: cover_image_url, resolution: "auto" } };
    }

    const item = await blog.addItem({ slug, draft: false, fieldData });

    await framer.disconnect();
    res.json({ success: true, framer_item_id: item.id, slug: item.slug });
  } catch (err) {
    if (framer) try { await framer.disconnect(); } catch (_) {}
    console.error("Publish error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.delete("/item/:itemId", auth, async (req, res) => {
  let framer;
  try {
    framer = await connect(FRAMER_PROJECT_URL, FRAMER_TOKEN);
    const collections = await framer.getCollections();
    const blog = collections.find((c) => c.id === BLOG_COLLECTION_ID);
    await blog.removeItem(req.params.itemId);
    await framer.disconnect();
    res.json({ success: true, deleted: req.params.itemId });
  } catch (err) {
    if (framer) try { await framer.disconnect(); } catch (_) {}
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Framer Bridge running on :${PORT}`));
