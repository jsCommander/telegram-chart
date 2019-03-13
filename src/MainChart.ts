import { IRect, IChartData, IChart } from "./interfaces";
import { BaseChart } from "./BaseChart";
import config from "./config"

export class MainChart extends BaseChart {
  private overlayCtx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement, private chartData: IChartData, view?: IRect) {
    super(canvas, view);
    this.overlayCtx = this.createCanvasOverlay("overlay").getContext("2d");
  }

  public draw(beginOffset: number = 0, endOffset: number = 10) {
    this.clearCtx(this.ctx)
    this.clearCtx(this.overlayCtx)
    // incremant to skip first element of array with name
    beginOffset++;
    endOffset = endOffset + 1 < this.chartData.columns[0].length ? endOffset + 1 : this.chartData.columns[0].length;
    const pointsCount = endOffset - beginOffset;
    const axisXpixelStep = this.getAxisXpixelStep(pointsCount);

    // find max value in Y arrays. We will use it for scaling
    const maxYValue = this.findMaxValue(this.chartData.columns, beginOffset, endOffset)
    // find cords for axis X
    const axisXcords = this.getXcords(axisXpixelStep, pointsCount)

    this.drawHorizontalGrid(maxYValue);
    //this.drawVerticalGrid(axisXcords);

    const axisYscale = (this.viewRect.height - this.viewRect.y) / maxYValue;

    // parse and transform input data to IChart
    const charts = this.transformDataToIChart(this.chartData, axisXcords, axisYscale, beginOffset, endOffset);

    this.drawCharts(charts);
    this.overlayCtx.canvas.addEventListener("mousemove", e => {
      this.drawOverlayAnimation(charts, e.offsetX)
    })
  }

  private drawOverlayAnimation(charts: IChart[], mouseX: number) {
    this.clearCtx(this.overlayCtx)

    const firstChart = charts[0];

    //find closest
    let closestPointIndex = 0;
    for (let i = 0; i < firstChart.points.x.length; i++) {
      if (Math.abs(firstChart.points.x[i] - mouseX) < Math.abs(firstChart.points.x[closestPointIndex] - mouseX)) {
        closestPointIndex = i;
      }
    }

    // draw support line
    this.overlayCtx.save();
    this.overlayCtx.lineWidth = 3;
    this.overlayCtx.beginPath()
    this.overlayCtx.moveTo(firstChart.points.x[closestPointIndex], this.viewRect.y)
    this.overlayCtx.lineTo(firstChart.points.x[closestPointIndex], this.viewRect.height);
    this.overlayCtx.stroke()
    this.overlayCtx.restore();

    // draw cricles
    charts.forEach(chart => {
      this.overlayCtx.save();
      this.overlayCtx.lineWidth = 2;
      this.overlayCtx.strokeStyle = chart.color;
      this.overlayCtx.fillStyle = "white";
      this.overlayCtx.moveTo(chart.points.x[closestPointIndex], chart.points.y[closestPointIndex])
      this.overlayCtx.beginPath()
      this.overlayCtx.arc(chart.points.x[closestPointIndex], chart.points.y[closestPointIndex], 5, 0, Math.PI * 2, true);
      this.overlayCtx.fill()
      this.overlayCtx.stroke()
      this.overlayCtx.restore();
    })

    // draw helper
    const middle = Math.round((this.viewRect.width - this.viewRect.x) / 2)
    const square = 30
      ;
    this.overlayCtx.save();
    this.overlayCtx.strokeStyle = config.supportLine.color;
    this.overlayCtx.fillStyle = "white";
    this.overlayCtx.strokeRect(middle - square, this.viewRect.y + square, square * 2, square * 2)
    this.overlayCtx.fillRect(middle - square, this.viewRect.y + square, square * 2, square * 2)
    this.overlayCtx.restore();
    charts.forEach((chart, i) => {
      this.overlayCtx.save();
      this.overlayCtx.fillStyle = chart.color;
      this.overlayCtx.fillText(`${chart.points.values[closestPointIndex]}`, middle - square + 20 * i + 10, this.viewRect.y + square * 2);
      this.overlayCtx.fillText(`${chart.name}`, middle - square + 20 * i + 10, this.viewRect.y + square * 2 + 20);
      this.overlayCtx.restore();
    })
  }
}