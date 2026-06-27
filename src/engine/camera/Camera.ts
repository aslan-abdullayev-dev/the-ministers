import type { Vec2, Viewport } from './types';

export class Camera {
  private viewport: Viewport = { offset: { x: 0, y: 0 }, scale: 1 };

  pan(dx: number, dy: number): void {
    this.viewport.offset.x += dx;
    this.viewport.offset.y += dy;
  }

  zoom(factor: number, originX: number, originY: number): void {
    const newScale = this.viewport.scale * factor;
    this.viewport.offset.x = originX - (originX - this.viewport.offset.x) * (newScale / this.viewport.scale);
    this.viewport.offset.y = originY - (originY - this.viewport.offset.y) * (newScale / this.viewport.scale);
    this.viewport.scale = newScale;
  }

  screenToWorld(screenX: number, screenY: number): Vec2 {
    return {
      x: (screenX - this.viewport.offset.x) / this.viewport.scale,
      y: (screenY - this.viewport.offset.y) / this.viewport.scale,
    };
  }

  worldToScreen(worldX: number, worldY: number): Vec2 {
    return {
      x: worldX * this.viewport.scale + this.viewport.offset.x,
      y: worldY * this.viewport.scale + this.viewport.offset.y,
    };
  }

  getViewport(): Readonly<Viewport> {
    return this.viewport;
  }
}
