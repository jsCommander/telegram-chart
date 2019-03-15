import { IRect, IChartData, IChart } from "./interfaces";
import { config } from "./config"

export abstract class BaseChart {
  protected ctx: CanvasRenderingContext2D;
  protected viewRect: IRect;
  protected theme: string = "white"
  constructor(canvas: HTMLCanvasElement, view?: IRect) {
    this.ctx = canvas.getContext("2d");

    this.viewRect = view ? view : {
      x: 0,
      y: 0,
      width: canvas.width,
      height: canvas.height
    }
  }

  protected drawHorizontalGrid(maxYvalue: number) {
    const axisYpixelStep = this.viewRect.height / config.gridHorizontalLineCount;
    const axisYvalueStep = Math.round(maxYvalue / config.gridHorizontalLineCount);

    this.ctx.save();
    this.ctx.strokeStyle = config.themes[this.theme].gridLineColor;
    this.ctx.fillStyle = config.themes[this.theme].legendFontColor;
    this.ctx.lineWidth = config.gridLineWidth;
    this.ctx.font = config.legendYfont;

    // draw horizontal lines
    for (let i = 0; i < config.gridHorizontalLineCount; i++) {
      const height = this.viewRect.height - (axisYpixelStep * i)
      const value = axisYvalueStep * i
      this.ctx.beginPath()
      this.ctx.moveTo(this.viewRect.x, height);
      this.ctx.lineTo(this.viewRect.width, height);
      this.ctx.stroke()

      this.ctx.fillText(value.toString(), this.viewRect.x, height - 5);
    }
    this.ctx.restore()
  }

  protected drawVerticalGrid(axisXcords: number[]) {
    this.ctx.save();
    this.ctx.strokeStyle = config.themes[this.theme].gridLineColor;
    this.ctx.fillStyle = config.themes[this.theme].gridLineColor;
    this.ctx.lineWidth = config.gridLineWidth;

    // draw vertical lines
    axisXcords.forEach(x => {
      this.ctx.beginPath();
      this.ctx.moveTo(x, this.viewRect.y);
      this.ctx.lineTo(x, this.viewRect.height);
      this.ctx.stroke();
    })

    this.ctx.restore()
  }

  protected getAxisXpixelStep(pointsCount: number): number {
    return (this.viewRect.width - this.viewRect.x) / (pointsCount - 1);
  }

  protected transformDataToIChart(data: IChartData, axisXcords: number[], axisYscale: number, beginOffset: number, endOffset: number): IChart[] {
    let charts: IChart[] = [];
    data.columns.forEach(x => {
      if (x[0] !== "x") {
        const name = x[0];
        const values = x.slice(beginOffset, endOffset);

        charts.push({
          name: data.names[name],
          color: data.colors[name],
          points: {
            x: axisXcords,
            y: values.map(x => this.viewRect.height - x * axisYscale),
            values
          }
        })
      }
    });
    return charts;
  }

  protected drawCharts(charts: IChart[], drawValues = false) {
    charts.forEach(chart => {
      this.ctx.save();
      this.ctx.lineWidth = config.chartLineWidth;
      this.ctx.strokeStyle = chart.color;
      this.ctx.fillStyle = chart.color;
      this.ctx.beginPath();
      this.ctx.moveTo(chart.points.x[0], chart.points.y[0]);

      let lastValue = chart.points.y[0];

      chart.points.y.forEach((y, i) => {
        this.ctx.lineTo(chart.points.x[i], y)

        if (drawValues) {
          const offset = y > lastValue ? 10 : -10
          this.ctx.fillText(chart.points.values[i].toString(), chart.points.x[i] + offset, y + offset);
        }
      })
      this.ctx.stroke();
      this.ctx.restore();
    })
  }

  protected getXcords(axisXpixelStep: number, pointCount: number): number[] {
    // find cords for axis X
    let axisXcords: number[] = [];
    for (let i = 0; i < pointCount; i++) {
      axisXcords.push((i * axisXpixelStep) + this.viewRect.x)
    }
    return axisXcords;
  }

  protected findMaxValue(chartValuesArrays: any[][], beginOffset: number, endOffset: number): number {
    let maxYValue = 0;
    for (let i = beginOffset; i < endOffset; i++) {
      chartValuesArrays.forEach(x => {
        if (x[0] !== "x" && x[i] > maxYValue) {
          maxYValue = x[i];
        }
      })
    }
    return maxYValue;
  }

  protected isPointInRect(rect: IRect, x: number, y: number, offsetX = 0, offsetY = 0): boolean {
    return (rect.x - offsetX < x && x < rect.x + rect.width + offsetX) && (rect.y - offsetY < y && y < rect.y + rect.height + offsetY)
  }

  protected strokeRect(ctx: CanvasRenderingContext2D, rect: IRect) {
    ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
  }

  protected clearCtx(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  }
}