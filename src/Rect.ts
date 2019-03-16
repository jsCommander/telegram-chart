export class Rect {
  constructor(public x: number, public y: number, public width: number, public height: number) { }
  public getEndX(): number {
    return this.x + this.width
  }
  public getEndY(): number {
    return this.y + this.height
  }

  public isPointInRect(x: number, y: number): boolean {
    return (this.x < x) && (x < this.getEndX()) && (this.y < y) && (y < this.getEndY())
  }
}