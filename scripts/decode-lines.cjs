const fs = require('fs');
const content = fs.readFileSync('temp_user_svg.txt', 'utf8');

const regex = /cx="([\d\.]+)"\s+cy="([\d\.]+)"\s+r="([\d\.]+)"/g;
let m;
const dots = [];
while ((m = regex.exec(content)) !== null) {
  dots.push({ x: parseFloat(m[1]), y: parseFloat(m[2]), r: parseFloat(m[3]) });
}

// Let's print each line's bounding box and dots
const lines = [
  { name: 'Line 1', yMin: 30, yMax: 65 },
  { name: 'Line 2', yMin: 70, yMax: 105 },
  { name: 'Line 3', yMin: 110, yMax: 148 },
  { name: 'Line 4', yMin: 152, yMax: 188 },
  { name: 'Line 5', yMin: 195, yMax: 230 },
];

for (const l of lines) {
  const lDots = dots.filter(d => d.y >= l.yMin && d.y <= l.yMax);
  const solidDots = lDots.filter(d => d.r > 1.8);
  console.log(`${l.name}: total=${lDots.length}, solid=${solidDots.length}, xRange: ${Math.min(...lDots.map(d=>d.x))} -> ${Math.max(...lDots.map(d=>d.x))}, yRange: ${Math.min(...lDots.map(d=>d.y))} -> ${Math.max(...lDots.map(d=>d.y))}`);
}
