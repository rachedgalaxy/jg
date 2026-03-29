const fs = require('fs');
const content = fs.readFileSync('assets/index-DvcepVfO.js', 'utf8');
const lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('عمال')) {
    console.log(`\n--- Match around line ${i} for "عمال" ---`);
    for (let j = Math.max(0, i - 15); j <= Math.min(lines.length - 1, i + 15); j++) {
      console.log(`${j}: ${lines[j].trim()}`);
    }
  }
}
