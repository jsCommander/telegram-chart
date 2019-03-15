import { IRect, IChartData, IChart } from "./interfaces";
import { BaseChart } from "./BaseChart";
import { config } from "./config"

type onChangeCallback = (beginOffset: number, endOffset: number) => void

export class ControlChart extends BaseChart {
  private isDragBegin = false;
  private charts?: IChart[];
  private chartImage?: ImageData;
  private beginOffset = 50;
  private selectionPoints = config.selectionMinPoints;
  private endOffset = this.beginOffset + this.selectionPoints;
  private selectionOffsetX = 0;
  private moveType?: "start" | "end" | "all";
  private callback?: onChangeCallback;
  private selection?: IRect;

  constructor(canvas: HTMLCanvasElement, private chartData: IChartData, view?: IRect) {
    super(canvas, view);
    this.ctx.canvas.addEventListener("mousedown", e => {
      if (!this.selection) return;

      if (this.isPointInRect(this.selection, e.offsetX, e.offsetY, config.selectionOffsetX)) {
        this.isDragBegin = true;
        // clicked at start
        if ((this.selection.x - config.selectionOffsetX < e.offsetX) && (e.offsetX < this.selection.x + config.selectionOffsetX)) {
          this.moveType = "start";
          //clicked at end
        } else if ((this.selection.width + this.selection.x - config.selectionOffsetX < e.offsetX) && (e.offsetX < this.selection.width + this.selection.x + config.selectionOffsetX)) {
          this.moveType = "end";
        } else {
          this.moveType = "all";
        }
        this.selectionOffsetX = this.selection.x - e.offsetX;
      }
    })
    this.ctx.canvas.addEventListener("mouseup", e => {
      if (this.isDragBegin) {
        this.isDragBegin = false;
      }
    })
    let lastTime = Date.now()
    this.ctx.canvas.addEventListener("mousemove", e => {
      if (this.isDragBegin) {
        const dateNow = Date.now()
        if (dateNow - lastTime > 100) {
          lastTime = dateNow;
          this.drawOverlayAnimation(e.offsetX)
        }

      }
    })
  }

  public draw() {
    this.clearCtx(this.ctx)
    const pointsCount = this.chartData.columns[0].length;
    console.log(pointsCount);
    const axisXpixelStep = this.getAxisXpixelStep(pointsCount);

    // find max value in Y arrays. We will use it for scaling
    const maxYValue = this.findMaxValue(this.chartData.columns, 1, pointsCount)

    // find cords for axis X
    const axisXcords = this.getXcords(axisXpixelStep, pointsCount)
    const axisYscale = (this.viewRect.height - this.viewRect.y) / maxYValue;

    // parse and transform input data to IChart
    this.charts = this.transformDataToIChart(this.chartData, axisXcords, axisYscale, 1, pointsCount);

    this.drawCharts(this.charts);
    this.chartImage = this.ctx.getImageData(this.viewRect.x, this.viewRect.y, this.viewRect.width, this.viewRect.height)

    const startX = this.charts[0].points.x[this.beginOffset];
    const endX = this.charts[0].points.x[this.endOffset];

    this.selection = {
      x: startX,
      y: this.viewRect.y,
      width: endX - startX,
      height: this.viewRect.height
    }
    this.ctx.save()
    this.ctx.lineWidth = config.selectionOffsetX;
    this.ctx.strokeStyle = "#ddeaf3aa";
    this.ctx.fillStyle = "#f5f9fbaa";
    this.ctx.fillRect(this.viewRect.x, this.viewRect.y, this.viewRect.x + this.selection.x, this.viewRect.height)
    this.ctx.fillRect(this.selection.x + this.selection.width, this.viewRect.y, this.viewRect.width, this.viewRect.height)

    this.strokeRect(this.ctx, this.selection)
    if (this.callback) {
      this.callback(this.beginOffset, this.endOffset);
    }
    this.ctx.restore()
  }
  public setOnChangeCallback(callback: onChangeCallback) {
    this.callback = callback;
  }

  private drawOverlayAnimation(mouseX: number) {
    if (!this.chartImage || !this.charts) return;

    this.clearCtx(this.ctx);
    this.ctx.putImageData(this.chartImage, this.viewRect.x, this.viewRect.y)

    const firstChart = this.charts[0];

    if (this.moveType !== "end") {
      mouseX += this.selectionOffsetX;
      mouseX = Math.min(mouseX, this.viewRect.width - this.selection.width)
    } else {
      mouseX = Math.min(mouseX, this.viewRect.width)
    }

    mouseX = Math.max(mouseX, this.viewRect.x)

    //find closest
    let closestPointIndex = 0;
    for (let i = 0; i < firstChart.points.x.length; i++) {
      if (Math.abs(firstChart.points.x[i] - mouseX) < Math.abs(firstChart.points.x[closestPointIndex] - mouseX)) {
        closestPointIndex = i;
      }
    }

    if (this.moveType === "start") {
      this.beginOffset = this.endOffset - closestPointIndex > config.selectionMinPoints ? closestPointIndex : this.endOffset - config.selectionMinPoints;
      this.selectionPoints = this.endOffset - this.beginOffset;
    } else if (this.moveType === "end") {
      this.endOffset = closestPointIndex - this.beginOffset > config.selectionMinPoints ? closestPointIndex : this.beginOffset + config.selectionMinPoints;
      this.selectionPoints = this.endOffset - this.beginOffset;
    } else {
      this.beginOffset = closestPointIndex;
      this.endOffset = this.beginOffset + this.selectionPoints;
    }

    const startX = this.charts[0].points.x[this.beginOffset];
    const endX = this.charts[0].points.x[this.endOffset];

    this.selection = {
      x: startX,
      y: this.viewRect.y,
      width: endX - startX,
      height: this.viewRect.height
    }

    // draw before selection 
    this.ctx.save()
    this.ctx.lineWidth = config.selectionOffsetX;
    this.ctx.strokeStyle = "#ddeaf3aa";
    this.ctx.fillStyle = "#f5f9fbaa";
    this.ctx.fillRect(this.viewRect.x, this.viewRect.y, this.viewRect.x + this.selection.x, this.viewRect.height)
    this.ctx.fillRect(this.selection.x + this.selection.width, this.viewRect.y, this.viewRect.width, this.viewRect.height)

    this.strokeRect(this.ctx, this.selection)
    if (this.callback) {
      this.callback(this.beginOffset, this.endOffset);
    }
    this.ctx.restore()
  }
}