export interface InputData {
  columns: any[][];
  types: { [id: string]: "line" | "x" };
  names: { [id: string]: string };
  colors: { [id: string]: string };
}

export interface IChart { cordsX: number[], lines: IChartLine[], scaleY: number, offset: number, stepX: number }
export interface IChartLine { id: string, path: Path2D }
export interface IGrid { stepY: number, path: Path2D }

