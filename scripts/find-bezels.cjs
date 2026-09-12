const fs = require('fs');
const svg = fs.readFileSync('src/assets/monitor-halftone-frame.svg', 'utf8');
const circles = [];
const re = /<circle[^>]*cx="([^"]+)"[^>]*cy="([^"]+)"[^>]*r="([^"]+)"[^>]*fill="([^"]+)"/g;
let m;
while ((m = re.exec(svg)) !== null) {
  circles.push({ cx: parseFloat(m[1]), cy: parseFloat(m[2]), r: parseFloat(m[3]), fill: m[4] });
}

// Group circles by cy
const byY = new Map();
circles.forEach(c => {
  const y = Math.round(c.cy * 10) / 10;
  if (!byY.has(y)) byY.set(y, []);
  byY.get(y).push(c);
});

const sortedYs = [...byY.keys()].sort((a,b) => a - b);
sortedYs.filter(y => y >= 30 && y <= 440).forEach(y => {
  const row = byY.get(y).sort((a,b) => a.cx - b.cx);
  // find largest gap
  let maxGap = 0;
  let gapLeft = null;
  let gapRight = null;
  for (let i = 0; i < row.length - 1; i++) {
    const gap = row[i+1].cx - row[i].cx;
    if (gap > maxGap && row[i].cx < 500 && row[i+1].cx > 500) {
      maxGap = gap;
      gapLeft = row[i].cx;
      gapRight = row[i+1].cx;
    }
  }
  if (maxGap > 100) {
    console.log(`y=${y.toFixed(1).padStart(5)} | left=${gapLeft.toFixed(1).padStart(5)} | right=${gapRight.toFixed(1).padStart(5)} | width=${(gapRight - gapLeft).toFixed(1)}`);
  }
});
