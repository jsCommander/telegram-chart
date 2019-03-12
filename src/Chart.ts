export interface IChartData {
  columns: any[][];
  types: { [id: string]: "line" | "x" };
  names: { [id: string]: string };
  colors: { [id: string]: string };
}

interface IChart {
  name: string;
  values: number[];
  type: "line" | "x";
  color: string;
}

interface IRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

const config = {
  canvas: {
    width: 600,
    height: 600
  },
  supportLine: {
    count: 6,
    color: "#a7a7a7",
    font: "serif",
    fontSize: 0.25
  }
}

export class Chart {
  private ctx: CanvasRenderingContext2D;
  private maxChartValue: number = 0;
  private charts: IChart[] = [];
  private axisXvalues?: number[]

  constructor(canvas: HTMLCanvasElement, data: IChartData) {
    canvas.width = config.canvas.width;
    canvas.height = config.canvas.height;
    const ctx = canvas.getContext("2d")
    if (!ctx) {
      throw new Error("Can't create canvas 2d context");
    }
    this.ctx = ctx;
    data.columns.forEach(x => {
      if (x[0] === "x") {
        this.axisXvalues = x.slice(1)
      } else {
        const name = x[0];
        this.charts.push({
          name: data.names[name],
          values: x.slice(1),
          color: data.colors[name],
          type: data.types[name]
        })
      }
    })
    this.maxChartValue = this.findMaxValueInArrays(this.charts.map(x => x.values))
  }

  public draw(beginOffset: number = 0, endOffset: number = this.charts[0].values.length) {
    const subCharts = this.charts.map(x => {
      const subChart = { ...x, values: x.values.slice(beginOffset, endOffset) };
      return subChart;
    })

    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
    const view: IRect = {
      x: 5,
      y: 5,
      width: this.ctx.canvas.width - 5,
      height: this.ctx.canvas.height - Math.floor(this.ctx.canvas.height * 0.3)
    }

    let maxYvalue = this.findMaxValueInArrays(subCharts.map(x => x.values))
    this.drawSupportLines(maxYvalue, view)
    this.drawCharts(subCharts, maxYvalue, view);

    const control: IRect = {
      x: 5,
      y: Math.floor(this.ctx.canvas.height * (1 - 0.3)),
      width: this.ctx.canvas.width - 5,
      height: this.ctx.canvas.height
    }
    this.drawCharts(this.charts, this.maxChartValue, control);
    console.log(this.axisXvalues)
  }

  drawSupportLines(maxYvalue: number, view?: IRect) {
    const viewRect = view ? view : {
      x: 0,
      y: 0,
      width: this.ctx.canvas.width,
      height: this.ctx.canvas.height
    }

    const supportLineHeightStep = Math.floor(viewRect.height / config.supportLine.count);
    const supportLineValueStep = Math.round(maxYvalue / config.supportLine.count);
    const legendFontSize = Math.floor((Math.min(viewRect.width - viewRect.x, viewRect.height - viewRect.y) / config.supportLine.count * config.supportLine.fontSize));

    this.ctx.save();

    this.ctx.strokeStyle = config.supportLine.color;
    this.ctx.fillStyle = config.supportLine.color;
    this.ctx.lineWidth = 1;
    this.ctx.font = `${legendFontSize}px ${config.supportLine.font}`;

    for (let i = 0; i < config.supportLine.count; i++) {
      const height = viewRect.height - (supportLineHeightStep * i)
      const value = supportLineValueStep * i
      this.ctx.beginPath()
      this.ctx.moveTo(viewRect.x, height);
      this.ctx.lineTo(viewRect.width, height);
      this.ctx.stroke()

      this.ctx.fillText(value.toString(), viewRect.x, height - 5);
    }
    this.ctx.restore()
  }

  drawCharts(charts: IChart[], maxYValue: number, view?: IRect) {
    const viewRect = view ? view : {
      x: 0,
      y: 0,
      width: this.ctx.canvas.width,
      height: this.ctx.canvas.height
    }

    const pointCount = charts[0].values.length;

    const axisXstep = Math.ceil(viewRect.width / pointCount);
    const axisYscale = (viewRect.height - viewRect.y) / maxYValue;

    this.ctx.save();
    this.ctx.lineWidth = 3;

    charts.forEach(chart => {
      this.ctx.strokeStyle = chart.color;
      this.ctx.fillStyle = chart.color;
      this.ctx.beginPath();
      this.ctx.moveTo(viewRect.x, Math.round(viewRect.height - chart.values[0] * axisYscale));

      chart.values.forEach((value, i) => {
        this.ctx.lineTo(Math.round(i * axisXstep), Math.round(viewRect.height - axisYscale * value as number))
        this.ctx.fillText(value.toString(), Math.round(i * axisXstep) + 5, Math.round(viewRect.height - value * axisYscale) + 15);
      })
      this.ctx.stroke()
    })
    this.ctx.restore()
  }

  private findMaxValueInArrays(arrays: number[][]): number {
    const maxValue = arrays.reduce((max, valuesArray) => max = Math.max(max, ...valuesArray), 0)
    return maxValue;
  }
}