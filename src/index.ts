import { Chart } from "./Chart";
import { InputData } from "./interfaces"

const doc = document as any;

doc.createChart = (canvas: HTMLCanvasElement, data: InputData) => {
  return new Chart(canvas, data);
}

