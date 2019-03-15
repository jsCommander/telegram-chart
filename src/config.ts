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


const config: IConfig = {
  legendXfont: "12px serif",
  legendYfont: "12px serif",
  gridHorizontalLineCount: 6,
  gridLineWidth: 2,
  chartLineWidth: 3,
  chartPointRadius: 5,
  selectionMinPoints: 10,
  selectionOffsetX: 10,
  themes: {
    white: {
      gridLineColor: "#f2f4f5",
      legendFontColor: "#96a2aa",
      helperLineColor: "#dfe6eb",
      backgroundColor: "#ffffff"
    },
    dark: {
      gridLineColor: "#f2f4f5",
      legendFontColor: "#96a2aa",
      helperLineColor: "#dfe6eb",
      backgroundColor: "#ffffff"
    }
  }
}
export { config }