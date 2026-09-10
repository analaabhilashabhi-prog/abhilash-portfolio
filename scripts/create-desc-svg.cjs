const fs = require('fs');
const content = fs.readFileSync('temp_user_svg.txt', 'utf8');

// Strip metadata
let cleanSvg = content.replace(/<metadata>[\s\S]*?<\/metadata>/, '');

// Find last complete circle tag
const lastCircle = cleanSvg.lastIndexOf('/>');
cleanSvg = cleanSvg.slice(0, lastCircle + 2);

// Check what the last circle was
const lastCircleStr = cleanSvg.slice(cleanSvg.lastIndexOf('<circle'));
console.log('Last circle in raw:', lastCircleStr);

// Close SVG
cleanSvg += '\n</svg>';

fs.writeFileSync('src/assets/logos/text-toolstack-desc.svg', cleanSvg);
console.log('Created src/assets/logos/text-toolstack-desc.svg, size:', cleanSvg.length);
