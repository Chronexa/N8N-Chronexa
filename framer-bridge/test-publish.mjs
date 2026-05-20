import { connect } from "framer-api";
import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
config({ path: resolve(dirname(fileURLToPath(import.meta.url)), "../.env") });

const PROJECT_URL      = "https://framer.com/projects/Chronexa-Live--8SE3GXbiuF0thf9Gxje7-71i4E";
const BLOG_COLLECTION_ID = "L8b3IANtH";

const F = {
  hero:        "zD3ZKyyO9",
  featured:    "vJMe6fpJL",
  category:    "S9w7PJblN",
  title:       "eu1SUO8Ae",
  excerpt:     "Ot6aVH0Gv",
  readingTime: "MNIeHWzsi",
  date:        "mmsKK_xBb",
  body:        "fSfrbBQqV",
  authorName:  "AblEkj9p6",
  authorTitle: "CEKcF7GJb",
  authorBio:   "x2h9g6E14",
  authorPhoto: "Kgwuwd_oX",
};

// Enum case IDs (from check-enums.mjs)
const ENUM = {
  category_blog:   "xw4CPPHov",
  author_name:     "U9xe5EOm0",
  author_title:    "U9xe5EOm0",
  author_bio:      "VGwxukezb",
};

const framer = await connect(PROJECT_URL, process.env.FRAMER_API_TOKEN);
const blog = (await framer.getCollections()).find(c => c.id === BLOG_COLLECTION_ID);

console.log("Attempting addItems...");
try {
  await blog.addItems([{
    id: undefined,
    slug: "test-bridge-validation-delete-me",
    draft: false,
    fieldData: {
      [F.title]:       { type: "string",        value: "Test: Bridge Validation Post" },
      [F.excerpt]:     { type: "string",        value: "Bridge server test — will be deleted." },
      [F.body]:        { type: "formattedText", value: "<h2>Test</h2><p>This is a test post. Will be deleted.</p>" },
      [F.date]:        { type: "date",          value: new Date().toISOString() },
      [F.featured]:    { type: "boolean",       value: true },
      [F.category]:    { type: "enum",          value: ENUM.category_blog },
      [F.readingTime]: { type: "string",        value: "" },
      [F.authorName]:  { type: "enum",          value: ENUM.author_name },
      [F.authorTitle]: { type: "enum",          value: ENUM.author_title },
      [F.authorBio]:   { type: "enum",          value: ENUM.author_bio },
      [F.authorPhoto]: { type: "image",         value: "https://framerusercontent.com/images/LElfCqPloHvI8coMyyhlnArxdJc.png" },
    },
  }]);
  console.log("addItems succeeded!");

  // Fetch back to get the Framer-assigned ID
  const items = await blog.getItems();
  const newItem = items.find(i => i.slug === "test-bridge-validation-delete-me");
  console.log("New item ID:", newItem?.id);
  console.log("New item slug:", newItem?.slug);

  await framer.publish();
  console.log("Published!");

  // Clean up test post
  if (newItem?.id) {
    await blog.removeItems([newItem.id]);
    await framer.publish();
    console.log("Test post deleted and republished.");
  }
} catch(e) {
  console.error("Error:", e.message ?? e);
}

await framer.disconnect();
process.exit(0);
