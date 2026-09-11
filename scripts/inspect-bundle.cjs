const fs = require('fs');
const content = fs.readFileSync('C:/Users/HP/.gemini/antigravity-ide/brain/4ea5c8b3-e00a-4912-8485-3b9e7ed0824b/.system_generated/steps/1426/content.md', 'utf8');
const jsonStart = content.indexOf('{');
const jsonStr = content.slice(jsonStart);
const data = JSON.parse(jsonStr);

const importRegex = /from\s+['"]([^'"]+)['"]/g;
const externalImports = new Set();
data.files.forEach(f => {
  if (f.code) {
    let match;
    while ((match = importRegex.exec(f.code)) !== null) {
      if (!match[1].startsWith('.')) {
        externalImports.add(match[1]);
      }
    }
  }
});
console.log('External imports:', Array.from(externalImports));
