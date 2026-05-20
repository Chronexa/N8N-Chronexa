const { google } = require('googleapis');
const key = require('./config/gsc-service-account.json');

const jwtClient = new google.auth.JWT(
  key.client_email,
  null,
  key.private_key,
  ['https://www.googleapis.com/auth/webmasters.readonly']
);

jwtClient.authorize(function (err, tokens) {
  if (err) {
    console.log("Auth error:", err);
    return;
  }
  const searchconsole = google.webmasters({
    version: 'v3',
    auth: jwtClient,
  });
  searchconsole.sites.list({}, (err, res) => {
    if (err) {
      console.log("API Error:", err.message);
    } else {
      console.log("API is enabled and working. Sites:", res.data.siteEntry ? res.data.siteEntry.map(s => s.siteUrl) : 0);
    }
  });
});
