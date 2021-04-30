// POINT SIZE BY MEASURE

import "./style.css";

import picasso from "picasso.js";

// Data
const measures = ["Sales", "Budget", "Margin"];
const months = ["Jan", "Feb", "Mar", "Apr"];
const fields = ["Month", ...measures];
const matrix = [
  [500, 450, null],
  [510, 480, 90],
  [520, 490, 75],
  [530, 410, 61]
];

// min and max measure values
const marginMax = 91;
const marginMin = 60;
// min and max bubble size
const minDotSize = 2;
const maxDotSize = 8;

function generateData() {
  const data = [fields];
  for (let m = 0; m < months.length; m++) {
    data.push([months[m], ...matrix[m]]);
  }
  return [
    {
      type: "matrix",
      data
    }
  ];
}

const data = generateData();

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

const getSizePx = (dataValue, wsm, dataProps) => {
  const { marginMax, marginMin, minDotSize, maxDotSize } = dataProps;
  const scaledValue = (dataValue - marginMin) / (marginMax - marginMin);
  const radius =
    minDotSize + (maxDotSize - minDotSize) * Math.sqrt(scaledValue);
  const diameter = radius * 2;
  return `${diameter * wsm}px`;
};

const scales = {
  xScale,
  yScale,
  sizeScale
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

let windowSizeMultiplier;

const props = {
  marginMin,
  marginMax,
  minDotSize,
  maxDotSize
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
        size: { field: "Margin" }
      }
    }
  },
  settings: {
    x: { scale: "xScale" },
    y: { scale: "yScale" },
    shape: "circle",
    size: d =>
      d.datum.size.value
        ? getSizePx(d.datum.size.value, windowSizeMultiplier, props)
        : null,
    shape: d => (d.datum.size.value ? "circle" : "saltire"),
    sizeLimits: { minPx: 20, maxPx: 50 },
    strokeWidth: 2,
    stroke: "#fff",
    opacity: 0.8
  },
  beforeRender: ({ size }) => {
    windowSizeMultiplier = Math.min(size.height, size.width) / 300;
  }
};

const components = [xAxis, yAxis, xGrid, yGrid, pointLayer];

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
