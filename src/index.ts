import { Chart } from "./Chart";
import { InputData } from "./interfaces"

document.createChart = (container: HTMLElement, data: InputData) => {
  const chartCanvas = container.querySelector(".canvas.chart") as HTMLCanvasElement;

  const chart = new Chart(chartCanvas, data);
}

