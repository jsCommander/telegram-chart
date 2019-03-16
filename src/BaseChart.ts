import { Rect, InputData, IChart, IChartLine, IGrid, IConfig } from "./interfaces";
import { config } from "./config"

export class BaseChart {
  protected ctx: CanvasRenderingContext2D;
  protected viewPort: Rect;
  protected theme: string = "white";
  protected disabledLines: string[] = ["x"];
  protected config: IConfig;

  constructor(canvas: HTMLCanvasElement, protected chartData: InputData, userConfig?: any) {
    this.config = Object.assign({}, config, userConfig) as IConfig;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Can't get canvas context 2d");
    }

    this.ctx = ctx;
    // set view port
    this.viewPort = new Rect(0, 0, canvas.width, canvas.height);
  }

  protected getGrid(viewPort?: Rect): IGrid {
    const view = viewPort ? viewPort : this.viewPort;
    const stepY = view.height / config.gridHorizontalLineCount;
    const path = new Path2D();

    // draw horizontal lines
    for (let i = 0; i < config.gridHorizontalLineCount; i++) {
      const height = view.height - (stepY * i)

      path.moveTo(view.x, height);
      path.lineTo(view.width, height);
    }

    return { path, stepY };
    /*
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
    */
  }

  protected getChartLines(beginOffset: number, endOffset: number, viewPort?: Rect): IChart {
    const view = viewPort ? viewPort : this.viewPort;

    // adjust offsets to be in range and ignore first element (name)
    beginOffset = Math.max(1, beginOffset + 1);
    endOffset = Math.min(this.chartData.columns[0].length - 1, endOffset + 1);
    const pointCount = endOffset - beginOffset;
    // find axis X pixel step between two chart points
    const stepX = (view.width - view.x) / (pointCount - 1);
    // find pixel scale for axis Y using max and min values
    const { max, min } = this.findMaxMinValues(beginOffset, endOffset);
    const scaleY = (view.height - view.y) / max;

    const cordsX: number[] = []
    for (let i = 0; i < pointCount; i++) {
      cordsX.push(stepX * i);
    }

    const lines: IChartLine[] = [];
    this.chartData.columns.forEach(column => {
      const id = column[0];
      // check if user switch to ignore this column
      if (this.isLineDisabled(id)) return;
      // prepare brush
      const path = new Path2D;

      path.moveTo(view.x, view.height - column[beginOffset] * scaleY);
      for (let i = beginOffset, j = 0; i < endOffset; i++ , j++) {
        path.lineTo(cordsX[j], view.height - column[i] * scaleY)
      }
      lines.push({ id, path })
    });
    return { cordsX, lines, scaleY, offset: beginOffset, stepX };
  }

  protected drawLine(line: Path2D, width?: number, color?: string) {
    this.ctx.save();

    if (width) this.ctx.lineWidth = width;
    if (color) this.ctx.strokeStyle = color;

    this.ctx.stroke(line);
    this.ctx.restore();
  }

  protected isPointInRect(rect: Rect, x: number, y: number): boolean {
    return (rect.x < x) && (x < rect.getEndX()) && (rect.y < y) && (y < rect.getEndY())
  }

  // class helpers
  protected fillRect(rect: Rect): void {
    this.ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
  }

  protected strokeRect(rect: Rect): void {
    this.ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
  }

  protected clearRect(rect: Rect): void {
    this.ctx.save()
    this.ctx.fillStyle = this.config.themes[this.theme].backgroundColor;
    this.ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
    this.ctx.restore()
  }

  protected isLineDisabled(id: string): boolean {
    return this.disabledLines.indexOf(id) !== -1;
  }

  protected findMaxMinValues(beginOffset: number, endOffset: number): { min: number, max: number } {
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

  // common helpers
  protected findIndexOfClosestValueInSortedArray(value: number, array: number[]): number {

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