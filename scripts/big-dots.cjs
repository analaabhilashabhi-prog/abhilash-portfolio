// Script to increase dot size in the original SVG without removing any dots
const fs = require('fs');
const path = require('path');

const svgPath = path.join(__dirname, '..', 'src', 'assets', 'logos', 'logo-dotted-1.svg');
const svgContent = fs.readFileSync(svgPath, 'utf-8');

// Replace all circle radii with bigger ones (multiply by 1.6)
const newSvg = svgContent.replace(
  /r="([\d.]+)"/g,
  (match, r) => {
    const newR = (parseFloat(r) * 1.6).toFixed(2);
    return `r="${newR}"`;
  }
);

const outputPath = path.join(__dirname, '..', 'src', 'assets', 'logos', 'logo-dotted-1-big.svg');
fs.writeFileSync(outputPath, newSvg, 'utf-8');
console.log('Done! Dot size increased by 1.6x');
