const fs = require('fs');

const STAGE_W = 960;
const STAGE_H = 532;

function solveHomography(src, dst) {
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

  const n = 8;
  for (let i = 0; i < n; i++) {
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(A[k][i]) > Math.abs(A[maxRow][i])) maxRow = k;
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

  return [...B, 1];
}

const W = 1000;
const H = 625;
const src = [
  { x: 0, y: 0 },
  { x: W, y: 0 },
  { x: W, y: H },
  { x: 0, y: H }
];

function testQuad(name, p0, p1, p2, p3) {
  const dst = [
    { x: p0[0] * STAGE_W, y: p0[1] * STAGE_H },
    { x: p1[0] * STAGE_W, y: p1[1] * STAGE_H },
    { x: p2[0] * STAGE_W, y: p2[1] * STAGE_H },
    { x: p3[0] * STAGE_W, y: p3[1] * STAGE_H }
  ];

  const H_mat = solveHomography(src, dst);
  const m3d = [
    H_mat[0], H_mat[3], 0, H_mat[6],
    H_mat[1], H_mat[4], 0, H_mat[7],
    0,        0,        1, 0,
    H_mat[2], H_mat[5], 0, H_mat[8]
  ];

  const topAngle = Math.atan((dst[1].y - dst[0].y) / (dst[1].x - dst[0].x)) * 180 / Math.PI;
  const bottomAngle = Math.atan((dst[2].y - dst[3].y) / (dst[2].x - dst[3].x)) * 180 / Math.PI;

  console.log(`\n--- ${name} ---`);
  console.log(`Top Angle: ${topAngle.toFixed(2)}°, Bottom Angle: ${bottomAngle.toFixed(2)}°`);
  console.log(`clip-path: polygon(${(p0[0]*100).toFixed(2)}% ${(p0[1]*100).toFixed(2)}%, ${(p1[0]*100).toFixed(2)}% ${(p1[1]*100).toFixed(2)}%, ${(p2[0]*100).toFixed(2)}% ${(p2[1]*100).toFixed(2)}%, ${(p3[0]*100).toFixed(2)}% ${(p3[1]*100).toFixed(2)}%)`);
  console.log(`matrix3d(${m3d.map(v => v.toFixed(9)).join(', ')})`);
}

testQuad('Enhanced Tilt (~11.2°)', [0.2370, 0.2280], [0.7730, 0.0380], [0.7550, 0.6280], [0.1940, 0.8220]);
