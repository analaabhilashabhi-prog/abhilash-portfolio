const fs = require('fs');
const content = fs.readFileSync('temp_user_svg.txt', 'utf8');

const regex = /cx="([\d\.]+)"\s+cy="([\d\.]+)"\s+r="([\d\.]+)"/g;
let m;
const cySet = new Set();
const dots = [];

while ((m = regex.exec(content)) !== null) {
  const x = parseFloat(m[1]), y = parseFloat(m[2]), r = parseFloat(m[3]);
  cySet.add(y);
  dots.push({ x, y, r });
}

const cySorted = Array.from(cySet).sort((a, b) => a - b);
console.log('Distinct cy values:', cySorted);

// Group into horizontal bands
const bands = [];
let currentBand = [cySorted[0]];
for (let i = 1; i < cySorted.length; i++) {
  if (cySorted[i] - cySorted[i - 1] > 12) {
    bands.push(currentBand);
    currentBand = [cySorted[i]];
  } else {
    currentBand.push(cySorted[i]);
  }
}
bands.push(currentBand);

console.log('Bands:', bands.map(b => `${b[0]} -> ${b[b.length-1]}`));

// Print each band as ascii
for (let bi = 0; bi < bands.length; bi++) {
  const b = bands[bi];
  const bDots = dots.filter(d => d.y >= b[0] - 0.1 && d.y <= b[b.length-1] + 0.1 && d.r > 1.4);
  if (!bDots.length) continue;
  const minX = Math.min(...bDots.map(d => d.x));
  const maxX = Math.max(...bDots.map(d => d.x));
  const minY = Math.min(...bDots.map(d => d.y));
  const maxY = Math.max(...bDots.map(d => d.y));
  const W = 100, H = b.length;
  const grid = Array.from({ length: H }, () => Array(W).fill(' '));
  for (const d of bDots) {
    const gx = Math.floor(((d.x - minX) / (maxX - minX)) * (W - 1));
    const gy = b.indexOf(d.y);
    if (gx >= 0 && gx < W && gy >= 0 && gy < H) grid[gy][gx] = '#';
  }
  console.log(`\n--- BAND ${bi + 1} (y: ${minY} to ${maxY}) ---`);
  console.log(grid.map(row => row.join('')).join('\n'));
}
