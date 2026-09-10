const fs = require('fs');
const content = fs.readFileSync('src/assets/logos/text-toolstack-desc.svg', 'utf8');

// Let's find the missing dots for cy=214.4 after x=662.4
// In line 5:
// "t" at x=668.8 - 681.6:
// In line 5, at cy=208 we have:
// x=668.8 (r=2.32), x=675.2 (r=1.32), x=681.6 (r=2.26), x=688.0 (r=2.42), x=694.4 (r=1.23)
// At cy=214.4:
// t has dots at 668.8 (r=1.63 - this was in the file right before truncation!),
// 675.2 (r=2.25), 681.6 (r=2.35), 688.0 (r=1.55)

// "i" at x=707.2 - 713.6:
// cy=208: x=707.2 (r=2.54), x=713.6 (r=1.62)
// cy=214.4: x=707.2 (r=2.25), x=713.6 (r=2.40)

// "o" at x=720.0 - 732.8:
// cy=208: x=720.0 (r=2.31), x=726.4 (r=2.12)
// cy=214.4: x=720.0 (r=2.30), x=726.4 (r=2.25), x=732.8 (r=1.65)

// "n" at x=745.6 - 758.4:
// cy=208: x=745.6 (r=2.09), x=752.0 (r=2.13), x=758.4 (r=1.30)
// cy=214.4: x=745.6 (r=2.35), x=752.0 (r=2.15), x=758.4 (r=1.75)

// "s" at x=764.8 - 777.6:
// cy=208: x=764.8 (r=2.22), x=771.2 (r=2.22), x=777.6 (r=1.89)
// cy=214.4: x=764.8 (r=1.85), x=771.2 (r=2.30), x=777.6 (r=2.15)

// "." at x=796.8:
// cy=208: x=784.0 (r=1.58), x=790.4 (r=1.86), x=796.8 (r=1.99)
// cy=214.4: x=790.4 (r=1.60), x=796.8 (r=2.10)

// What about x=800-873.6 at cy=208?
// Let's see what was at cy=208 for x=800-873.6:
// 803.2, 809.6, 816.0, 822.4, 828.8, 835.2, 841.6, 848.0, 854.4, 860.8, 867.2, 873.6
// In the original file, those dots are ALREADY present at cy=208!
// Let's check what they were:
// 803.2 (r=1.82), 809.6 (r=2.35), 816.0 (r=2.19), 822.4 (r=1.42), 828.8 (r=2.17), 835.2 (r=2.13), 841.6 (r=1.92), 848.0 (r=2.02), 854.4 (r=1.96), 860.8 (r=2.00), 867.2 (r=2.08), 873.6 (r=1.22)
// At cy=214.4, let's supply matching baseline dots so the letters have full bottoms:
const extraDots = [
  // t
  { x: 668.8, y: 214.4, r: 1.63 },
  { x: 675.2, y: 214.4, r: 2.25 },
  { x: 681.6, y: 214.4, r: 2.35 },
  { x: 688.0, y: 214.4, r: 1.55 },
  // i
  { x: 707.2, y: 214.4, r: 2.25 },
  { x: 713.6, y: 214.4, r: 2.40 },
  // o
  { x: 720.0, y: 214.4, r: 2.30 },
  { x: 726.4, y: 214.4, r: 2.25 },
  { x: 732.8, y: 214.4, r: 1.65 },
  // n
  { x: 745.6, y: 214.4, r: 2.35 },
  { x: 752.0, y: 214.4, r: 2.15 },
  { x: 758.4, y: 214.4, r: 1.75 },
  // s
  { x: 764.8, y: 214.4, r: 1.85 },
  { x: 771.2, y: 214.4, r: 2.30 },
  { x: 777.6, y: 214.4, r: 2.15 },
  // .
  { x: 790.4, y: 214.4, r: 1.60 },
  { x: 796.8, y: 214.4, r: 2.10 },
  // remaining words in line 5
  { x: 809.6, y: 214.4, r: 2.20 },
  { x: 816.0, y: 214.4, r: 2.15 },
  { x: 822.4, y: 214.4, r: 1.50 },
  { x: 828.8, y: 214.4, r: 2.25 },
  { x: 835.2, y: 214.4, r: 2.20 },
  { x: 841.6, y: 214.4, r: 1.95 },
  { x: 848.0, y: 214.4, r: 2.10 },
  { x: 854.4, y: 214.4, r: 2.05 },
  { x: 860.8, y: 214.4, r: 2.15 },
  { x: 867.2, y: 214.4, r: 2.00 },
  { x: 873.6, y: 214.4, r: 1.30 },
];

let baseSvg = content.slice(0, content.lastIndexOf('</svg>'));
let delay = 2040;
for (const d of extraDots) {
  baseSvg += `<circle class="dot" cx="${d.x.toFixed(1)}" cy="${d.y.toFixed(1)}" r="${d.r.toFixed(2)}" fill="rgb(141,141,141)" style="animation-delay:${delay}ms"/>`;
  delay += 5;
}
baseSvg += '\n</svg>';

fs.writeFileSync('src/assets/logos/text-toolstack-desc.svg', baseSvg);
console.log('Successfully completed src/assets/logos/text-toolstack-desc.svg, size:', baseSvg.length);
