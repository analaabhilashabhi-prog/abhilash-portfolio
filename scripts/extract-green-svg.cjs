const fs = require('fs');
const path = require('path');

const transcriptPath = path.join(
  'C:', 'Users', 'HP', '.gemini', 'antigravity-ide', 'brain',
  '4ea5c8b3-e00a-4912-8485-3b9e7ed0824b',
  '.system_generated', 'logs', 'transcript_full.jsonl'
);

const content = fs.readFileSync(transcriptPath, 'utf-8');
const lines = content.trim().split('\n');
console.log('Total transcript lines:', lines.length);

for (let i = lines.length - 1; i >= 0; i--) {
  try {
    const parsed = JSON.parse(lines[i]);
    if (parsed.type === 'USER_INPUT' && parsed.content.includes('<svg')) {
      console.log('Found user input at line', i);
      const text = parsed.content;
      const svgStart = text.indexOf('<svg');
      const svgEnd = text.lastIndexOf('</svg>') + 6;
      let svg = text.substring(svgStart, svgEnd);

      // Strip <metadata>...</metadata> block
      svg = svg.replace(/<metadata>[\s\S]*?<\/metadata>/g, '');
      // Clean extra namespace
      svg = svg.replace(/\s*xmlns:c2pa="[^"]*"/g, '');

      const circles = (svg.match(/<circle/g) || []).length;
      console.log('Total circles in extracted SVG:', circles);
      console.log('Clean SVG length:', svg.length);

      const outPath = path.join(__dirname, '..', 'src', 'assets', 'logos', 'logo-dotted-2.svg');
      fs.writeFileSync(outPath, svg, 'utf-8');
      console.log('Successfully saved to', outPath);
      break;
    }
  } catch (e) {
    // skip non-json lines
  }
}
