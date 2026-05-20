import { connect } from "framer-api";
import dotenv from "dotenv";
dotenv.config();

const framer = await connect(
  "https://framer.com/projects/Chronexa-Live--8SE3GXbiuF0thf9Gxje7-71i4E",
  process.env.FRAMER_API_TOKEN
);
const blog = (await framer.getCollections()).find(c => c.id === "L8b3IANtH");
const items = await blog.getItems();

console.log("Total Items:", items.length);
console.log("\nLast 3 items added:");
const lastItems = items.slice(-3);
for (const item of lastItems) {
  console.log(`- ID: ${item.id}, Slug: ${item.slug}, Title: ${item.fieldData['eu1SUO8Ae']}, Cover: ${item.fieldData['zD3ZKyyO9']}`);
}

await framer.disconnect();
