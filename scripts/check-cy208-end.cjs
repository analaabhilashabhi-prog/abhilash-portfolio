const fs = require('fs');
const content = fs.readFileSync('temp_user_svg.txt', 'utf8');

// Let's find "solutions" or "solution" in line 5 or elsewhere
// In line 5:
// "production-ready data solutions."
// We have "solutions" starting at x=604.8:
// s: 604.8 - 617.6
// o: 624.0 - 636.8
// l: 643.2
// u: 649.6 - 662.4
// t: 668.8 - 681.6 (cx=668.8 cy=214.4 is the very last dot received!)
// Let's see what is at cy=208 for t, i, o, n, s, .:
const regex = /cx="([\d\.]+)"\s+cy="([\d\.]+)"\s+r="([\d\.]+)"/g;
let m;
const dots = [];
while ((m = regex.exec(content)) !== null) {
  dots.push({ x: parseFloat(m[1]), y: parseFloat(m[2]), r: parseFloat(m[3]) });
}

const cy208_end = dots.filter(d => Math.abs(d.y - 208) < 0.1 && d.x >= 660);
console.log('cy=208 end dots:');
for (const d of cy208_end) {
  console.log(`x: ${d.x.toFixed(1)}, r: ${d.r}`);
}
