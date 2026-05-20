const fs = require('fs');

const files = [
  'blog-agent-1-strategist.json',
  'blog-agent-2-researcher.json',
  'blog-agent-3-copywriter.json',
  'blog-agent-4-designer.json',
  'blog-agent-5-publisher.json'
];

for (const file of files) {
  try {
    const data = JSON.parse(fs.readFileSync(`scripts/live-workflows/${file}`));
    console.log(`\n======================================`);
    console.log(`WORKFLOW: ${data.name || file} (ID: ${data.id || 'N/A'})`);
    console.log(`ACTIVE: ${data.active}`);
    console.log(`======================================`);
    
    if (data.nodes) {
      console.log(`NODES:`);
      data.nodes.forEach(n => {
        console.log(` - ${n.name} [${n.type} v${n.typeVersion}]`);
      });
    }
  } catch (err) {
    console.error(`Error reading ${file}:`, err.message);
  }
}
