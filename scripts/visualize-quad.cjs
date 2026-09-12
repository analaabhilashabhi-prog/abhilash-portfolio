const fs = require('fs');

const svg = fs.readFileSync('src/assets/monitor-halftone-frame.svg', 'utf8');

// Current quad:
// P0: (230.69, 110.55)
// P1: (737.76, 36.71)
// P2: (722.40, 353.78)
// P3: (190.27, 428.47)

const quadPath = `
<polygon points="230.69,110.55 737.76,36.71 722.40,353.78 190.27,428.47" fill="rgba(0, 255, 128, 0.2)" stroke="#00ff88" stroke-width="2" />
`;

// Insert the quadPath right before </svg>
const newSvg = svg.replace('</svg>', quadPath + '</svg>');
fs.writeFileSync('scripts/monitor-quad-check.svg', newSvg);
console.log('Saved scripts/monitor-quad-check.svg');
