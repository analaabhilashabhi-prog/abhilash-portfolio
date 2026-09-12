const fs = require('fs');
const svg = fs.readFileSync('src/assets/monitor-halftone-frame.svg', 'utf8');
const circles = [];
const re = /<circle[^>]*cx="([^"]+)"[^>]*cy="([^"]+)"[^>]*r="([^"]+)"[^>]*fill="([^"]+)"/g;
let m;
while ((m = re.exec(svg)) !== null) {
  circles.push({ cx: parseFloat(m[1]), cy: parseFloat(m[2]), r: parseFloat(m[3]), fill: m[4] });
}

const middleDots = circles.filter(c => c.cy >= 120 && c.cy <= 340 && c.cx >= 250 && c.cx <= 700);
console.log('Dots in the middle of screen (x between 250 and 700, y between 120 and 340):', middleDots.length);
if (middleDots.length > 0) {
  console.log(middleDots.slice(0, 10));
}
