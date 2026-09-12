const fs = require('fs');

const svg = fs.readFileSync('src/assets/monitor-halftone-frame.svg', 'utf8');
const circles = [];
const re = /<circle[^>]*cx="([^"]+)"[^>]*cy="([^"]+)"[^>]*r="([^"]+)"/g;
let m;
while ((m = re.exec(svg)) !== null) {
  circles.push({ cx: parseFloat(m[1]), cy: parseFloat(m[2]), r: parseFloat(m[3]) });
}

console.log('Total dots:', circles.length);

// ViewBox of monitor-halftone-frame.svg:
const vbMatch = svg.match(/viewBox="([^"]+)"/);
console.log('viewBox:', vbMatch ? vbMatch[1] : 'none');

// Find the screen boundary dots. The screen is the dark/empty opening in the center.
// In the monitor:
// Top bezel dots:
const topBezel = circles.filter(c => c.cx >= 200 && c.cx <= 780 && c.cy >= 20 && c.cy <= 140);
topBezel.sort((a,b) => a.cx - b.cx);

// Bottom bezel dots:
const bottomBezel = circles.filter(c => c.cx >= 180 && c.cx <= 780 && c.cy >= 340 && c.cy <= 450);
bottomBezel.sort((a,b) => a.cx - b.cx);

// Left bezel dots:
const leftBezel = circles.filter(c => c.cx >= 170 && c.cx <= 260 && c.cy >= 100 && c.cy <= 440);
leftBezel.sort((a,b) => a.cy - b.cy);

// Right bezel dots:
const rightBezel = circles.filter(c => c.cx >= 710 && c.cx <= 780 && c.cy >= 20 && c.cy <= 380);
rightBezel.sort((a,b) => a.cy - b.cy);

console.log('\n--- TOP BEZEL SLOPE ---');
const topStart = topBezel.slice(0, 5);
const topEnd = topBezel.slice(-5);
console.log('Top Left dots:', topStart);
console.log('Top Right dots:', topEnd);
const topSlope = (topEnd[0].cy - topStart[0].cy) / (topEnd[0].cx - topStart[0].cx);
console.log('Top Edge Angle (degrees):', Math.atan(topSlope) * 180 / Math.PI);

console.log('\n--- BOTTOM BEZEL SLOPE ---');
const bottomStart = bottomBezel.slice(0, 5);
const bottomEnd = bottomBezel.slice(-5);
console.log('Bottom Left dots:', bottomStart);
console.log('Bottom Right dots:', bottomEnd);
const bottomSlope = (bottomEnd[0].cy - bottomStart[0].cy) / (bottomEnd[0].cx - bottomStart[0].cx);
console.log('Bottom Edge Angle (degrees):', Math.atan(bottomSlope) * 180 / Math.PI);

console.log('\n--- LEFT BEZEL SLOPE ---');
const leftTop = leftBezel.slice(0, 5);
const leftBottom = leftBezel.slice(-5);
console.log('Left Top dots:', leftTop);
console.log('Left Bottom dots:', leftBottom);
const leftSlope = (leftBottom[0].cx - leftTop[0].cx) / (leftBottom[0].cy - leftTop[0].cy);
console.log('Left Edge Angle from vertical (degrees):', Math.atan(leftSlope) * 180 / Math.PI);

console.log('\n--- RIGHT BEZEL SLOPE ---');
const rightTop = rightBezel.slice(0, 5);
const rightBottom = rightBezel.slice(-5);
console.log('Right Top dots:', rightTop);
console.log('Right Bottom dots:', rightBottom);
const rightSlope = (rightBottom[0].cx - rightTop[0].cx) / (rightBottom[0].cy - rightTop[0].cy);
console.log('Right Edge Angle from vertical (degrees):', Math.atan(rightSlope) * 180 / Math.PI);
