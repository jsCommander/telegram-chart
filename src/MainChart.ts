import { IRect, IChartData, IChart } from "./interfaces";
import { BaseChart } from "./BaseChart";
import { config } from "./config"

export class MainChart extends BaseChart {
  private charts?: IChart[];
  private chartImage?: ImageData;

  constructor(canvas: HTMLCanvasElement, private chartData: IChartData, view?: IRect) {
    super(canvas, view);
    this.ctx.canvas.addEventListener("mousemove", e => {
      this.drawOverlayAnimation(e.offsetX)
    })
    this.ctx.canvas.addEventListener("touchmove", e => {
      e.preventDefault();
      this.drawOverlayAnimation(e.touches[0].clientX - this.ctx.canvas.offsetLeft)
    })
  }

  public draw(beginOffset: number = 0, endOffset: number = 10) {
    this.clearCtx(this.ctx)
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
    this.charts = this.transformDataToIChart(this.chartData, axisXcords, axisYscale, beginOffset, endOffset);

    this.drawCharts(this.charts);

    this.chartImage = this.ctx.getImageData(this.viewRect.x, this.viewRect.y, this.viewRect.width, this.viewRect.height)
  }

  private drawOverlayAnimation(mouseX: number) {
    if (!this.chartImage || !this.charts) return;

    this.clearCtx(this.ctx);
    this.ctx.putImageData(this.chartImage, this.viewRect.x, this.viewRect.y)

    const firstChart = this.charts[0];

    //find closest
    let closestPointIndex = 0;
    for (let i = 0; i < firstChart.points.x.length; i++) {
      if (Math.abs(firstChart.points.x[i] - mouseX) < Math.abs(firstChart.points.x[closestPointIndex] - mouseX)) {
        closestPointIndex = i;
      }
    }

    // draw support line
    this.ctx.save();
    this.ctx.lineWidth = config.gridLineWidth;
    this.ctx.strokeStyle = config.themes[this.theme].gridLineColor;
    this.ctx.beginPath()
    this.ctx.moveTo(firstChart.points.x[closestPointIndex], this.viewRect.y)
    this.ctx.lineTo(firstChart.points.x[closestPointIndex], this.viewRect.height);
    this.ctx.stroke()
    this.ctx.restore();

    // draw cricles
    this.charts.forEach(chart => {
      this.ctx.save();
      this.ctx.lineWidth = config.chartLineWidth;
      this.ctx.strokeStyle = chart.color;
      this.ctx.fillStyle = config.themes[this.theme].backgroundColor;
      this.ctx.moveTo(chart.points.x[closestPointIndex], chart.points.y[closestPointIndex])
      this.ctx.beginPath()
      this.ctx.arc(chart.points.x[closestPointIndex], chart.points.y[closestPointIndex], config.chartPointRadius, 0, Math.PI * 2, true);
      this.ctx.fill()
      this.ctx.stroke()
      this.ctx.restore();
    })

    // draw helper
    const middle = Math.round((this.viewRect.width - this.viewRect.x) / 2)
    const square = 30;

    this.ctx.save();
    this.ctx.strokeStyle = config.themes[this.theme].gridLineColor;
    this.ctx.fillStyle = config.themes[this.theme].backgroundColor;
    this.ctx.strokeRect(middle - square, this.viewRect.y + square, square * 2, square * 2)
    this.ctx.fillRect(middle - square, this.viewRect.y + square, square * 2, square * 2)
    this.ctx.restore();
    this.charts.forEach((chart, i) => {
      this.ctx.save();
      this.ctx.fillStyle = chart.color;
      this.ctx.fillText(`${chart.points.values[closestPointIndex]}`, middle - square + 20 * i + 10, this.viewRect.y + square * 2);
      this.ctx.fillText(`${chart.name}`, middle - square + 20 * i + 10, this.viewRect.y + square * 2 + 20);
      this.ctx.restore();
    })
  }
}