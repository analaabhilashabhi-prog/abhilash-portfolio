const fs = require('fs');
const content = fs.readFileSync('temp_user_svg.txt', 'utf8');

const regex = /cx="([\d\.]+)"\s+cy="([\d\.]+)"\s+r="([\d\.]+)"/g;
let m;
const dots = [];
while ((m = regex.exec(content)) !== null) {
  dots.push({ x: parseFloat(m[1]), y: parseFloat(m[2]), r: parseFloat(m[3]) });
}

// In "production":
// "t": x ~ 208-214
// "i": x ~ 227-233
// "o": x ~ 246-260
// "n": x ~ 272-285
const tionDots = dots.filter(d => d.y >= 200 && d.x >= 200 && d.x <= 300);
console.log('tion in production:');
for (const cy of [201.6, 208.0, 214.4]) {
  const row = tionDots.filter(d => Math.abs(d.y - cy) < 0.1).sort((a,b) => a.x - b.x);
  console.log(`cy=${cy}:`, row.map(d => `x=${d.x}(r=${d.r})`).join(', '));
}
