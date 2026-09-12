const fs = require('fs');
const readline = require('readline');

const fileStream = fs.createReadStream('C:/Users/HP/.gemini/antigravity-ide/brain/4ea5c8b3-e00a-4912-8485-3b9e7ed0824b/.system_generated/logs/transcript_full.jsonl');
const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

let lastUserInput = null;
rl.on('line', (line) => {
  if (line.includes('"type":"USER_INPUT"')) {
    lastUserInput = line;
  }
});

rl.on('close', () => {
  if (lastUserInput) {
    try {
      const data = JSON.parse(lastUserInput);
      let content = '';
      if (typeof data.content === 'string') {
        content = data.content;
      } else if (Array.isArray(data.content)) {
        content = data.content.map(c => c.text || '').join('\n');
      }
      const svgMatch = content.match(/<svg[\s\S]*?<\/svg>/i);
      if (svgMatch) {
        fs.writeFileSync('src/assets/monitor-halftone-frame.svg', svgMatch[0]);
        console.log('Successfully saved src/assets/monitor-halftone-frame.svg. Size:', svgMatch[0].length);
      } else {
        console.log('No SVG match found. Content snippet:', content.substring(0, 300));
      }
    } catch (e) {
      console.error('Error parsing JSON:', e);
    }
  } else {
    console.log('No USER_INPUT found');
  }
});
