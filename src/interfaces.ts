export interface IChartData {
  columns: any[][];
  types: { [id: string]: "line" | "x" };
  names: { [id: string]: string };
  colors: { [id: string]: string };
}

export interface IRect extends IPoint {
  width: number;
  height: number;
}

interface IPoint {
  x: number,
  y: number
}

export interface IChartPoints {
  x: number[];
  y: number[];
  values: number[];
  legend?: string;
}

export interface IChart {
  name: string;
  color: string;
  points: IChartPoints;
}