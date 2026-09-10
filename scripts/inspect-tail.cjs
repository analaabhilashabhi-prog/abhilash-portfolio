const fs = require('fs');
const content = fs.readFileSync('temp_user_svg.txt', 'utf8');

const regex = /cx="([\d\.]+)"\s+cy="([\d\.]+)"\s+r="([\d\.]+)"/g;
let m;
const dots = [];
while ((m = regex.exec(content)) !== null) {
  dots.push({ x: parseFloat(m[1]), y: parseFloat(m[2]), r: parseFloat(m[3]) });
}

// Inspect x >= 730 on Line 5
const b5 = dots.filter(d => d.y >= 200 && d.x >= 730);
const step = 6.4;
const minX = 730;
const maxX = 900;
const W = Math.round((maxX - minX) / step) + 1;
const H = 3;
const grid = Array.from({ length: H }, () => Array(W).fill(' '));
for (const d of b5) {
  const gx = Math.round((d.x - minX) / step);
  const gy = Math.round((d.y - 201.6) / step);
  if (gx >= 0 && gx < W && gy >= 0 && gy < H) {
    grid[gy][gx] = d.r > 2.0 ? '█' : (d.r > 1.4 ? '•' : '.');
  }
}
console.log(grid.map((row, i) => `${(201.6 + i*6.4).toFixed(1)}: ${row.join('')}`).join('\n'));
