const chart1 = document.querySelector("#chart1>.chart")
chart1.width = 800;
chart1.height = 300;
const ctx = chart1.getContext("2d")

const config = {
  supportLine: {
    count: 6,
    color: "#a7a7a7",
    font: "serif",
    fontSize: 0.25
  }
}

const chartData = {
  "columns": [
    [
      "x",
      1542412800000,
      1542499200000,
      1542585600000,
      1542672000000,
      1542758400000,
      1542844800000,
      1542931200000,
      1543017600000,
      1543104000000,
    ],
    [
      "y0",
      37,
      20,
      32,
      39,
      32,
      35,
      19,
      65,
      36
    ],
    [
      "y1",
      22,
      12,
      30,
      40,
      33,
      23,
      118,
      41,
      45
    ]
  ],
  "types": {
    "y0": "line",
    "y1": "line",
    "x": "x"
  },
  "names": {
    "y0": "#0",
    "y1": "#1"
  },
  "colors": {
    "y0": "#3DC23F",
    "y1": "#F34C44"
  }
}



const drawAxis = (ctx, viewPort, axisX, axisY) => {
  const supportLineHeightStep = Math.floor(viewPort.height / (config.supportLine.count));
  const maxValue = axisY.reduce((max, x, i) => max = Math.max(max, ...x), 0)
  const supportLineValueStep = Math.floor(maxValue / config.supportLine.count + 2);
  const legendFontSize = Math.floor((Math.min(viewPort.width, viewPort.height) / config.supportLine.count * config.supportLine.fontSize));

  const supportLines = Array(config.supportLine.count).fill().map((x, i) => {
    const obj = { height: viewPort.height - (supportLineHeightStep * i), value: supportLineValueStep * i };
    return obj
  })

  ctx.save();

  ctx.strokeStyle = config.supportLine.color;
  ctx.fillStyle = config.supportLine.color;
  ctx.lineWidth = 1;
  ctx.font = `${legendFontSize}px ${config.supportLine.font}`;

  supportLines.forEach(x => {
    ctx.beginPath()
    ctx.moveTo(viewPort.x, x.height);
    ctx.lineTo(viewPort.width, x.height);
    ctx.stroke()

    ctx.fillText(x.value, viewPort.x, x.height - 5);
  })

  ctx.restore()
}

const drawChart = (ctx, viewPort, valueX, valueY) => {
  const chartAxisXStep = Math.ceil((viewPort.width) / valueX.length);
  const maxValue = valueY.reduce((max, x, i) => max = Math.max(max, ...x), 0)
  const chartAxisYscale = viewPort.height / maxValue;

  ctx.save();

  ctx.strokeStyle = "#3DC23F";
  ctx.fillStyle = "red";
  ctx.lineWidth = 3;

  valueY.forEach(x => {
    ctx.beginPath();
    ctx.moveTo(0, Math.round(viewPort.height - x[0] * chartAxisYscale));
    x.forEach((value, i) => {
      ctx.lineTo(Math.round(i * chartAxisXStep), Math.round(viewPort.height - value * chartAxisYscale))
      ctx.fillText(value, Math.round(i * chartAxisXStep), Math.round(viewPort.height - value * chartAxisYscale) + 10);
    })
    ctx.stroke()
  })

  ctx.restore()
}

const drawCharts = (ctx, chartsData, viewPort) => {
  const width = viewPort ? viewPort.width : ctx.canvas.width;
  const height = viewPort ? viewPort.height : ctx.canvas.height;

  let axisXvalues;
  let axisYvalues = [];

  chartsData.columns.forEach(arr => {
    if (arr[0] === "x") {
      axisXvalues = arr.slice(1);
    } else {
      axisYvalues.push({ name: arr[0], values: arr.slice(1) });
    }
  })

  const axisXstep = Math.ceil(width / axisXvalues.length);
  // find max value in all chart and calculate scaling
  const maxValue = axisYvalues.reduce((max, x) => max = Math.max(max, ...x.values), 0)
  const axisYscale = height / maxValue;

  ctx.save();

  ctx.lineWidth = 3;

  axisYvalues.forEach(chart => {
    ctx.strokeStyle = chartsData.colors[chart.name];
    ctx.fillStyle = chartsData.colors[chart.name];

    ctx.beginPath();
    ctx.moveTo(0, Math.round(viewPort.height - chart.values[0] * axisYscale));
    chart.values.forEach((value, i) => {
      ctx.lineTo(Math.round(i * axisXstep), Math.round(viewPort.height - value * axisYscale))
      ctx.fillText(value, Math.round(i * axisXstep) + 5, Math.round(viewPort.height - value * axisYscale) + 15);
    })
    ctx.stroke()
  })

  ctx.restore()
}

drawAxis(ctx, { x: 5, y: 5, width: ctx.canvas.width - 5, height: ctx.canvas.height - 5 }, chartData.columns[0].slice(1), [chartData.columns[1].slice(1), chartData.columns[2].slice(1)])
drawCharts(ctx, chartData, { x: 5, y: 5, width: ctx.canvas.width - 5, height: ctx.canvas.height - 5 })
// drawChart(ctx, { x: 5, y: 5, width: ctx.canvas.width - 5, height: ctx.canvas.height - 5 }, chartData.columns[0].slice(1), [chartData.columns[1].slice(1), chartData.columns[2].slice(1)])