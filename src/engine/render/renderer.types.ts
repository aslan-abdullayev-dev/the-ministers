export interface Color {
  r: number;
  g: number;
  b: number;
  a?: number;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Renderer {
  resize(width: number, height: number): void;
  clear(color: Color): void;
  fillRect(rect: Rect, color: Color): void;
  drawImage(image: ImageBitmap | HTMLCanvasElement, dx: number, dy: number, dw: number, dh: number): void;
  drawCircle(x: number, y: number, radius: number, color: Color): void;
  drawText(text: string, x: number, y: number, size: number, color: Color): void;
  drawPolygon(points: { x: number; y: number }[], color: Color): void;
}