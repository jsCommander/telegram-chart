import { config, themes, IConfig, ITheme } from "./config"
import { Rect } from "./Rect"

export interface InputData {
  columns: any[][];
  types: { [id: string]: "line" | "x" };
  names: { [id: string]: string };
  colors: { [id: string]: string };
}

interface IChart {
  cordsX: number[];
  lines: IChartLine[];
  scaleY: number;
  offset: number;
  stepX: number;
  maxValue: number;
}
interface IChartLine { id: string, path: Path2D }
interface IGrid { stepY: number, path: Path2D }

export class Chart {
  // for calculation
  private config: IConfig;
  private disabledLines: string[] = ["x"];
  private totalPoints: number;

  // for drawing
  private ctx: CanvasRenderingContext2D;
  // view ports
  private mainChartView: Rect;
  private controlChartView: Rect;
  private legendView: Rect;
  private theme: ITheme;

  // saved charts
  private mainChart?: IChart;
  private controlChart: IChart;

  private grid: IGrid;

  // selection box
  private selectionBox: Rect;
  private beginRect: Rect;
  private endRect: Rect;
  private beginOffset: number;
  private endOffset: number;
  private selectionMinPoints: number;

  // helper box
  private helperBox: Rect;

  // events
  private isDragInProgress = false;
  private dragType: "begin" | "end" | "all";
  private grabOffset;
  private lastSupportLineX = 0;

  constructor(canvas: HTMLCanvasElement, private chartData: InputData, userConfig?: any) {
    this.config = Object.assign({}, config, userConfig) as IConfig;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Can't get canvas context 2d");
    }
    this.ctx = ctx;
    this.theme = themes[this.config.defaultTheme];

    // calculate element sizes
    const margin = this.config.margin;
    const width = this.ctx.canvas.width - margin * 2;
    const height = this.ctx.canvas.height - margin * 2;

    const controlViewHeight = Math.round(height * this.config.controlViewHeigth);
    this.controlChartView = new Rect(margin, height - controlViewHeight + margin, width, controlViewHeight)
    const legendViewHeight = Math.round(height * this.config.legendViewHeigth)
    this.legendView = new Rect(margin, this.controlChartView.y - legendViewHeight, width, legendViewHeight)
    this.mainChartView = new Rect(margin, margin, width, this.legendView.y - margin)

    //this.strokeRect(this.mainChartView);
    //this.strokeRect(this.controlChartView);
    //this.strokeRect(this.legendView);

    // calculate control chart
    this.totalPoints = this.chartData.columns[0].length;
    this.controlChart = this.getChartLines(0, this.totalPoints, this.controlChartView);

    // calculate default selection
    const selectionTotal = Math.round(this.totalPoints * this.config.selectionDefaultPoints);
    this.selectionMinPoints = Math.round(this.totalPoints * this.config.selectionMinPoints);
    this.beginOffset = selectionTotal;
    this.endOffset = this.beginOffset + selectionTotal;


    this.drawControlChart(this.controlChart)

    // calculate main chart
    this.grid = this.getGrid(this.mainChartView);
    this.mainChart = this.getChartLines(this.beginOffset, this.endOffset, this.mainChartView);

    // calculate helper box size

    const helperBoxWidth = this.ctx.measureText(this.controlChart.maxValue.toString()).width * (this.chartData.columns.length - 2)
    this.helperBox = new Rect(30, 30, helperBoxWidth, 30)

    this.drawMainChart(this.mainChart, this.grid)


    // set event handlers
    this.ctx.canvas.addEventListener("mousemove", e => this.mousemoveHandler(e.offsetX, e.offsetY));
    this.ctx.canvas.addEventListener("touchmove", e => this.mousemoveHandler(e.touches[0].clientX - this.ctx.canvas.offsetLeft, e.touches[0].clientY - this.ctx.canvas.offsetTop))

