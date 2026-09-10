const fs = require('fs');
const content = fs.readFileSync('temp_user_svg.txt', 'utf8');

const regex = /cx="([\d\.]+)"\s+cy="([\d\.]+)"\s+r="([\d\.]+)"/g;
let m;
const dots = [];
while ((m = regex.exec(content)) !== null) {
  dots.push({ x: parseFloat(m[1]), y: parseFloat(m[2]), r: parseFloat(m[3]) });
}

// Group into the 5 bands
const lines = [
  { name: 'Line 1', yBase: 35.2, rows: [35.2, 41.6, 48.0, 54.4, 60.8] },
  { name: 'Line 2', yBase: 73.6, rows: [73.6, 80.0, 86.4, 92.8, 99.2] },
  { name: 'Line 3', yBase: 118.4, rows: [118.4, 124.8, 131.2, 137.6, 144.0] },
  { name: 'Line 4', yBase: 156.8, rows: [156.8, 163.2, 169.6, 176.0, 182.4] },
  { name: 'Line 5', yBase: 201.6, rows: [201.6, 208.0, 214.4] }
];

const step = 6.4;

for (const l of lines) {
  const lDots = dots.filter(d => l.rows.some(r => Math.abs(d.y - r) < 0.1) && d.r > 1.3);
  const minX = Math.min(...lDots.map(d => d.x));
  const maxX = Math.max(...lDots.map(d => d.x));
  const W = Math.round((maxX - minX) / step) + 1;
  const H = l.rows.length;
  const grid = Array.from({ length: H }, () => Array(W).fill(' '));
  
  for (const d of lDots) {
    const gx = Math.round((d.x - minX) / step);
    const gy = l.rows.findIndex(r => Math.abs(d.y - r) < 0.1);
    if (gx >= 0 && gx < W && gy >= 0 && gy < H) {
      grid[gy][gx] = d.r > 2.0 ? '█' : '•';
    }
  }
  
  console.log(`\n=== ${l.name} ===`);
  console.log(grid.map(row => row.join('')).join('\n'));
}
