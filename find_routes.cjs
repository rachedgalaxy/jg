const fs = require('fs');
const content = fs.readFileSync('assets/index-DvcepVfO.js', 'utf8');
const lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('/admin/orders') || line.includes('/login') || line.includes('Navigate') || line.includes('matbaaty_user')) {
    console.log(`Line ${i}: ${line.trim().substring(0, 250)}`);
    console.log('---');
  }
}
