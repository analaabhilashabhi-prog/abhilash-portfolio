const fs = require('fs');
const svg = fs.readFileSync('src/assets/monitor-halftone-frame.svg', 'utf8');
const circles = [];
const re = /<circle[^>]*cx="([^"]+)"[^>]*cy="([^"]+)"[^>]*r="([^"]+)"[^>]*fill="([^"]+)"/g;
let m;
while ((m = re.exec(svg)) !== null) {
  circles.push({ cx: parseFloat(m[1]), cy: parseFloat(m[2]), r: parseFloat(m[3]), fill: m[4] });
}

// Check dots in slice y = 200 to 220
const slice = circles.filter(c => c.cy >= 200 && c.cy <= 220);
slice.sort((a,b) => a.cx - b.cx);
console.log('Slice y=200..220 dots:', slice);
