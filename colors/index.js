import "./style.css";

import picasso from "picasso.js";

// Data
const data = [
  {
    type: "matrix",
    data: [
      ["Year", "Month", "Sales", "Budget", "Margin"],
      ["2010", "Jan", 500, 450, 360],
      ["2010", "Feb", 510, 480, 380],
      ["2010", "Mar", 520, 490, 370],
      ["2010", "Apr", 530, 410, 350],
      ["2011", "Jan", 560, 420, 390],
      ["2011", "Feb", 540, 440, 400],
      ["2011", "Mar", 570, 450, 320],
      ["2011", "Apr", 590, 430, 340],
      ["2012", "Jan", 600, 470, 410],
      ["2012", "Feb", 580, 500, 440],
      ["2012", "Mar", 610, 520, 420],
      ["2012", "Apr", 630, 510, 450]
    ]
  }
];

// Scales
const xScale = {
  data: {
    field: "Sales"
  },
  expand: 0.2
};

const yScale = {
  data: {
    field: "Budget"
  },
  expand: 0.2,
  invert: true
};

const sizeScale = {
  data: {
    field: "Margin"
  }
};

const colorScale = {
  data: {
    extract: {
      field: "Year"
    }
  },
  range: ["red", "green", "blue"],
  type: "color"
};

const scales = {
  xScale,
  yScale,
  sizeScale,
  colorScale
};

// Components
const xAxis = {
  type: "axis",
  dock: "bottom",
  scale: "xScale"
};

const yAxis = {
  type: "axis",
  dock: "left",
  scale: "yScale"
};

const xGrid = {
  key: "xGrid",
  type: "grid-line",
  ticks: {
    // show: true,
    stroke: "grey",
    strokeWidth: 0.5
  },
  x: xScale
};

const yGrid = {
  key: "yGrid",
  type: "grid-line",
  ticks: {
    // show: true,
    stroke: "grey",
    strokeWidth: 0.5
  },
  y: yScale
};

const pointLayer = {
  key: "p",
  type: "point",
  data: {
    extract: {
      field: "Month",
      props: {
        x: { field: "Sales" },
        y: { field: "Budget" },
        size: { field: "Margin" },
        group: { field: "Year" }
      }
    }
  },
  settings: {
    x: { scale: "xScale" },
    y: { scale: "yScale" },
    shape: "circle",
    size: { scale: "sizeScale" },
    sizeLimits: { minPx: 10, maxPx: 100 }, // Smallest point size is 10 px
    fill: { scale: "colorScale", ref: "group" },
    strokeWidth: 2,
    stroke: "#fff",
    opacity: 0.8
  }
};

const colorLegend = {
  type: "legend-cat",
  scale: "colorScale",
  dock: "top"
};

const components = [xAxis, yAxis, xGrid, yGrid, pointLayer, colorLegend];

// Settings
const settings = {
  scales,
  components
};

const pic = picasso.chart({
  element: document.querySelector("#container"),
  data: [],
  settings: {}
});

function update() {
  pic.update({
    data,
    settings
  });
}

update();
