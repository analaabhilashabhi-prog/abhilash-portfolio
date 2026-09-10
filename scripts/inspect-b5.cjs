const fs = require('fs');
const content = fs.readFileSync('temp_user_svg.txt', 'utf8');

const regex = /cx="([\d\.]+)"\s+cy="([\d\.]+)"\s+r="([\d\.]+)"/g;
let m;
const dots = [];

while ((m = regex.exec(content)) !== null) {
  const x = parseFloat(m[1]), y = parseFloat(m[2]), r = parseFloat(m[3]);
  dots.push({ x, y, r });
}

// Print Band 5 in high resolution
const b5 = dots.filter(d => d.y >= 201);
const minX = Math.min(...b5.map(d => d.x));
const maxX = Math.max(...b5.map(d => d.x));
console.log('B5 minX:', minX, 'maxX:', maxX);

// Each grid column is 6.4 px (since dots are spaced by 6.4px!)
// cx values: 86.4, 92.8, 99.2, 105.6 ... 6.4 step!
const stepX = 6.4;
const stepY = 6.4;
const minGridX = Math.round(minX / stepX);
const maxGridX = Math.round(maxX / stepX);
const minGridY = Math.round(201.6 / stepY);
const maxGridY = Math.round(214.4 / stepY);

const H = maxGridY - minGridY + 1;
const W = maxGridX - minGridX + 1;
const grid = Array.from({ length: H }, () => Array(W).fill(' '));

for (const d of b5) {
  if (d.r > 1.4) {
    const gx = Math.round(d.x / stepX) - minGridX;
    const gy = Math.round(d.y / stepY) - minGridY;
    if (gx >= 0 && gx < W && gy >= 0 && gy < H) {
      grid[gy][gx] = d.r > 2.0 ? '█' : '•';
    }
  }
}

console.log(grid.map(row => row.join('')).join('\n'));
