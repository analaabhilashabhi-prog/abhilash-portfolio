const fs = require('fs');
const svg = fs.readFileSync('src/assets/monitor-halftone-frame.svg', 'utf8');
const circles = [];
const re = /<circle[^>]*cx="([^"]+)"[^>]*cy="([^"]+)"[^>]*r="([^"]+)"[^>]*fill="([^"]+)"/g;
let m;
while ((m = re.exec(svg)) !== null) {
  circles.push({ cx: parseFloat(m[1]), cy: parseFloat(m[2]), r: parseFloat(m[3]), fill: m[4] });
}

function pointInPolygon(point, vs) {
  const x = point.cx, y = point.cy;
  let inside = false;
  for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    const xi = vs[i].x, yi = vs[i].y;
    const xj = vs[j].x, yj = vs[j].y;
    const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

const STAGE_W = 960;
const STAGE_H = 532;

function checkCollisions(name, p0, p1, p2, p3) {
  const vs = [
    { x: p0[0] * STAGE_W, y: p0[1] * STAGE_H },
    { x: p1[0] * STAGE_W, y: p1[1] * STAGE_H },
    { x: p2[0] * STAGE_W, y: p2[1] * STAGE_H },
    { x: p3[0] * STAGE_W, y: p3[1] * STAGE_H }
  ];

  const insideDots = circles.filter(c => pointInPolygon(c, vs));
  console.log(`\n${name}: Dots inside quad = ${insideDots.length}`);
  if (insideDots.length > 0) {
    console.log('Sample inside dots:', insideDots.slice(0, 5));
  }
}

// Baseline
checkCollisions('1. Baseline', [0.2403, 0.2078], [0.7685, 0.0690], [0.7525, 0.6650], [0.1982, 0.8054]);

// Option 2 (Medium tilt ~10.4°)
checkCollisions('2. Medium tilt (~10.4°)', [0.2380, 0.2220], [0.7720, 0.0450], [0.7540, 0.6380], [0.1950, 0.8160]);

// Option 2B (Tuned medium tilt: top-right 5.20%, bottom-right 65.00%)
checkCollisions('2B. Tuned tilt (~10.0°)', [0.2390, 0.2180], [0.7700, 0.0520], [0.7530, 0.6480], [0.1960, 0.8120]);

// Option 3 (Pronounced tilt ~12.2°)
checkCollisions('3. Pronounced tilt (~12.2°)', [0.2350, 0.2380], [0.7750, 0.0280], [0.7560, 0.6180], [0.1920, 0.8280]);
