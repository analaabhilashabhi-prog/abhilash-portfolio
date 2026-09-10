const fs = require('fs');
const content = fs.readFileSync('temp_user_svg.txt', 'utf8');

const regex = /cx="([\d\.]+)"\s+cy="([\d\.]+)"\s+r="([\d\.]+)"/g;
let m;
const dots = [];

while ((m = regex.exec(content)) !== null) {
  const x = parseFloat(m[1]), y = parseFloat(m[2]), r = parseFloat(m[3]);
  dots.push({ x, y, r });
}

const b5 = dots.filter(d => d.y >= 200 && d.r > 1.5);
// Sort by x
const lastDots = b5.filter(d => d.x > 500).sort((a,b) => a.x - b.x);
console.log('Last dots x range:', Math.min(...lastDots.map(d=>d.x)), Math.max(...lastDots.map(d=>d.x)));

// Let's see: at x > 500, what letters are rendered?
// Let's print the grid for x from 500 to 900
const step = 6.4;
const minX = 500;
const maxX = 900;
const minY = 201.6;
const maxY = 214.4;

const W = Math.round((maxX - minX) / step) + 1;
const H = Math.round((maxY - minY) / step) + 1;
const grid = Array.from({ length: H }, () => Array(W).fill(' '));

for (const d of b5) {
  if (d.x >= minX && d.x <= maxX) {
    const gx = Math.round((d.x - minX) / step);
    const gy = Math.round((d.y - minY) / step);
    if (gx >= 0 && gx < W && gy >= 0 && gy < H) {
      grid[gy][gx] = d.r > 2.0 ? '█' : '•';
    }
  }
}

console.log(grid.map(row => row.join('')).join('\n'));
