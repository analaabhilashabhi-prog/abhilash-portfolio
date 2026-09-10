const fs = require('fs');
const content = fs.readFileSync('temp_user_svg.txt', 'utf8');

const regex = /cx="([\d\.]+)"\s+cy="([\d\.]+)"\s+r="([\d\.]+)"/g;
let m;
const dots = [];

while ((m = regex.exec(content)) !== null) {
  const x = parseFloat(m[1]), y = parseFloat(m[2]), r = parseFloat(m[3]);
  dots.push({ x, y, r });
}

const step = 6.4;
const minX = 41.6;
const maxX = 918.4;
const minY = 35.2;
const maxY = 214.4;

const W = Math.round((maxX - minX) / step) + 1;
const H = Math.round((maxY - minY) / step) + 1;

const grid = Array.from({ length: H }, () => Array(W).fill(' '));

for (const d of dots) {
  if (d.r >= 1.5) {
    const gx = Math.round((d.x - minX) / step);
    const gy = Math.round((d.y - minY) / step);
    if (gx >= 0 && gx < W && gy >= 0 && gy < H) {
      grid[gy][gx] = d.r > 2.1 ? '█' : '•';
    }
  }
}

for (let r = 0; r < H; r++) {
  const line = grid[r].join('');
  if (line.trim().length > 0) {
    console.log(`[${String(r).padStart(2, '0')}] ${line}`);
  } else {
    console.log(`[${String(r).padStart(2, '0')}]`);
  }
}
