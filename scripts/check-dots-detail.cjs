const fs = require('fs');
const content = fs.readFileSync('temp_user_svg.txt', 'utf8');

const regex = /cx="([\d\.]+)"\s+cy="([\d\.]+)"\s+r="([\d\.]+)"/g;
let m;
const dots = [];

while ((m = regex.exec(content)) !== null) {
  const x = parseFloat(m[1]), y = parseFloat(m[2]), r = parseFloat(m[3]);
  dots.push({ x, y, r });
}

// Check dots at cy=208 for x between 600 and 870
const cy208 = dots.filter(d => Math.abs(d.y - 208) < 0.1 && d.x >= 600 && d.r > 1.4);
console.log('cy=208 dots count:', cy208.length, 'x range:', Math.min(...cy208.map(d=>d.x)), Math.max(...cy208.map(d=>d.x)));

// And cy=214.4
const cy214 = dots.filter(d => Math.abs(d.y - 214.4) < 0.1 && d.x >= 600 && d.r > 1.4);
console.log('cy=214.4 dots count:', cy214.length, 'x range:', Math.min(...cy214.map(d=>d.x)), Math.max(...cy214.map(d=>d.x)));

// And check if there are ANY dots at cy > 215 in the entire file
const cyAbove215 = dots.filter(d => d.y > 215);
console.log('cy > 215 dots count:', cyAbove215.length);
