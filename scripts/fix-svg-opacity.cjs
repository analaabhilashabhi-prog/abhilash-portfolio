const fs = require('fs');
let content = fs.readFileSync('src/assets/logos/text-toolstack-desc.svg', 'utf8');

// Ensure valid header
if (!content.startsWith('<svg viewBox="0 0 960 265" xmlns="http://www.w3.org/2000/svg">')) {
  const idx = content.indexOf('<svg');
  if (idx !== -1) content = content.slice(idx);
}

// Replace opacity:0 with opacity:1 so dots are always visible regardless of browser animation support
content = content.replace('.dot{opacity:0;', '.dot{opacity:1;');

fs.writeFileSync('src/assets/logos/text-toolstack-desc.svg', content.trim());
console.log('Updated. First 100 chars:', content.slice(0, 100));
