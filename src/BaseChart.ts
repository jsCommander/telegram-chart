import { IRect, IChartData, IChart } from "./interfaces";

const config = {
  chartCanvas: {
    width: 600,
    height: 600
  },
  controlCanvas: {
    width: 600,
    height: 300
  },
  supportLine: {
    count: 6,
    color: "#a7a7a7",
    font: "12px serif",
  }
}

export abstract class BaseChart {
  protected ctx: CanvasRenderingContext2D;
  protected viewRect: IRect;
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
    const axisYpixelStep = this.viewRect.height / config.supportLine.count;
    const axisYvalueStep = Math.round(maxYvalue / config.supportLine.count);

    this.ctx.save();
    this.ctx.strokeStyle = config.supportLine.color;
    this.ctx.fillStyle = config.supportLine.color;
    this.ctx.lineWidth = 1;
    this.ctx.font = config.supportLine.font;

    // draw horizontal lines
    for (let i = 0; i < config.supportLine.count; i++) {
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
    this.ctx.strokeStyle = config.supportLine.color;
    this.ctx.fillStyle = config.supportLine.color;
    this.ctx.lineWidth = 1;
    this.ctx.font = config.supportLine.font;

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
      this.ctx.lineWidth = 3;
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

  protected createCanvasOverlay(canvasClassName: string): HTMLCanvasElement {
    const overlay = this.ctx.canvas.cloneNode() as HTMLCanvasElement
    overlay.classList.add(canvasClassName);
    this.ctx.canvas.parentElement.appendChild(overlay);
    return overlay;
  }
  protected clearCtx(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  }
}