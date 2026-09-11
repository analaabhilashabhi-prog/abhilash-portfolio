const fs = require('fs');
let content = fs.readFileSync('src/assets/logos/text-toolstack-desc.svg', 'utf8');

// In text-toolstack-desc.svg:
// 1. Brighten all colors to crisp white / near-white:
// rgb(141,141,141) -> rgb(240,240,240)
// Let's replace any rgb(X,X,X) with bright white based on brightness:
// If X is around 140-240, boost it to 220-255!
// 2. Increase radius r:
// Dots with r >= 1.4: boost radius by 1.5x (e.g. 2.2 -> 3.3, 2.5 -> 3.8)!
// When r is ~3.5 on a 6.4 grid, the dots touch and form solid, bold, crisp, glowing letters!

const regex = /<circle class="dot" cx="([\d\.]+)" cy="([\d\.]+)" r="([\d\.]+)" fill="rgb\((\d+),(\d+),(\d+)\)" style="([^"]+)"\/>/g;

let boosted = content.replace(regex, (match, cx, cy, r, red, green, blue, style) => {
  let radius = parseFloat(r);
  let gray = parseInt(red, 10);
  
  // Scale radius up:
  // If dot is part of the character (r >= 1.4), make it much fuller and bolder
  if (radius >= 1.8) {
    radius = Math.min(3.6, radius * 1.55);
    gray = Math.min(255, Math.round(gray * 1.45 + 30));
  } else if (radius >= 1.3) {
    radius = Math.min(2.8, radius * 1.4);
    gray = Math.min(240, Math.round(gray * 1.3 + 20));
  } else {
    radius = Math.min(1.8, radius * 1.2);
    gray = Math.min(200, Math.round(gray * 1.2));
  }
  
  return `<circle class="dot" cx="${cx}" cy="${cy}" r="${radius.toFixed(2)}" fill="rgb(${gray},${gray},${gray})" style="${style}"/>`;
});

fs.writeFileSync('src/assets/logos/text-toolstack-desc-boosted.svg', boosted);
console.log('Created boosted SVG, length:', boosted.length);
