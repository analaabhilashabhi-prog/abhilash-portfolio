const fs = require('fs');
const path = require('path');

function getBounds(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const circleRegex = /<circle\s+cx="([\d.-]+)"\s+cy="([\d.-]+)"\s+r="([\d.-]+)"/g;
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  let match;
  while ((match = circleRegex.exec(content)) !== null) {
    const cx = parseFloat(match[1]);
    const cy = parseFloat(match[2]);
    const r = parseFloat(match[3]);
    minX = Math.min(minX, cx - r);
    maxX = Math.max(maxX, cx + r);
    minY = Math.min(minY, cy - r);
    maxY = Math.max(maxY, cy + r);
  }
  return { content, minX, maxX, minY, maxY };
}

function normalizeSvg(filePath, paddingFactor = 0.15) {
  const { content, minX, maxX, minY, maxY } = getBounds(filePath);
  const midX = (minX + maxX) / 2;
  const midY = (minY + maxY) / 2;
  const maxDim = Math.max(maxX - minX, maxY - minY);
  
  // Total size of square viewBox including padding
  const size = maxDim * (1 + paddingFactor);
  const vbX = Math.round(midX - size / 2);
  const vbY = Math.round(midY - size / 2);
  const vbSize = Math.round(size);
  
  const newViewBox = `${vbX} ${vbY} ${vbSize} ${vbSize}`;
  console.log(filePath, 'Bounds:', { minX, maxX, minY, maxY, midX, midY, maxDim }, 'New viewBox:', newViewBox);
  
  const updatedContent = content.replace(/viewBox="[^"]*"/, `viewBox="${newViewBox}"`);
  fs.writeFileSync(filePath, updatedContent, 'utf-8');
}

normalizeSvg(path.join(__dirname, '..', 'src', 'assets', 'logos', 'logo-dotted-color.svg'));
normalizeSvg(path.join(__dirname, '..', 'src', 'assets', 'logos', 'logo-dotted-2.svg'));
