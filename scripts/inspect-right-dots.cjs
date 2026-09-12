const fs = require('fs');
const svg = fs.readFileSync('src/assets/monitor-halftone-frame.svg', 'utf8');
const circles = [];
const re = /<circle[^>]*cx="([^"]+)"[^>]*cy="([^"]+)"[^>]*r="([^"]+)"[^>]*fill="([^"]+)"/g;
let m;
while ((m = re.exec(svg)) !== null) {
  circles.push({ cx: parseFloat(m[1]), cy: parseFloat(m[2]), r: parseFloat(m[3]), fill: m[4] });
}
const rightDots = circles.filter(c => c.cx >= 690 && c.cy >= 100 && c.cy <= 320);
console.log('Right dots in screen area (count):', rightDots.length);
console.log(rightDots.slice(0, 20));
