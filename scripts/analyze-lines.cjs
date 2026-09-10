const fs = require('fs');
const content = fs.readFileSync('temp_user_svg.txt', 'utf8');

const regex = /cx="([\d\.]+)"\s+cy="([\d\.]+)"\s+r="([\d\.]+)"/g;
let m;
const dots = [];

while ((m = regex.exec(content)) !== null) {
  const x = parseFloat(m[1]), y = parseFloat(m[2]), r = parseFloat(m[3]);
  dots.push({ x, y, r });
}

console.log('Line 1: 35.2 - 60.8');
console.log('Line 2: 73.6 - 99.2');
console.log('Line 3: 118.4 - 144.0');
console.log('Line 4: 156.8 - 182.4');
console.log('Line 5: 201.6 - 214.4 (truncated)');
