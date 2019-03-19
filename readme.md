# Description

My project helps you to draw beauty charts. I decide to make it to take part in telegram javascript contest.

## Contest

### Rules

Telegram official coding competition for Android, iOS and JS developers.
10-24 March 2019, 125,000 USD in prizes.

The goal is to develop software for showing simple charts based on input data we provide. You can use either JavaScript, Android Java or iOS Swift. Note: you may not use specialized charting libraries. All the code you submit must be written by you from scratch.

The criteria we’ll be using to define the winner are speed, efficiency and the size of the app.
The app should show 4 charts on one screen, based on the input data we will provide within the next 24 hours. 

We’ll distribute the 125,000 USD prize fund among the authors of the slickest apps in the final week of March.

Stay tuned for contest-related announcements in this channel.
Good luck!

### Data format

input data format:

```javascript
IChartData {
    columns: [id: string, ...number[]];
    types: { [id: string]: "line" | "x" };
    names: { [id: string]: string };
    colors: { [id: string]: string };
}
```

## Install

## Using example

Initilize chart

```javascript
const canvas = document.getElementById("chart1");
const chart = new Chart(canvas, data, config);
```

```javascript
// set new data source
chart.setData(data2)
// lines
chart.disableLine("someline")
chart.enableLine("someline")
chart.toggleLine("someline")
```

## How it works

- Calculate chart line:
  - Find biggestY value in input.columns arrays and add 10% to it
  - Find axis Y scale. scale = view port height / biggestY
  - Find pixel step between two points at axis X. stepX = view port width / points in chart
  - Draw chart lines to Path2D. x = point index * stepX, y = point value * scaleY

- Handle mousedown/touchdown event
  - Check if user to control chart
  - Check if user click to selection
  - Set isDragInProgress flag 
  - Check if user click at selection edge and set drag type (left edge, rigth edge, middle)

- Handle mousemove/touchmove
  - If moving in control chart  
    - Find closest point index to mouseX
    - Set new selection start and end index
    - Clear control and main chart view
    - Draw control chart lines from saved Path2D
    - Draw new selection
    - Calculate main chart lines by using start and end index 
    - Draw main chart
  - If moving in main chart
    - Check if mouseX far from last draw support line
    - Clear main chart view
    - Find closest point index to mouseX
    - Draw support line in closest point x
    - Draw circles at support line
    - Draw helper box
    - Fill helper box with text

## Optimization

Canvas painting optimization
- Save lines to Path2D and reuse it later instead of recalculation line
- Don't use ctx.save() and ctx.restore()

Javascript optimization
- Don't create new heavy object or arrays to avoid garbage collection

What didn't work:

- Overlaing canvas. Clone canvas element and make it overlaing first canvas to simulate layers. Don't see big perfomance improve. Also this restrict display style to absolute/relative. Decide to use image composing instead.
- Image composing. Save elements to image by using ctx.getImage() and reuse it later with ctx.drawImage(). Drawing image is heavy operation, images use more memory. Decide to use Path2D to save elements.
- Use separaite canvas for chart and control elements. Easy to handle events but slower perfomance.

## TODO list

- add selection box clicked animation
- add grid rescale animation
- make main chart helper box to not cross with helper line

done:

- Helper box
- legend X
- legend Y
- moveable selection for control chart
- change size of selection for control chart
- main chart
- control chart
- horizontal grid for main chart
- mousemove helper line for main chart
- chart points on helper line for main chart