const fs = require('fs');
const content = fs.readFileSync('temp_user_svg.txt', 'utf8');

const regex = /cx="([\d\.]+)"\s+cy="([\d\.]+)"\s+r="([\d\.]+)"/g;
let m;
const dots = [];
while ((m = regex.exec(content)) !== null) {
  dots.push({ x: parseFloat(m[1]), y: parseFloat(m[2]), r: parseFloat(m[3]) });
}

// In production:
// cy=208: 201.6, 208, 214.4, 220.8, 227.2, 233.6, 240, 246.4, 259.2, 265.6, 272, 278.4, 284.8, 291.2, 297.6
// In solutions:
// Let's find the matching sequence in cy=208!
const cy208 = dots.filter(d => Math.abs(d.y - 208) < 0.1 && d.x >= 700).map(d => d.x);
console.log('cy=208 in solutions:', cy208);

// Compare:
// 707.2 - 201.6 = 505.6
// Let's test 201.6 + 576?
// Let's test differences:
const prod_tion = [201.6, 208, 214.4, 220.8, 227.2, 233.6, 240, 246.4, 259.2, 265.6, 272, 278.4, 284.8, 291.2, 297.6];
for (let offset = 400; offset <= 650; offset += 6.4) {
  const matches = prod_tion.filter(x => cy208.includes(Math.round((x + offset) * 10) / 10));
  if (matches.length > 8) {
    console.log(`Found offset: ${offset.toFixed(1)}, matches: ${matches.length} / ${prod_tion.length}`);
  }
}
