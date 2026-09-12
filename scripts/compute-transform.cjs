// Compute 2D-to-3D projective transformation (homography) to CSS matrix3d
// Target Quad in stage coordinate space (960 x 532):
// P0 (top-left):     24.03%, 20.78% -> (0.2403 * 960, 0.2078 * 532)
// P1 (top-right):    75.07%,  7.40% -> (0.7507 * 960, 0.0740 * 532)
// P2 (bottom-right): 73.12%, 67.04% -> (0.7312 * 960, 0.6704 * 532)
// P3 (bottom-left):  19.82%, 80.54% -> (0.1982 * 960, 0.8054 * 532)

const STAGE_W = 960;
const STAGE_H = 532;

// Let the video element have width W and height H, say 800 x 500 (or 16:9 like 1920x1080 or 960x540)
// Or let the video element be placed at top:0, left:0, with width: W, height: H
// and transform-origin: 0 0 0.
const dst = [
  { x: 0.2403 * STAGE_W, y: 0.2078 * STAGE_H }, // Top-Left
  { x: 0.7507 * STAGE_W, y: 0.0740 * STAGE_H }, // Top-Right
  { x: 0.7312 * STAGE_W, y: 0.6704 * STAGE_H }, // Bottom-Right
  { x: 0.1982 * STAGE_W, y: 0.8054 * STAGE_H }  // Bottom-Left
];

console.log('Destination points:', dst);

// Let's test with video size W = 800, H = 500 (16:10 or 16:9)
// If source is unit square [0,1] x [0,1]:
function solveHomography(src, dst) {
  // 8 linear equations for h00, h01, h02, h10, h11, h12, h20, h21, with h22 = 1
  // x_i = (h00*u_i + h01*v_i + h02) / (h20*u_i + h21*v_i + 1)
  // => h00*u_i + h01*v_i + h02 - x_i*h20*u_i - x_i*h21*v_i = x_i
  // y_i = (h10*u_i + h11*v_i + h12) / (h20*u_i + h21*v_i + 1)
  // => h10*u_i + h11*v_i + h12 - y_i*h20*u_i - y_i*h21*v_i = y_i

  const A = [];
  const B = [];
  for (let i = 0; i < 4; i++) {
    const u = src[i].x;
    const v = src[i].y;
    const x = dst[i].x;
    const y = dst[i].y;

    A.push([u, v, 1, 0, 0, 0, -x * u, -x * v]);
    B.push(x);
    A.push([0, 0, 0, u, v, 1, -y * u, -y * v]);
    B.push(y);
  }

  // Solve A * H = B using Gaussian elimination
  const n = 8;
  for (let i = 0; i < n; i++) {
    // Pivot
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(A[k][i]) > Math.abs(A[maxRow][i])) {
        maxRow = k;
      }
    }
    const tempA = A[i]; A[i] = A[maxRow]; A[maxRow] = tempA;
    const tempB = B[i]; B[i] = B[maxRow]; B[maxRow] = tempB;

    const div = A[i][i];
    for (let j = i; j < n; j++) A[i][j] /= div;
    B[i] /= div;

    for (let k = 0; k < n; k++) {
      if (k !== i) {
        const factor = A[k][i];
        for (let j = i; j < n; j++) A[k][j] -= factor * A[i][j];
        B[k] -= factor * B[i];
      }
    }
  }

  return [...B, 1]; // [h00, h01, h02, h10, h11, h12, h20, h21, h22]
}

// If src has dimensions W and H:
const W = 1000;
const H = 625; // 16:10 ratio like MacBook screens
const src = [
  { x: 0, y: 0 },
  { x: W, y: 0 },
  { x: W, y: H },
  { x: 0, y: H }
];

const H_mat = solveHomography(src, dst);
console.log('Homography matrix 3x3:', H_mat);

// Check accuracy
for (let i = 0; i < 4; i++) {
  const u = src[i].x;
  const v = src[i].y;
  const w = H_mat[6] * u + H_mat[7] * v + H_mat[8];
  const x = (H_mat[0] * u + H_mat[1] * v + H_mat[2]) / w;
  const y = (H_mat[3] * u + H_mat[4] * v + H_mat[5]) / w;
  console.log(`Point ${i}: expected (${dst[i].x.toFixed(2)}, ${dst[i].y.toFixed(2)}), got (${x.toFixed(2)}, ${y.toFixed(2)})`);
}

// In CSS, transform: matrix3d(m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44)
// Maps (x, y, z, 1) ->
// column 1: [h00, h10, 0, h20]
// column 2: [h01, h11, 0, h21]
// column 3: [0,   0,   1, 0  ]
// column 4: [h02, h12, 0, h22]
const matrix3d = [
  H_mat[0], H_mat[3], 0, H_mat[6],
  H_mat[1], H_mat[4], 0, H_mat[7],
  0,        0,        1, 0,
  H_mat[2], H_mat[5], 0, H_mat[8]
];

console.log('\nCSS matrix3d string:');
console.log(`matrix3d(${matrix3d.map(v => v.toFixed(9)).join(', ')})`);
