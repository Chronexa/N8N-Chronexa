/**
 * One-time OAuth2 setup for Google Search Console.
 * Opens a browser, you grant access, paste the code back.
 * Saves refresh token to .env as GSC_REFRESH_TOKEN.
 *
 * Run: node scripts/gsc-auth.mjs
 */
import { google } from "googleapis";
import { createServer } from "http";
import { config as dotenvConfig } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { readFileSync, writeFileSync } from "fs";
import { exec } from "child_process";

dotenvConfig({ path: resolve(dirname(fileURLToPath(import.meta.url)), "../.env") });

const CLIENT_ID     = process.env.GSC_CLIENT_ID;
const CLIENT_SECRET = process.env.GSC_CLIENT_SECRET;
const REDIRECT_URI  = "http://localhost:3456";

const oauth2 = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

const authUrl = oauth2.generateAuthUrl({
  access_type: "offline",
  scope: ["https://www.googleapis.com/auth/webmasters.readonly"],
  prompt: "consent",
});

console.log("\nOpening browser for Google authorization...");
console.log("If it doesn't open, visit:\n" + authUrl + "\n");

// Try to open browser
const openCmd = process.platform === "darwin" ? "open" : "xdg-open";
exec(`${openCmd} "${authUrl}"`);

// Capture the code via local redirect
const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:3456`);
  const code = url.searchParams.get("code");

  if (!code) {
    res.end("No code found — try again.");
    return;
  }

  try {
    const { tokens } = await oauth2.getToken(code);
    console.log("\n✓ Tokens received.");
    console.log("  Access token: " + tokens.access_token?.slice(0, 20) + "...");
    console.log("  Refresh token: " + tokens.refresh_token?.slice(0, 20) + "...");

    // Write refresh token to .env
    const envPath = resolve(dirname(fileURLToPath(import.meta.url)), "../.env");
    let envContent = readFileSync(envPath, "utf8");

    if (envContent.includes("GSC_REFRESH_TOKEN=")) {
      envContent = envContent.replace(/GSC_REFRESH_TOKEN=.*/, `GSC_REFRESH_TOKEN=${tokens.refresh_token}`);
    } else {
      envContent += `\nGSC_REFRESH_TOKEN=${tokens.refresh_token}\n`;
    }
    writeFileSync(envPath, envContent);

    console.log("\n✓ GSC_REFRESH_TOKEN saved to .env");
    console.log("You can now run: node scripts/gsc-site-audit.mjs\n");

    res.end("<html><body><h2>✓ Authorized! You can close this tab.</h2></body></html>");
  } catch (e) {
    console.error("Token exchange failed:", e.message);
    res.end("Error: " + e.message);
  } finally {
    server.close();
  }
});

server.listen(3456, () => {
  console.log("Waiting for Google to redirect to localhost:3456...\n");
});
