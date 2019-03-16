import { IConfig } from "./interfaces";


const config: IConfig = {
  legendXfont: "12px serif",
  legendYfont: "12px serif",
  gridHorizontalLineCount: 6,
  gridLineWidth: 2,
  chartLineWidth: 3,
  chartPointRadius: 5,
  selectionMinPoints: 0.1,
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