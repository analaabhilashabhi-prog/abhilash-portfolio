const fs = require('fs');
const content = fs.readFileSync('temp_user_svg.txt', 'utf8');

const regex = /cx="([\d\.]+)"\s+cy="([\d\.]+)"\s+r="([\d\.]+)"/g;
let m;
const dots = [];
while ((m = regex.exec(content)) !== null) {
  dots.push({ x: parseFloat(m[1]), y: parseFloat(m[2]), r: parseFloat(m[3]) });
}

// In line 5:
// Let's print all dots with y >= 200 and x >= 600
const b5_end = dots.filter(d => d.y >= 200 && d.x >= 600 && d.r > 1.2);
const step = 6.4;
const minX = 600;
const maxX = 880;
const minY = 201.6;
const maxY = 214.4;

const W = Math.round((maxX - minX) / step) + 1;
const H = Math.round((maxY - minY) / step) + 1;
const grid = Array.from({ length: H }, () => Array(W).fill(' '));

for (const d of b5_end) {
  const gx = Math.round((d.x - minX) / step);
  const gy = Math.round((d.y - minY) / step);
  if (gx >= 0 && gx < W && gy >= 0 && gy < H) {
    grid[gy][gx] = d.r > 2.0 ? '█' : '•';
  }
}

console.log('Grid for end of Line 5:');
console.log(grid.map((row, i) => `cy=${(minY + i * step).toFixed(1)}: ${row.join('')}`).join('\n'));
