const fs = require('fs');
const path = require('path');

function analyze(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const circleRegex = /<circle\s+cx="([\d.]+)"\s+cy="([\d.]+)"\s+r="([\d.]+)"/g;
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  let count = 0;
  let match;
  while ((match = circleRegex.exec(content)) !== null) {
    const cx = parseFloat(match[1]);
    const cy = parseFloat(match[2]);
    const r = parseFloat(match[3]);
    minX = Math.min(minX, cx - r);
    maxX = Math.max(maxX, cx + r);
    minY = Math.min(minY, cy - r);
    maxY = Math.max(maxY, cy + r);
    count++;
  }
  console.log(filePath, {
    count,
    minX: Math.round(minX),
    maxX: Math.round(maxX),
    minY: Math.round(minY),
    maxY: Math.round(maxY),
    width: Math.round(maxX - minX),
    height: Math.round(maxY - minY)
  });
}

analyze(path.join(__dirname, '..', 'src', 'assets', 'logos', 'logo-dotted-color.svg'));
analyze(path.join(__dirname, '..', 'src', 'assets', 'logos', 'logo-dotted-2.svg'));
