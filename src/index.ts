import { Chart } from "./Chart";
import { InputData } from "./interfaces"

const doc = document as any;

window.Chart = Chart;

doc.createChart = (canvas: HTMLCanvasElement, data: InputData) => {
  return new Chart(canvas, data);
}

