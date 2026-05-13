import { connect } from "framer-api";
import dotenv from "dotenv";

dotenv.config();

async function run() {
    try {
        console.log("Connecting to Framer project...");
        const projectUrl = "https://framer.com/projects/Chronexa-Live--8SE3GXbiuF0thf9Gxje7-71i4E";
        
        const framer = await connect(projectUrl, process.env.FRAMER_API_TOKEN);
        console.log("Connected successfully!");
        
        let obj = framer;
        let props = new Set();
        do {
            Object.getOwnPropertyNames(obj).forEach(p => props.add(p));
        } while ((obj = Object.getPrototypeOf(obj)) && obj !== Object.prototype);
        
        console.log("All properties and methods available on framer object:");
        console.log(Array.from(props).sort().join(", "));
        
        await framer.disconnect();
    } catch (error) {
        console.error("Framer API Error:", error);
    }
}
run();
