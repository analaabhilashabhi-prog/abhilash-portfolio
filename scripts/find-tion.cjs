const fs = require('fs');
const content = fs.readFileSync('temp_user_svg.txt', 'utf8');

// In Line 3: "analytics, to Snowflake and Azure for scalable cloud infrastructure."
// In Line 4: "These are the technologies I rely on daily to deliver"
// In Line 5: "... data solutions."
// Where is "solutions" in the original text?
// "deliver production-ready data solutions."
// Does "tion" appear in "production"? YES! "production" is in line 5!
// "production" is right before "ready data solutions"!
// In line 5: "production" has "t", "i", "o", "n"!
// Let's find the dots for "tion" in "production"!

const regex = /cx="([\d\.]+)"\s+cy="([\d\.]+)"\s+r="([\d\.]+)"/g;
let m;
const dots = [];
while ((m = regex.exec(content)) !== null) {
  dots.push({ x: parseFloat(m[1]), y: parseFloat(m[2]), r: parseFloat(m[3]) });
}

// In line 5, where is "production"?
// Line 5 starts at x ~ 86.4
// "p": 86.4
// Let's check the letters of "production-ready" in line 5!
const b5 = dots.filter(d => d.y >= 200);
console.log('Line 5 dots from 86 to 400:');
const cy208_start = b5.filter(d => Math.abs(d.y - 208) < 0.1 && d.x <= 400);
console.log('cy=208 x values:', cy208_start.map(d=>d.x));
