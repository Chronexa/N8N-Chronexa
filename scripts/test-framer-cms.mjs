import { connect } from "framer-api";
import dotenv from "dotenv";
dotenv.config();

const framer = await connect(
  "https://framer.com/projects/Chronexa-Live--8SE3GXbiuF0thf9Gxje7-71i4E",
  process.env.FRAMER_API_TOKEN
);
const blog = (await framer.getCollections()).find(c => c.id === "L8b3IANtH");
const fields = await blog.getFields();

// Show enum cases for all enum fields
fields.filter(f => f.type === "enum").forEach(f => {
  console.log(`\n${f.name} (${f.id}):`);
  (f.cases || []).forEach(c => console.log(`  case id="${c.id}"  name="${c.name}"`));
});

// Show a real item to see raw fieldData values for enum fields
const items = await blog.getItems();
const sample = items[items.length - 1];
console.log("\nSample item raw fieldData (enum fields):");
["S9w7PJblN","AblEkj9p6","CEKcF7GJb","x2h9g6E14"].forEach(fid => {
  console.log(` ${fid}: ${JSON.stringify(sample.fieldData[fid])}`);
});

await framer.disconnect();
