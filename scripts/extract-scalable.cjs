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
    if (parsed.type === 'USER_INPUT' && parsed.content.includes('SCALABLE Halftone')) {
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
      console.log('Bounds:', { minX, maxX, minY, maxY, width: maxX - minX, height: maxY - minY });

      // Note: for a wide banner text like "SCALABLE", viewBox is wide: e.g. 0 0 960 340 or normalized with padding
      const midX = (minX + maxX) / 2;
      const midY = (minY + maxY) / 2;
      const w = maxX - minX;
      const h = maxY - minY;
      // Add comfortable horizontal and vertical padding (e.g. 10%)
      const padX = w * 0.08;
      const padY = h * 0.25;
      const vbX = Math.round(minX - padX);
      const vbY = Math.round(minY - padY);
      const vbW = Math.round(w + padX * 2);
      const vbH = Math.round(h + padY * 2);

      const newViewBox = `${vbX} ${vbY} ${vbW} ${vbH}`;
      console.log('Normalized wide viewBox:', newViewBox);

      svg = svg.replace(/viewBox="[^"]*"/, `viewBox="${newViewBox}"`);

      const outPath = path.join(__dirname, '..', 'src', 'assets', 'logos', 'text-scalable.svg');
      fs.writeFileSync(outPath, svg, 'utf-8');
      console.log('Saved to', outPath);
      break;
    }
  } catch (e) {
    // continue
  }
}
