import type { Color, Rect, Renderer } from './renderer.types';

export class Canvas2DRenderer implements Renderer {
  private ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext('2d')!;
  }

  resize(width: number, height: number): void {
    this.ctx.canvas.width = width;
    this.ctx.canvas.height = height;
  }

  clear(color: Color): void {
    const { r, g, b, a = 1 } = color;
    this.ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  fillRect(rect: Rect, color: Color): void {
    const { r, g, b, a = 1 } = color;
    this.ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
    this.ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
  }

  drawImage(image: ImageBitmap | HTMLCanvasElement, dx: number, dy: number, dw: number, dh: number): void {
    this.ctx.drawImage(image, dx, dy, dw, dh);
  }

  drawCircle(x: number, y: number, radius: number, color: Color): void {
    const { r, g, b, a = 1 } = color;
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
    this.ctx.fill();
  }

  drawText(text: string, x: number, y: number, size: number, color: Color): void {
    const { r, g, b, a = 1 } = color;
    this.ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
    this.ctx.font = `bold ${size}px sans-serif`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(text, x, y);
  }

  drawPolygon(points: { x: number; y: number }[], color: Color): void {
    if (points.length < 3) return;
    const { r, g, b, a = 1 } = color;
    this.ctx.beginPath();
    this.ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) this.ctx.lineTo(points[i].x, points[i].y);
    this.ctx.closePath();
    this.ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
    this.ctx.fill();
  }
}