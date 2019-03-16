import { Rect, InputData, IChart, IConfig } from "./interfaces";
import { BaseChart } from "./BaseChart";

type onChangeCallback = (beginOffset: number, endOffset: number) => void

export class ControlChart extends BaseChart {
  private isDragBegin = false;
  private chart?: IChart;
  private beginOffset = 50;
  private selectionPoints: number;
  private endOffset = 0;
  private selectionOffsetX = 0;
  private moveType?: "start" | "end" | "all";
  private callback?: onChangeCallback;
  private selection?: Rect;

  constructor(canvas: HTMLCanvasElement, chartData: InputData, config?: IConfig) {
    super(canvas, chartData, config);

    this.ctx.canvas.addEventListener("mousedown", e => {
      if (!this.selection) return;

      if (this.selection.isPointInRect(e.offsetX, e.offsetY)) {
        this.isDragBegin = true;
        // clicked at start
        if ((this.selection.x - this.config.selectionOffsetX < e.offsetX) && (e.offsetX < this.selection.x + this.config.selectionOffsetX)) {
          this.moveType = "start";
          //clicked at end
        } else if ((this.selection.width + this.selection.x - this.config.selectionOffsetX < e.offsetX) && (e.offsetX < this.selection.width + this.selection.x + this.config.selectionOffsetX)) {
          this.moveType = "end";
        } else {
          this.moveType = "all";
        }
        this.selectionOffsetX = this.selection.x - e.offsetX;
      }
    })
    this.ctx.canvas.addEventListener("mouseup", e => {
      if (this.isDragBegin) {
        this.drawOverlayAnimation(e.offsetX)
        this.isDragBegin = false;
      }
    })
    this.ctx.canvas.addEventListener("mousemove", e => {
      if (this.isDragBegin) {
        this.drawOverlayAnimation(e.offsetX)
      }
    })
    this.ctx.canvas.addEventListener("mouseout", e => {
      if (this.isDragBegin) {
        this.isDragBegin = false;
      }
    })
  }

  public draw() {
    this.clearRect(this.viewPort)
    const pointsCount = this.chartData.columns[0].length;

    this.chart = this.getChartLines(0, pointsCount);

    this.chart.lines.forEach(line => {
      this.drawLine(line.path, this.config.chartLineWidth, this.chartData.colors[line.id]);
    });

    this.endOffset = this.beginOffset + Math.round(pointsCount * this.config.selectionMinPoints);
    this.selectionPoints = this.endOffset - this.beginOffset;

    const startX = this.chart.cordsX[this.beginOffset];
    const endX = this.chart.cordsX[this.endOffset];

    this.selection = new Rect(startX, this.viewPort.y, endX - startX, this.viewPort.height)

    this.drawSelection(this.selection)
  }

  private drawSelection(selection: Rect) {
    this.ctx.save()

    this.ctx.fillStyle = "#f5f9fbaa";
    this.ctx.fillRect(this.viewPort.x, this.viewPort.y, selection.x, this.viewPort.height)
    this.ctx.fillRect(selection.getEndX(), this.viewPort.y, this.viewPort.width, this.viewPort.height)


    this.ctx.strokeStyle = "#068dda44";
    const edgeWidth = this.config.selectionOffsetX
    this.ctx.lineWidth = Math.ceil(edgeWidth / 4);
    this.ctx.beginPath();
    // top line
    this.ctx.moveTo(selection.x + edgeWidth, selection.y)
    this.ctx.lineTo(selection.getEndX() - edgeWidth, selection.y)
    // bottom line
    this.ctx.moveTo(selection.x + edgeWidth, selection.height)
    this.ctx.lineTo(selection.getEndX() - edgeWidth, selection.height)
    this.ctx.stroke()

    this.ctx.lineWidth = edgeWidth
    // left line
    this.ctx.beginPath();
    this.ctx.moveTo(selection.x + edgeWidth / 2, selection.y)
    this.ctx.lineTo(selection.x + edgeWidth / 2, selection.height)
    // right line 
    this.ctx.moveTo(selection.getEndX() - edgeWidth / 2, selection.y)
    this.ctx.lineTo(selection.getEndX() - edgeWidth / 2, selection.height)

    this.ctx.stroke()
    this.ctx.restore()
  }

  public setOnChangeCallback(callback: onChangeCallback) {
    this.callback = callback;
  }

  private drawOverlayAnimation(mouseX: number) {
    if (!this.chart || !this.selection) return;

    this.clearRect(this.viewPort);
    this.chart.lines.forEach(line => {
      this.drawLine(line.path, this.config.chartLineWidth, this.chartData.colors[line.id]);
    });

    if (this.moveType !== "end") {
      mouseX += this.selectionOffsetX;
      mouseX = Math.min(mouseX, this.viewPort.width - this.selection.width)
    } else {
      mouseX = Math.min(mouseX, this.viewPort.width)
    }

    mouseX = Math.max(mouseX, this.viewPort.x)

    const closestIndex = this.findIndexOfClosestValueInSortedArray(mouseX, this.chart.cordsX);
    const closestX = this.chart.cordsX[closestIndex];

    if (this.moveType === "start") {
      this.beginOffset = this.endOffset - closestIndex > closestX ? closestIndex : this.endOffset - closestX;
      this.selectionPoints = this.endOffset - this.beginOffset;
    } else if (this.moveType === "end") {
      this.endOffset = closestIndex - this.beginOffset > closestX ? closestIndex : this.beginOffset + closestX;
      this.selectionPoints = this.endOffset - this.beginOffset;
    } else {
      this.beginOffset = closestIndex;
      this.endOffset = this.beginOffset + this.selectionPoints;
    }

    const startX = this.chart.cordsX[this.beginOffset];
    const endX = this.chart.cordsX[this.endOffset];

    this.selection = new Rect(startX, this.viewPort.y, endX - startX, this.viewPort.height)
    this.drawSelection(this.selection)

    if (this.callback) {
      this.callback(this.beginOffset, this.endOffset);
    }
  }
}