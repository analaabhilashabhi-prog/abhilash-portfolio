const fs = require('fs');
const path = require('path');

const transcriptPath = path.join(
  'C:', 'Users', 'HP', '.gemini', 'antigravity-ide', 'brain',
  '4ea5c8b3-e00a-4912-8485-3b9e7ed0824b',
  '.system_generated', 'logs', 'transcript_full.jsonl'
);

const content = fs.readFileSync(transcriptPath, 'utf-8');
const lines = content.trim().split('\n');

for (let i = lines.length - 1; i >= 0; i--) {
  try {
    const parsed = JSON.parse(lines[i]);
    if (parsed.type === 'USER_INPUT' && parsed.content.includes('Copilot Logo Halftone')) {
      console.log('Found user input at line', i);
      const text = parsed.content;
      const svgStart = text.indexOf('<svg');
      const svgEnd = text.lastIndexOf('</svg>') + 6;
      let svg = text.substring(svgStart, svgEnd);

      // Analyze circle bounds
      const circleRegex = /<circle\s+cx="([\d.-]+)"\s+cy="([\d.-]+)"\s+r="([\d.-]+)"/g;
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      let count = 0;
      let match;
      while ((match = circleRegex.exec(svg)) !== null) {
        const cx = parseFloat(match[1]);
        const cy = parseFloat(match[2]);
        const r = parseFloat(match[3]);
        minX = Math.min(minX, cx - r);
        maxX = Math.max(maxX, cx + r);
        minY = Math.min(minY, cy - r);
        maxY = Math.max(maxY, cy + r);
        count++;
      }

      console.log('Circles count:', count);
      console.log('Bounds:', { minX, maxX, minY, maxY });

      const midX = (minX + maxX) / 2;
      const midY = (minY + maxY) / 2;
      const maxDim = Math.max(maxX - minX, maxY - minY);
      const paddingFactor = 0.15; // 15% standard padding
      const size = maxDim * (1 + paddingFactor);
      const vbX = Math.round(midX - size / 2);
      const vbY = Math.round(midY - size / 2);
      const vbSize = Math.round(size);

      const newViewBox = `${vbX} ${vbY} ${vbSize} ${vbSize}`;
      console.log('Normalized viewBox:', newViewBox);

      svg = svg.replace(/viewBox="[^"]*"/, `viewBox="${newViewBox}"`);

      const outPath = path.join(__dirname, '..', 'src', 'assets', 'logos', 'logo-dotted-7.svg');
      fs.writeFileSync(outPath, svg, 'utf-8');
      console.log('Saved to', outPath);
      break;
    }
  } catch (e) {
    // continue
  }
}
