import { MainChart } from "./MainChart";
import { ControlChart } from "./ControlChart"
import { IChartData } from "./interfaces"

document.createChart = (container: HTMLElement, data: IChartData) => {
  const chartCanvas = container.querySelector(".canvas.chart") as HTMLCanvasElement;
  const controlCanvas = container.querySelector(".canvas.control") as HTMLCanvasElement;

  const chart = new MainChart(chartCanvas, data);
  const control = new ControlChart(controlCanvas, data);
  control.setOnChangeCallback((x, y) => chart.draw(x, y))
  control.draw()
}

