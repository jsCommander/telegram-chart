export interface IConfig {
  margin: number,
  controlViewHeigth: number;
  legendViewHeigth: number;
  helperBoxHeight: number;
  helperBoxFont: string;
  gridLineCount: number;
  gridLineWidth: number;
  mainChartLineWidth: number,
  controlChartLineWidth: number,
  chartPointRadius: number;
  selectionMinPoints: number;
  selectionDefaultPoints: number;
  selectionGrabWidth: number;
  legendFont: string;
  defaultTheme: "white" | "dark";
}

export interface IThemes {
  [name: string]: {
    gridLineColor: string;
    legendFontColor: string;
    helperLineColor: string;
    backgroundColor: string;
  }
}

const config: IConfig = {
  margin: 0,
  // elements sizes in percent (0.15 = 15%)
  controlViewHeigth: 0.2,
  legendViewHeigth: 0.05,

  // helper box size in percent (0.15 = 15%)
  helperBoxHeight: 0.25,
  // helper box fonts
  helperBoxFont: "serif",
  // axis legend font
  legendFont: "serif",

  // grid 
  gridLineCount: 6,

  // line sizing
  gridLineWidth: 2,
  mainChartLineWidth: 2,
  controlChartLineWidth: 1,
  // helper line points
  chartPointRadius: 3,

  // selection
  selectionMinPoints: 0.1,
  selectionDefaultPoints: 0.33,
  selectionGrabWidth: 15,
  defaultTheme: "white",
}

export interface ITheme {
  gridLineColor: string;
  legendFontColor: string;
  helperLineColor: string;
  backgroundColor: string;
  selectionBoxColor: string;
  unselectedColor: string;
}

const themes: { [name: string]: ITheme } = {
  white: {
    gridLineColor: "#f2f4f5",
    legendFontColor: "#96a2aa",
    helperLineColor: "#dfe6eb",
    backgroundColor: "#ffffff",
    selectionBoxColor: "#068dda44",
    unselectedColor: "#f5f9fbdd",
  },
  dark: {
    gridLineColor: "#f2f4f5",
    legendFontColor: "#96a2aa",
    helperLineColor: "#dfe6eb",
    backgroundColor: "#ffffff",
    selectionBoxColor: "#f5f9fbaa",
    unselectedColor: "#068dda44"
  }
}

export { config, themes }