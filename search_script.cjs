const fs = require('fs');
const content = fs.readFileSync('assets/index-DvcepVfO.js', 'utf8');
console.log('Length:', content.length);
console.log('Contains password?', content.includes('password'));
console.log('Contains login?', content.includes('login'));
console.log('Contains كلمة?', content.includes('كلمة'));
console.log('Contains المرور?', content.includes('المرور'));
console.log('Contains عمال?', content.includes('عمال'));
console.log('Contains worker?', content.includes('worker'));
console.log('Contains admin?', content.includes('admin'));

// Find lines containing the word Admin or Worker case-insensitive
let lines = content.split('\n');
console.log('Total Lines:', lines.length);

for (let i = 0; i < lines.length; i++) {
  if (/عمال|مرور|كلمة|worker|admin|login/i.test(lines[i])) {
    console.log(`Match on line ${i+1}: ${lines[i].substring(0, 100)}...`);
  }
}
