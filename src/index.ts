import { Chart } from "./Chart";
import { InputData } from "./interfaces"

const doc = document as any;

doc.createChart = (canvas: HTMLCanvasElement, data: InputData) => {
  const chart = new Chart(canvas, data);
}

