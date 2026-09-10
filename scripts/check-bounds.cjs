const fs = require('fs');
const content = fs.readFileSync('src/assets/test-desc.svg', 'utf8');

const regex = /cx="([\d\.]+)"\s+cy="([\d\.]+)"\s+r="([\d\.]+)"/g;
let m;
let minX = 9999, maxX = -9999, minY = 9999, maxY = -9999;
let count = 0;

while ((m = regex.exec(content)) !== null) {
  const x = parseFloat(m[1]), y = parseFloat(m[2]), r = parseFloat(m[3]);
  count++;
  minX = Math.min(minX, x - r);
  maxX = Math.max(maxX, x + r);
  minY = Math.min(minY, y - r);
  maxY = Math.max(maxY, y + r);
}

console.log({ count, minX, maxX, minY, maxY, width: maxX - minX, height: maxY - minY });
