import { MainChart } from "./MainChart";
import { ControlChart } from "./ControlChart"

document.createChart = (canvas, data) => {
  const chartCanvas = canvas.querySelector(".canvas.chart") as HTMLCanvasElement;
  const controlCanvas = canvas.querySelector(".canvas.control") as HTMLCanvasElement;
  const chart = new MainChart(chartCanvas, data);
  const control = new ControlChart(controlCanvas, data);
  control.setOnChangeCallback((x, y) => chart.draw(x, y))
  control.draw()
}

