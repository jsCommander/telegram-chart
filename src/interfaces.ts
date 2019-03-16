export interface IConfig {
  legendXfont: string;
  legendYfont: string;
  gridHorizontalLineCount: number;
  gridLineWidth: number;
  chartLineWidth: number,
  chartPointRadius: number,
  selectionMinPoints: number;
  selectionOffsetX: number;
  themes: {
    [name: string]: {
      gridLineColor: string;
      legendFontColor: string;
      helperLineColor: string;
      backgroundColor: string;
    }
  }
}

export interface InputData {
  columns: any[][];
  types: { [id: string]: "line" | "x" };
  names: { [id: string]: string };
  colors: { [id: string]: string };
}

export interface IChart { cordsX: number[], lines: IChartLine[], scaleY: number, offset: number, stepX: number }
export interface IChartLine { id: string, path: Path2D }
export interface IGrid { stepY: number, path: Path2D }

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