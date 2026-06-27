import { Canvas2DRenderer } from './engine/render/Canvas2DRenderer';
import { Camera } from './engine/camera/Camera';
import type { Color } from './engine/render/renderer.types';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const renderer = new Canvas2DRenderer(canvas);
const camera = new Camera();

type Point = { x: number; y: number };

const gx = [0, 256, 512, 768, 1024, 1280];
const gy = [0, 160, 320, 480];

function jaggedEdge(x1: number, y1: number, x2: number, y2: number, seed: number): Point[] {
  const steps = 20;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const amp = len * 0.07;
  const nx = -dy / len;
  const ny = dx / len;
  const pts: Point[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const offset =
      amp * 0.50 * Math.sin(t * Math.PI * (2.3 + seed * 0.41)) +
      amp * 0.35 * Math.sin(t * Math.PI * (6.1 + seed * 0.83)) +
      amp * 0.15 * Math.sin(t * Math.PI * (13.7 + seed * 1.57));
    pts.push({ x: x1 + dx * t + nx * offset, y: y1 + dy * t + ny * offset });
  }
  return pts;
}

// hSeg[r][c]: (gx[c], gy[r]) → (gx[c+1], gy[r])
const hSeg: Point[][][] = Array.from({ length: 4 }, (_, r) =>
  Array.from({ length: 5 }, (_, c) =>
    r === 0 || r === 3
      ? [{ x: gx[c], y: gy[r] }, { x: gx[c + 1], y: gy[r] }]
      : jaggedEdge(gx[c], gy[r], gx[c + 1], gy[r], r * 10 + c)
  )
);

// vSeg[r][c]: (gx[c], gy[r]) → (gx[c], gy[r+1])
const vSeg: Point[][][] = Array.from({ length: 3 }, (_, r) =>
  Array.from({ length: 6 }, (_, c) =>
    c === 0 || c === 5
      ? [{ x: gx[c], y: gy[r] }, { x: gx[c], y: gy[r + 1] }]
      : jaggedEdge(gx[c], gy[r], gx[c], gy[r + 1], 50 + r * 10 + c)
  )
);

const colors: Color[] = [
  { r: 180, g: 60,  b: 60  }, { r: 60,  g: 130, b: 180 }, { r: 80,  g: 160, b: 80  },
  { r: 180, g: 150, b: 50  }, { r: 140, g: 80,  b: 180 }, { r: 60,  g: 100, b: 140 },
  { r: 160, g: 160, b: 60  }, { r: 180, g: 60,  b: 120 }, { r: 60,  g: 140, b: 80  },
  { r: 200, g: 100, b: 60  }, { r: 100, g: 160, b: 120 }, { r: 180, g: 130, b: 60  },
  { r: 60,  g: 80,  b: 160 }, { r: 160, g: 60,  b: 80  }, { r: 80,  g: 160, b: 140 },
];

const provinces = Array.from({ length: 3 }, (_, row) =>
  Array.from({ length: 5 }, (_, col) => ({
    color: colors[row * 5 + col],
    points: [
      ...hSeg[row][col],
      ...vSeg[row][col + 1].slice(1),
      ...[...hSeg[row + 1][col]].reverse().slice(1),
      ...[...vSeg[row][col]].reverse().slice(1, -1),
    ],
  }))
).flat();

function resize() {
  renderer.resize(window.innerWidth, window.innerHeight);
}

function draw() {
  const vp = camera.getViewport();

  renderer.clear({r: 20, g: 20, b: 35});

  for (const p of provinces) {
    renderer.drawPolygon(
      p.points.map(pt => ({
        x: pt.x * vp.scale + vp.offset.x,
        y: pt.y * vp.scale + vp.offset.y,
      })),
      p.color,
    );
  }

  // spy unit on province 1
  const spy = { worldX: 120, worldY: 80 };
  const sx = spy.worldX * vp.scale + vp.offset.x;
  const sy = spy.worldY * vp.scale + vp.offset.y;
  const r = 4 * vp.scale;
  renderer.drawCircle(sx, sy, r, { r: 20, g: 20, b: 20 });
  renderer.drawCircle(sx, sy, r - 2 * vp.scale, { r: 80, g: 60, b: 120 });
  renderer.drawText('S', sx, sy, r * 1.2, { r: 255, g: 255, b: 255 });

  requestAnimationFrame(draw);
}

// pan
let dragging = false;
let lastX = 0;
let lastY = 0;

canvas.addEventListener('mousedown', e => {
  dragging = true;
  lastX = e.clientX;
  lastY = e.clientY;
});

canvas.addEventListener('mousemove', e => {
  if (!dragging) return;
  camera.pan(e.clientX - lastX, e.clientY - lastY);
  lastX = e.clientX;
  lastY = e.clientY;
});

canvas.addEventListener('mouseup', () => {
  dragging = false;
});
canvas.addEventListener('mouseleave', () => {
  dragging = false;
});

// zoom
canvas.addEventListener('wheel', e => {
  e.preventDefault();
  const factor = e.deltaY < 0 ? 1.1 : 0.9;
  camera.zoom(factor, e.clientX, e.clientY);
}, {passive: false});

window.addEventListener('resize', resize);
resize();
requestAnimationFrame(draw);
