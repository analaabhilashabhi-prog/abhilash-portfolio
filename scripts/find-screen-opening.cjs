const fs = require('fs');

const svg = fs.readFileSync('src/assets/monitor-halftone-frame.svg', 'utf8');
const circles = [];
const re = /<circle[^>]*cx="([^"]+)"[^>]*cy="([^"]+)"[^>]*r="([^"]+)"/g;
let m;
while ((m = re.exec(svg)) !== null) {
  circles.push({ cx: parseFloat(m[1]), cy: parseFloat(m[2]), r: parseFloat(m[3]) });
}

// In the monitor:
// The screen is an empty cutout where there are NO dots.
// Let's find the inner boundary of the dots that surround the screen.

// Let's divide x from 180 to 760 into vertical slices of 20px
console.log('X slice | Min Y (top bezel bottom) | Max Y (bottom bezel top)');
for (let x = 200; x <= 760; x += 30) {
  const inSlice = circles.filter(c => Math.abs(c.cx - x) <= 15);
  // dots above center (cy < 250)
  const topDots = inSlice.filter(c => c.cy < 250);
  // dots below center (cy > 250)
  const bottomDots = inSlice.filter(c => c.cy > 250);

  const topInnerY = topDots.length > 0 ? Math.max(...topDots.map(c => c.cy)) : null;
  const bottomInnerY = bottomDots.length > 0 ? Math.min(...bottomDots.map(c => c.cy)) : null;

  console.log(`${x.toString().padStart(4)} | ${topInnerY !== null ? topInnerY.toFixed(1).padStart(7) : '    ---'} | ${bottomInnerY !== null ? bottomInnerY.toFixed(1).padStart(7) : '    ---'}`);
}
