const fs = require('fs');
const path = require('path');

const transcriptPath = path.join(
  'C:', 'Users', 'HP', '.gemini', 'antigravity-ide', 'brain',
  '4ea5c8b3-e00a-4912-8485-3b9e7ed0824b',
  '.system_generated', 'logs', 'transcript_full.jsonl'
);

const content = fs.readFileSync(transcriptPath, 'utf-8');
const lines = content.trim().split('\n');

// Line 880 has the colored SVG
const line = JSON.parse(lines[880]);
const text = line.content || '';

// Find the SVG start
const svgStart = text.indexOf('<svg');
if (svgStart === -1) {
  console.log('No SVG start found');
  process.exit(1);
}

// Extract from SVG start to end of text, then append closing tag if missing
let svgContent = text.substring(svgStart);

// Remove any HTML after potential SVG (like </div></body></html>)
// The SVG circles end with /> patterns
// Find the last circle element
const lastCircleEnd = svgContent.lastIndexOf('/>');
if (lastCircleEnd !== -1) {
  svgContent = svgContent.substring(0, lastCircleEnd + 2) + '</svg>';
}

const outputPath = path.join(__dirname, '..', 'src', 'assets', 'logos', 'logo-dotted-color.svg');
fs.writeFileSync(outputPath, svgContent, 'utf-8');
console.log('Saved colored logo! Size:', (svgContent.length / 1024).toFixed(1) + 'KB');

// Count circles
const circleCount = (svgContent.match(/<circle/g) || []).length;
console.log('Circles:', circleCount);
