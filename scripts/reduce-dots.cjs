// Script to reduce dots in the SVG by keeping every other dot (checkerboard pattern)
const fs = require('fs');
const path = require('path');

const svgPath = path.join(__dirname, '..', 'src', 'assets', 'logos', 'logo-dotted-1.svg');
const svgContent = fs.readFileSync(svgPath, 'utf-8');

// Parse all circles
const circleRegex = /<circle\s+cx="([\d.]+)"\s+cy="([\d.]+)"\s+r="([\d.]+)"\s+fill="([^"]+)"\/>/g;

let circles = [];
let match;
while ((match = circleRegex.exec(svgContent)) !== null) {
  circles.push({
    cx: parseFloat(match[1]),
    cy: parseFloat(match[2]),
    r: parseFloat(match[3]),
    fill: match[4],
    full: match[0],
  });
}

console.log(`Total circles found: ${circles.length}`);

// Determine spacing - dots are on an 11px grid
// Keep every other dot in both x and y (checkerboard), effectively halving the count
// We'll use row/col indices based on sorted unique positions

const uniqueYs = [...new Set(circles.map(c => c.cy))].sort((a, b) => a - b);
const uniqueXs = [...new Set(circles.map(c => c.cx))].sort((a, b) => a - b);

const yIndex = new Map();
uniqueYs.forEach((y, i) => yIndex.set(y, i));
const xIndex = new Map();
uniqueXs.forEach((x, i) => xIndex.set(x, i));

// Keep circle if (rowIndex + colIndex) is even (checkerboard)
const keptCircles = circles.filter(c => {
  const row = yIndex.get(c.cy);
  const col = xIndex.get(c.cx);
  return (row + col) % 2 === 0;
});

console.log(`Kept circles: ${keptCircles.length} (removed ${circles.length - keptCircles.length})`);

// Also increase radius slightly to compensate for fewer dots
const newCircles = keptCircles.map(c => {
  const newR = Math.min(c.r * 1.3, 6.5); // slightly bigger dots
  return `<circle cx="${c.cx}" cy="${c.cy}" r="${newR.toFixed(2)}" fill="${c.fill}"/>`;
});

// Extract the viewBox from the original
const viewBoxMatch = svgContent.match(/viewBox="([^"]+)"/);
const viewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 960 960';

// Extract xmlns attributes
const xmlnsMatch = svgContent.match(/<svg[^>]*>/);
const svgOpen = xmlnsMatch ? xmlnsMatch[0] : `<svg viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg">`;

const newSvg = `${svgOpen}${newCircles.join('')}</svg>`;

// Write to a new file
const outputPath = path.join(__dirname, '..', 'src', 'assets', 'logos', 'logo-dotted-1-reduced.svg');
fs.writeFileSync(outputPath, newSvg, 'utf-8');
console.log(`Written reduced SVG to: ${outputPath}`);
console.log(`File size: ${(Buffer.byteLength(newSvg) / 1024).toFixed(1)} KB (was ${(Buffer.byteLength(svgContent) / 1024).toFixed(1)} KB)`);