    this.ctx.canvas.addEventListener("mousedown", e => {
      if (!this.selectionBox) return;

      if (this.selectionBox.isPointInRect(e.offsetX, e.offsetY)) {
        this.isDragInProgress = true;
        // clicked at start
        if (this.beginRect.isPointInRect(e.offsetX, e.offsetY)) {
          this.dragType = "begin";
          //clicked at end
        } else if (this.endRect.isPointInRect(e.offsetX, e.offsetY)) {
          this.dragType = "end";
        } else {
          this.dragType = "all";
        }
        this.grabOffset = this.selectionBox.x - e.offsetX;
      }
    })
    this.ctx.canvas.addEventListener("mouseup", e => {
      if (this.isDragInProgress) {
        this.isDragInProgress = false;
      }
    })
    this.ctx.canvas.addEventListener("mouseout", e => {
      if (this.isDragInProgress) {
        this.isDragInProgress = false;
      }
    })
  }

  // handle events

  private mousemoveHandler(mouseX: number, mouseY: number) {
    // no data - no events
    if (!this.mainChart || !this.controlChart) return;

    // if still dragin selector or moving at control chart
    if (this.isDragInProgress) {
      this.clearRect(this.controlChartView);
      this.clearRect(this.mainChartView);



      if (this.dragType !== "end") {
        mouseX += this.grabOffset;
        mouseX = Math.min(mouseX, this.controlChartView.width - this.selectionBox.width)
      } else {
        mouseX = Math.min(mouseX, this.controlChartView.width)
      }

      mouseX = Math.max(mouseX, this.controlChartView.x)

      const closestIndex = this.findIndexOfClosestValueInSortedArray(mouseX, this.controlChart.cordsX);


      if (this.dragType === "begin") {
        this.beginOffset = this.endOffset - closestIndex > this.selectionMinPoints ? closestIndex : this.endOffset - this.selectionMinPoints;
      } else if (this.dragType === "end") {
        this.endOffset = closestIndex - this.beginOffset > this.selectionMinPoints ? closestIndex : this.beginOffset + this.selectionMinPoints;
      } else {
        const pointsCount = this.endOffset - this.beginOffset;
        this.beginOffset = closestIndex;
        this.endOffset = this.beginOffset + pointsCount;
      }

      const startX = this.controlChart.cordsX[this.beginOffset];
      const endX = this.controlChart.cordsX[this.endOffset];

      this.selectionBox = new Rect(startX, this.controlChartView.y, endX - startX, this.controlChartView.height)
      this.drawControlChart(this.controlChart);
      this.mainChart = this.getChartLines(this.beginOffset, this.endOffset, this.mainChartView)

      this.drawMainChart(this.mainChart, this.grid)

    } else if (this.mainChartView.isPointInRect(mouseX, mouseY)) {
      // moving at main chart
      // no drawing if we still near last drawing point
      if ((Math.abs(this.lastSupportLineX - mouseX) < this.mainChart.stepX / 2)) return;
      // clear main chart
      this.clearRect(this.mainChartView);
      // redraw chart
      this.drawMainChart(this.mainChart, this.grid)

      //find closest point to mouse x 
      const closestIndex = this.findIndexOfClosestValueInSortedArray(mouseX, this.mainChart.cordsX);
      const closestX = this.mainChart.cordsX[closestIndex];
      const closestOffsetIndex = this.mainChart.offset + closestIndex;

      // draw support line
      this.ctx.save();
      this.ctx.lineWidth = this.config.gridLineWidth;
      this.ctx.strokeStyle = this.theme.gridLineColor;
      this.ctx.beginPath()
      this.ctx.moveTo(closestX, this.mainChartView.y)
      this.ctx.lineTo(closestX, this.mainChartView.height);
      this.ctx.stroke()
      this.ctx.restore();

      // draw cricles and prepare values for text helper
      const textBoxData: { color: string, value: string, name: string }[] = []
      this.chartData.columns.forEach(column => {
        const id = column[0];
        if (this.isLineDisabled(id)) return;

        // draw circle
        this.ctx.save();
        this.ctx.lineWidth = this.config.mainChartLineWidth;
        this.ctx.strokeStyle = this.chartData.colors[id];
        this.ctx.fillStyle = this.theme.backgroundColor;
        const y = this.mainChartView.getEndY() - column[closestOffsetIndex] * this.mainChart.scaleY;
        this.ctx.moveTo(closestX, y)
        this.ctx.beginPath()
        this.ctx.arc(closestX, y, this.config.chartPointRadius, 0, Math.PI * 2, true);
        this.ctx.fill()
        this.ctx.stroke()
        this.ctx.restore();

        //prepare values for text helper
        textBoxData.push({
          color: this.chartData.colors[id],
          name: this.chartData.names[id].toString(),
          value: column[closestOffsetIndex].toString()
        })
      })

      // draw box
      this.ctx.save();
      this.ctx.strokeStyle = this.theme.gridLineColor;
      this.ctx.fillStyle = this.theme.backgroundColor;
      this.ctx.fillRect(this.helperBox.x, this.helperBox.y, this.helperBox.width, this.helperBox.height);
      this.ctx.strokeRect(this.helperBox.x, this.helperBox.y, this.helperBox.width, this.helperBox.height);
      this.ctx.restore();

      // draw text
      textBoxData.forEach((text, i) => {
        this.ctx.save();
        this.ctx.fillStyle = text.color;
        this.ctx.fillText(text.value, this.helperBox.x + 20 * i, this.helperBox.y + 10);
        this.ctx.fillText(text.name, this.helperBox.x + 20 * i, this.helperBox.y + 20);
        this.ctx.restore();
      })

      this.lastSupportLineX = closestX;
    }
  }

  // drawing

  public drawMainChart(mainChart: IChart, grid: IGrid) {
    this.clearRect(this.mainChartView);
    this.drawGrid(grid);

    mainChart.lines.forEach(line => {
      this.drawLine(line.path, this.config.mainChartLineWidth, this.chartData.colors[line.id]);
    });
  }

  private drawControlChart(controlChart: IChart) {
    // draw control chart lines
    controlChart.lines.forEach(line => {
      this.drawLine(line.path, this.config.controlChartLineWidth, this.chartData.colors[line.id]);
    });
    // calculate selection
    const startX = controlChart.cordsX[this.beginOffset];
    const endX = controlChart.cordsX[this.endOffset];

    this.selectionBox = new Rect(startX, this.controlChartView.y, endX - startX, this.controlChartView.height)

    this.drawSelection(this.selectionBox)
  }

  private drawGrid(grid: IGrid) {
    this.ctx.save();
    this.ctx.strokeStyle = this.theme.gridLineColor;
    this.ctx.fillStyle = this.theme.legendFontColor;
    this.ctx.lineWidth = this.config.gridLineWidth;
    this.ctx.stroke(grid.path)
    this.ctx.restore();
  }

  private drawSelection(selectionBox: Rect) {
    this.ctx.save()

    // fill uselected
    this.ctx.fillStyle = this.theme.unselectedColor;
    this.ctx.fillRect(this.controlChartView.x, this.controlChartView.y, selectionBox.x - this.controlChartView.x, this.controlChartView.height)
    this.ctx.fillRect(selectionBox.getEndX(), this.controlChartView.y, this.controlChartView.getEndX() - selectionBox.getEndX(), this.controlChartView.height)

    // stroke selection box
    this.ctx.fillStyle = this.theme.selectionBoxColor;

    this.beginRect = new Rect(selectionBox.x, selectionBox.y, this.config.selectionGrabWidth, selectionBox.height)
    this.endRect = new Rect(selectionBox.getEndX() - this.config.selectionGrabWidth, selectionBox.y, this.config.selectionGrabWidth, selectionBox.height)

    this.fillRect(this.beginRect);
    this.fillRect(this.endRect);

    const lineWidth = Math.ceil(this.config.selectionGrabWidth / 5);
    // top line
    this.ctx.fillRect(this.beginRect.getEndX(), selectionBox.y, this.endRect.x - this.beginRect.getEndX(), lineWidth)
    // bottom line
    this.ctx.fillRect(this.beginRect.getEndX(), selectionBox.getEndY() - lineWidth, this.endRect.x - this.beginRect.getEndX(), lineWidth)
    this.ctx.restore()
  }

  private drawLine(line: Path2D, width?: number, color?: string) {
    this.ctx.save();

    if (width) this.ctx.lineWidth = width;
    if (color) this.ctx.strokeStyle = color;

    this.ctx.stroke(line);
    this.ctx.restore();
  }

  private fillRect(rect: Rect): void {
    this.ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
  }

  private strokeRect(rect: Rect): void {
    this.ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
  }

  private clearRect(rect: Rect): void {
    this.ctx.save()
    this.ctx.fillStyle = this.theme.backgroundColor;
    this.ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
    this.ctx.restore()
  }

  // calculation

  private getGrid(view: Rect): IGrid {
    const stepY = view.height / this.config.gridLineCount;
    const path = new Path2D();

    // draw horizontal lines
    for (let i = 0; i < this.config.gridLineCount; i++) {
      const height = view.getEndY() - (stepY * i)

      path.moveTo(view.x, height);
      path.lineTo(view.width, height);
    }

    return { path, stepY };
  }

  private getChartLines(beginOffset: number, endOffset: number, view: Rect): IChart {
    // adjust offsets to be in range and ignore first element (name)
    beginOffset = Math.max(1, beginOffset + 1);
    endOffset = Math.min(this.chartData.columns[0].length - 1, endOffset + 1);
    const pointCount = endOffset - beginOffset;
    // find axis X pixel step between two chart points
    const stepX = view.width / (pointCount - 1);
    // find pixel scale for axis Y using max and min values
    let { max, min } = this.findMaxMinValues(beginOffset, endOffset);
    // increase max for 10% for proper scaling
    max += Math.round(max * 0.1)
    const scaleY = view.height / max;

    const cordsX: number[] = []
    for (let i = 0; i < pointCount; i++) {
      cordsX.push(stepX * i + view.x);
    }

    const lines: IChartLine[] = [];
    this.chartData.columns.forEach(column => {
      const id = column[0];
      // check if user switch to ignore this column
      if (this.isLineDisabled(id)) return;
      // prepare brush
      const path = new Path2D;

      path.moveTo(view.x, view.getEndY() - column[beginOffset] * scaleY);
      for (let i = beginOffset, j = 0; i < endOffset; i++ , j++) {
        path.lineTo(cordsX[j], view.getEndY() - column[i] * scaleY)
      }
      lines.push({ id, path })
    });
    return { cordsX, lines, scaleY, offset: beginOffset, stepX, maxValue: max };
  }

  private isLineDisabled(id: string): boolean {
    return this.disabledLines.indexOf(id) !== -1;
  }

  private findMaxMinValues(beginOffset: number, endOffset: number): { min: number, max: number } {
    //find first line that we not ignore and setup initial max and min values
    let max: number;
    let min: number;
    for (let i = 0; i < this.chartData.columns.length; i++) {
      const id = this.chartData.columns[i][0];
      // check if user switch to ignore this column
      if (!this.isLineDisabled(id)) {
        max = this.chartData.columns[i][1];
        min = this.chartData.columns[i][1];
        break;
      }
    }

    this.chartData.columns.forEach(column => {
      const id = column[0];
      // check if user switch to ignore this column
      if (this.isLineDisabled(id)) return;

      for (let i = beginOffset; i < endOffset; i++) {
        if (column[i] > max) max = column[i];
        if (column[i] < min) min = column[i];
      }
    })

    return { max, min }
  }

  private findIndexOfClosestValueInSortedArray(value: number, array: number[]): number {

    let closestIndex = 0;
    // 
    while (array[closestIndex] < value) {
      if (closestIndex > array.length - 1) return -1;
      closestIndex++
    }

    if (Math.abs(array[closestIndex - 1] - value) < Math.abs(array[closestIndex] - value)) {
      closestIndex = closestIndex - 1
    }

    return closestIndex;
  }

}