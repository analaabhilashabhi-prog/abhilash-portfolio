const fs = require('fs');
const content = fs.readFileSync('temp_user_svg.txt', 'utf8');

// Let's check what dots we have in the truncated SVG and see if we can close it properly
// The SVG starts with <svg ...>
// Ends at style="animation-delay:2036ms"/><circle class="dot" cx="668.8" cy="214.4" r="1.63" fill="rgb(141,141,141)" style...
// Let's see the last valid circle tag:
const lastValidCircleIdx = content.lastIndexOf('</circle>');
const lastCircleIdx = content.lastIndexOf('<circle');
console.log('lastCircleIdx:', lastCircleIdx);
console.log('Text around last circle:', content.slice(lastCircleIdx - 100, lastCircleIdx + 200));
