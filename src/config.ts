export interface IConfig {
  margin: number,
  controlViewHeigth: number;
  legendViewHeigth: number;
  helperBoxHeight: number;
  helperBoxMaxWidth: number;
  helperBoxHeaderFont: string;
  helperBoxValueFont: string;
  helperBoxNameFont: string;
  gridLineCount: number;
  gridLineWidth: number;
  mainChartLineWidth: number,
  controlChartLineWidth: number,
  chartPointRadius: number;
  selectionMinPoints: number;
  selectionDefaultPoints: number;
  selectionGrabWidth: number;
  legendXfont: string;
  legendYfont: string;
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
  helperBoxHeight: 0.3,
  helperBoxMaxWidth: 0.3,
  // helper box fonts
  helperBoxHeaderFont: "12px serif",
  helperBoxValueFont: "12px serif",
  helperBoxNameFont: "12px serif",
  // axis legend
  legendXfont: "12px serif",
  legendYfont: "12px serif",

  // grid 
  gridLineCount: 6,

  // line sizing
  gridLineWidth: 2,
  mainChartLineWidth: 3,
  controlChartLineWidth: 2,
  // helper line points
  chartPointRadius: 5,

  // selection
  selectionMinPoints: 0.1,
  selectionDefaultPoints: 0.33,
  selectionGrabWidth: 10,
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