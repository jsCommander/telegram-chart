export interface InputData {
  columns: any[][];
  types: { [id: string]: "line" | "x" };
  names: { [id: string]: string };
  colors: { [id: string]: string };
}

export interface IChart {
  cordsX: number[];
  lines: { [id: string]: Path2D };
  scaleY: number;
  offset: number;
  stepX: number;
  maxValue: number;
}

export interface IGrid { stepY: number, path: Path2D }
