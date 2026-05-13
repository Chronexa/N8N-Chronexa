import { connect } from "framer-api";
import dotenv from "dotenv";

dotenv.config();

async function run() {
    try {
        console.log("Connecting to Framer project...");
        const projectUrl = "https://framer.com/projects/Chronexa-Live--8SE3GXbiuF0thf9Gxje7-71i4E";
        
        // Connect to Framer
        const framer = await connect(projectUrl, process.env.FRAMER_API_TOKEN);
        console.log("Connected successfully!");
        
        // Log available methods on framer instance to understand capabilities
        console.log("Framer object keys:", Object.keys(framer));

        // Get CMS Collections
        if (typeof framer.getCollections === "function") {
            const collections = await framer.getCollections();
            console.log("\n--- CMS Collections ---");
            if (collections && collections.length > 0) {
                collections.forEach(col => console.log(`- ${col.name || 'Unnamed'} (ID: ${col.id})`));
            } else {
                console.log("No CMS collections found.");
            }
        }

        // Get Project Information / Pages
        if (typeof framer.getPages === "function") {
            const pages = await framer.getPages();
            console.log("\n--- Pages ---");
            if (pages && pages.length > 0) {
                pages.forEach(p => console.log(`- ${p.title || p.name} (ID: ${p.id})`));
            } else {
                console.log("No pages found.");
            }
        }
        
        if (typeof framer.getComponents === "function") {
            const components = await framer.getComponents();
            console.log(`\n--- Components --- (Found: ${components ? components.length : 0})`);
        }

        await framer.disconnect();
    } catch (error) {
        console.error("Framer API Error:", error);
    }
}
run();
