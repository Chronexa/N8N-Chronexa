import { connect } from "framer-api";
import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
config({ path: resolve(dirname(fileURLToPath(import.meta.url)), "../.env") });

const framer = await connect(
  "https://framer.com/projects/Chronexa-Live--8SE3GXbiuF0thf9Gxje7-71i4E",
  process.env.FRAMER_API_TOKEN
);
const blog = (await framer.getCollections()).find(c => c.id === "L8b3IANtH");
const fields = await blog.getFields();

console.log("All enum field cases:");
fields.filter(f => f.type === "enum").forEach(f => {
  console.log(`\n${f.name} (${f.id}):`);
  (f.cases || []).forEach(c => console.log(`  case id="${c.id}"  name="${c.name}"`));
});

// Also grab one live item to see raw stored values
const items = await blog.getItems();
const s = items[0];
console.log("\nFirst item raw enum values:");
["S9w7PJblN","AblEkj9p6","CEKcF7GJb","x2h9g6E14"].forEach(fid =>
  console.log(`  ${fid}: ${JSON.stringify(s.fieldData[fid])}`)
);

await framer.disconnect();
process.exit(0);
