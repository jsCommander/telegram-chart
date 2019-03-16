import { Rect, InputData, IChart, IChartLine, IGrid, IConfig } from "./interfaces";
import { BaseChart } from "./BaseChart";

export class MainChart extends BaseChart {
  private grid: IGrid;
  private chart?: IChart
  private lastDrawX: number = 0;
  constructor(canvas: HTMLCanvasElement, chartData: InputData, config?: IConfig) {
    super(canvas, chartData, config);
    this.grid = this.getGrid();

    // set onmouse move
    this.ctx.canvas.addEventListener("mousemove", e => this.mousemoveHandler(e.offsetX));
    this.ctx.canvas.addEventListener("touchmove", e => this.mousemoveHandler(e.touches[0].clientX - this.ctx.canvas.offsetLeft))
  }

  public draw(beginOffset: number = 0, endOffset: number = 10) {
    this.clearRect(this.viewPort);
    this.drawGrid();

    this.chart = this.getChartLines(beginOffset, endOffset);

    this.chart.lines.forEach(line => {
      this.drawLine(line.path, this.config.chartLineWidth, this.chartData.colors[line.id]);
    });
  }

  private drawGrid() {
    this.ctx.save();
    this.ctx.strokeStyle = this.config.themes[this.theme].gridLineColor;
    this.ctx.fillStyle = this.config.themes[this.theme].legendFontColor;
    this.ctx.lineWidth = this.config.gridLineWidth;
    this.ctx.stroke(this.grid.path)
    this.ctx.restore();
  }

  private mousemoveHandler(mouseX: number) {
    if (!this.chart) return;
    if ((Math.abs(this.lastDrawX - mouseX) < this.chart.stepX / 2)) return;

    this.clearRect(this.viewPort);
    this.drawGrid();

    this.chart.lines.forEach(line => {
      this.drawLine(line.path, this.config.chartLineWidth, this.chartData.colors[line.id]);
    });

    //find closest
    const closestIndex = this.findIndexOfClosestValueInSortedArray(mouseX, this.chart.cordsX);
    const closestX = this.chart.cordsX[closestIndex];
    const closestOffsetIndex = this.chart.offset + closestIndex

    // draw support line
    this.ctx.save();
    this.ctx.lineWidth = this.config.gridLineWidth;
    this.ctx.strokeStyle = this.config.themes[this.theme].gridLineColor;
    this.ctx.beginPath()
    this.ctx.moveTo(closestX, this.viewPort.y)
    this.ctx.lineTo(closestX, this.viewPort.height);
    this.ctx.stroke()
    this.ctx.restore();

    // draw cricles and prepare values for text helper
    const textBoxData: { color: string, value: string, name: string }[] = []
    this.chartData.columns.forEach(column => {
      const id = column[0];
      if (this.isLineDisabled(id)) return;

      // draw circle
      this.ctx.save();
      this.ctx.lineWidth = this.config.chartLineWidth;
      this.ctx.strokeStyle = this.chartData.colors[id];
      this.ctx.fillStyle = this.config.themes[this.theme].backgroundColor;
      const y = this.viewPort.height - column[closestOffsetIndex] * this.chart.scaleY;
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

    // calculate text helper size
    const margin = 10;

    let acc = 0;
    const textOffsets = textBoxData.map(x => {
      const valueWidth = this.ctx.measureText(x.value).width;
      const nameWidth = this.ctx.measureText(x.name).width;

      acc = acc + Math.max(valueWidth, nameWidth) + margin

      return acc;
    })

    const box = new Rect(30, 30, textOffsets.reduce((acc, x) => acc += x) + margin, 30)

    // draw box
    this.ctx.save();
    this.ctx.strokeStyle = this.config.themes[this.theme].gridLineColor;
    this.ctx.fillStyle = this.config.themes[this.theme].backgroundColor;
    this.ctx.fillRect(box.x, box.y, box.width, box.height);
    this.ctx.strokeRect(box.x, box.y, box.width, box.height);
    this.ctx.restore();

    // draw text
    textBoxData.forEach((text, i) => {
      this.ctx.save();
      this.ctx.fillStyle = text.color;
      this.ctx.fillText(text.value, box.x + textOffsets[i], box.y + 10);
      this.ctx.fillText(text.name, box.x + textOffsets[i], box.y + 20);
      this.ctx.restore();
    })

    this.lastDrawX = closestX;
  }
}
