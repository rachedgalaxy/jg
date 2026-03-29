const fs = require('fs');
const content = fs.readFileSync('assets/index-DvcepVfO.js', 'utf8');

// Search for password-related patterns
const patterns = ['password', 'Password', 'كلمة', 'isAuthenticated', 'isLoggedIn', 'checkAuth', 'authenticate', 'setAuth', 'localStorage', 'sessionStorage'];

for (const p of patterns) {
  const idx = content.indexOf(p);
  if (idx !== -1) {
    const start = Math.max(0, idx - 200);
    const end = Math.min(content.length, idx + 300);
    console.log(`\n=== Found "${p}" at index ${idx} ===`);
    console.log(content.substring(start, end));
    console.log('...');
  } else {
    console.log(`"${p}" not found`);
  }
}
