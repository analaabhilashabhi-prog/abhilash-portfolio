const fs = require('fs');
const svg = fs.readFileSync('src/assets/monitor-halftone-frame.svg', 'utf8');
const circles = [];
const re = /<circle[^>]*cx="([^"]+)"[^>]*cy="([^"]+)"[^>]*r="([^"]+)"[^>]*fill="([^"]+)"/g;
let m;
while ((m = re.exec(svg)) !== null) {
  circles.push({ cx: parseFloat(m[1]), cy: parseFloat(m[2]), r: parseFloat(m[3]), fill: m[4] });
}

const leftDots = circles.filter(c => c.cx < 300);
console.log('Total dots with cx < 300:', leftDots.length);
leftDots.sort((a,b) => a.cy - b.cy);
console.log('Min Y:', leftDots[0]);
console.log('Max Y:', leftDots[leftDots.length - 1]);
console.log('All left dots:', leftDots.map(c => `(${c.cx}, ${c.cy})`).join(' '));
