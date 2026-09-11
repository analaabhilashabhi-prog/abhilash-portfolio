const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const bundlePath = 'C:/Users/HP/.gemini/antigravity-ide/brain/4ea5c8b3-e00a-4912-8485-3b9e7ed0824b/.system_generated/steps/1426/content.md';
const content = fs.readFileSync(bundlePath, 'utf8');
const jsonStart = content.indexOf('{');
const jsonStr = content.slice(jsonStart);
const data = JSON.parse(jsonStr);

console.log(`Processing ${data.files.length} files from bundle...`);

let allMatched = true;

data.files.forEach((file) => {
  const targetPath = path.resolve(__dirname, '..', file.path);
  const dir = path.dirname(targetPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const fileContent = file.code;
  const hash = crypto.createHash('sha256').update(fileContent, 'utf8').digest('hex');
  const expectedHash = file.sha256;

  if (hash !== expectedHash) {
    console.error(`Hash mismatch for ${file.path}: expected ${expectedHash}, got ${hash}`);
    allMatched = false;
  } else {
    console.log(`✓ ${file.path} verified (sha256: ${hash})`);
  }

  fs.writeFileSync(targetPath, fileContent, 'utf8');
});

if (allMatched) {
  console.log('All 16 files successfully extracted and verified against their SHA-256 hashes!');
} else {
  console.warn('Some hashes did not match. Please verify.');
}
