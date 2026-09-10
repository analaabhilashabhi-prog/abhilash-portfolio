const fs = require('fs');
const path = require('path');

// Re-read the ORIGINAL colored logo from the transcript extraction
// Since we overwrote it, let's re-extract first
const transcriptPath = path.join(
  'C:', 'Users', 'HP', '.gemini', 'antigravity-ide', 'brain',
  '4ea5c8b3-e00a-4912-8485-3b9e7ed0824b',
  '.system_generated', 'logs', 'transcript_full.jsonl'
);

const content = fs.readFileSync(transcriptPath, 'utf-8');
const lines = content.trim().split('\n');
const line = JSON.parse(lines[880]);
const text = line.content || '';
const svgStart = text.indexOf('<svg');
let svgContent = text.substring(svgStart);
const lastCircleEnd = svgContent.lastIndexOf('/>');
svgContent = svgContent.substring(0, lastCircleEnd + 2) + '</svg>';

const circleRegex = /<circle\s+cx="([\d.]+)"\s+cy="([\d.]+)"\s+r="([\d.]+)"\s+fill="([^"]+)"\/>/g;
let circles = [];
let match;
while ((match = circleRegex.exec(svgContent)) !== null) {
  circles.push({ cx: parseFloat(match[1]), cy: parseFloat(match[2]), r: parseFloat(match[3]), fill: match[4] });
}

console.log('Original circles:', circles.length);

// Keep every 3rd row and every 3rd column (~1/9 of dots)
// Actually let's do every 2nd row, every 3rd col for ~1/6
const uniqueYs = [...new Set(circles.map(c => c.cy))].sort((a, b) => a - b);
const uniqueXs = [...new Set(circles.map(c => c.cx))].sort((a, b) => a - b);
const yIdx = new Map(); uniqueYs.forEach((y, i) => yIdx.set(y, i));
const xIdx = new Map(); uniqueXs.forEach((x, i) => xIdx.set(x, i));

// Keep if both row and col indices are even (every other in both directions = 1/4)
const kept = circles.filter(c => yIdx.get(c.cy) % 2 === 0 && xIdx.get(c.cx) % 2 === 0);
console.log('Kept:', kept.length);

// Make dots bigger to compensate
const newCircles = kept.map(c => {
  const newR = Math.min(c.r * 1.8, 8.5);
  return `<circle cx="${c.cx}" cy="${c.cy}" r="${newR.toFixed(2)}" fill="${c.fill}"/>`;
});

const viewBoxMatch = svgContent.match(/<svg[^>]*>/);
const svgOpen = viewBoxMatch[0];
const newSvg = `${svgOpen}${newCircles.join('')}</svg>`;

const outputPath = path.join(__dirname, '..', 'src', 'assets', 'logos', 'logo-dotted-color.svg');
fs.writeFileSync(outputPath, newSvg, 'utf-8');
console.log('Saved! Size:', (newSvg.length / 1024).toFixed(1) + 'KB');
