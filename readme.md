# Description

My priject help you to draw beaty charts. I decide to make it to take part in telegram js contest

## Contest

### Rules

Telegram official coding competition for Android, iOS and JS developers.
10-24 March 2019, 125,000 USD in prizes.

The goal is to develop software for showing simple charts based on input data we provide. You can use either JavaScript, Android Java or iOS Swift. Note: you may not use specialized charting libraries. All the code you submit must be written by you from scratch.

The criteria we’ll be using to define the winner are speed, efficiency and the size of the app.
The app should show 4 charts on one screen, based on the input data we will provide within the next 24 hours. We will announce how you can submit your finished work later in this channel.

Designs for the contest charts are attached below. We’ll distribute the 125,000 USD prize fund among the authors of the slickest apps in the final week of March.

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

## How it works

- Prepare input data for drawing
  - Find biggest Y axis value in input.columns arrays
  - Find pixel step between two points at axis X
  - Transform input data to IChart[]
- Draw control element
  - Draw full chart line to control element
  - Draw default selection
  - Set event mousedown, mousemove, mouseup handler for selection
    1. mousedown. check if clicked iside selection
    2. check if clicked to selection edge
    3. onmousemove. changing selection size or position
    4. onmouseup. save current selection size or position. Fire callback with new offset for main chart
- Draw main chart
  - Transform part of input data to IChart using control element selection values
  - Draw grid
  - Draw legend
  - Draw chart line
  - Set event mousemove handler
    1. Find index of IChartPoint[] element that have x position closest to mouse position
    2. Draw helper line at 
    3. Draw point on helper line for every IChart
    4. Draw box with support text

## Optimization

- use separaite canvas for chart and control elements?
- draw lines to Path2D first?
- clone canvas element and use it to draw each element save to image by using ctx.getImage(). Then compose images to main canvas
- do not transform input data without heavy need
- do not copy arrays, pass only by link

What didn't work:

- use two overlaing canvas, one for chart another for helpers/control. Very hard to keep it overlaing, restrict display style to absolute/relative. Deside to use image composing instead.

## TODO list

- draw chart function

- moveable selection for control chart
- change size of selection for control chart
- make main chart helper box not cross with helper line
- animate main chart y scaling. If new max y value is bigger/less than old max y value than draw chart with new y scale and animate y scale transition from old value to new

done:

- main chart
- control chart
- horizontal grid with legend for main chart
- vertical grid for main chart
- mousemove helper line for main chart
- chart points on helper line for main chart
- box with values