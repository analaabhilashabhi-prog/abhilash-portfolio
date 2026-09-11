const fs = require('fs');
let content = fs.readFileSync('src/assets/logos/text-toolstack-desc.svg', 'utf8');

// Replace any c2pa attribute
content = content.replace(/ xmlns:c2pa="[^"]*"/g, '');
content = content.replace(/<metadata>[\s\S]*?<\/metadata>/g, '');

fs.writeFileSync('src/assets/logos/text-toolstack-desc.svg', content.trim());
console.log('Header:', content.slice(0, 80));
console.log('Valid starts:', content.startsWith('<svg viewBox="0 0 960 265" xmlns="http://www.w3.org/2000/svg">'));
