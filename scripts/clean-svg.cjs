const fs = require('fs');
let content = fs.readFileSync('temp_user_svg.txt', 'utf8');

// Find the last complete circle
const lastCompleteCircle = content.lastIndexOf('/>');
if (lastCompleteCircle !== -1) {
  let cleanSvg = content.slice(0, lastCompleteCircle + 2);
  cleanSvg += '\n</svg>';
  fs.writeFileSync('src/assets/test-desc.svg', cleanSvg);
  console.log('Saved cleanSvg to src/assets/test-desc.svg, length:', cleanSvg.length);
}
