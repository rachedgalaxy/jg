const fs = require('fs');

let content = fs.readFileSync('assets/index-DvcepVfO.js', 'utf8');

// Find the worker login check: workers.find(w => w.phone === phone && w.pin === pin)
// We need to change it to: workers.find(w => w.phone === phone)

// Look for the worker check pattern in the minified code
const workerPinPattern = /workers\.find\(([a-z])\s*=>\s*\1\.phone\s*===\s*phone\s*&&\s*\1\.pin\s*===\s*pin\)/;
const match = content.match(workerPinPattern);
if (match) {
  console.log('Found worker+pin check:', match[0]);
  content = content.replace(workerPinPattern, (m, varName) => `workers.find(${varName} => ${varName}.phone === phone)`);
  console.log('Replaced successfully!');
} else {
  console.log('Worker+pin pattern not found, searching broader...');
  // Try to find lines with "worker" and "pin"
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('workers') && lines[i].includes('.pin') && lines[i].includes('phone')) {
      console.log(`Line ${i}: ${lines[i].substring(0, 200)}`);
    }
  }
}

fs.writeFileSync('assets/index-DvcepVfO.js', content, 'utf8');
console.log('Done!');
