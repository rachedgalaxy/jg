const fs = require('fs');
const content = fs.readFileSync('assets/index-DvcepVfO.js', 'utf8');
const lines = content.split('\n');

// Search for lines containing both "phone" and "pin" together (worker auth logic)
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if ((line.includes('.phone') && line.includes('.pin')) || 
      (line.includes('phone') && line.includes('worker')) ||
      (line.includes('handleLogin') || line.includes('getWorkers'))) {
    console.log(`Line ${i}:`);
    console.log(line.trim().substring(0, 300));
    console.log('---');
  }
}
