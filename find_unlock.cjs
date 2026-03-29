const fs = require('fs');
const content = fs.readFileSync('assets/index-DvcepVfO.js', 'utf8');
const lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('isUnlocked') || line.includes('unlock') || line.includes('SALT') || line.includes('jg_session_pin') || line.includes('PIN_hash')) {
    console.log(`Line ${i}: ${line.trim().substring(0, 200)}`);
    console.log('---');
  }
}
