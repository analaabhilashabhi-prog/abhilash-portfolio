const fs = require('fs');
const content = fs.readFileSync('src/assets/logos/text-toolstack-desc.svg', 'utf8');

const regex = /cx="([\d\.]+)"\s+cy="([\d\.]+)"\s+r="([\d\.]+)"/g;
let m;
const dots = [];
while ((m = regex.exec(content)) !== null) {
  dots.push({ x: parseFloat(m[1]), y: parseFloat(m[2]), r: parseFloat(m[3]) });
}

const b5 = dots.filter(d => d.y >= 200 && d.r > 1.2);
const step = 6.4;
const minX = 80;
const maxX = 900;
const minY = 201.6;
const maxY = 214.4;

const W = Math.round((maxX - minX) / step) + 1;
const H = Math.round((maxY - minY) / step) + 1;
const grid = Array.from({ length: H }, () => Array(W).fill(' '));

for (const d of b5) {
  const gx = Math.round((d.x - minX) / step);
  const gy = Math.round((d.y - minY) / step);
  if (gx >= 0 && gx < W && gy >= 0 && gy < H) {
    grid[gy][gx] = d.r > 2.0 ? '█' : '•';
  }
}

console.log('Complete line 5 in SVG:');
console.log(grid.map((row, i) => `cy=${(minY + i * step).toFixed(1)}: ${row.join('')}`).join('\n'));
