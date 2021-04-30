/**
 * tested formatters:
 * Currency
 * percent
 * Data formatter
 *  */

 import "./style.css";

 import picasso from "picasso.js";
 
 // Data
 const measures = ["Sales", "Budget", "Margin"];
 const months = ["Jan", "Feb", "Mar", "Apr"];
 const fields = ["Month", ...measures];
 const matrix = [
   [500, 45000000, 360],
   [510, 48000000, 380],
   [520, 49000000, 370],
   [530, 41000000, 350]
 ];
 
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
 
 const scales = {
   xScale,
   yScale,
   sizeScale
 };
 
 // Components
 const xAxis = {
   type: "axis",
   dock: "bottom",
   scale: "xScale",
   formatter: "defCurrency"
 };
 
 const yAxis = {
   type: "axis",
   dock: "left",
   scale: "yScale",
   formatter: "defCurrency"
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
         size: { field: "Margin" }
       }
     }
   },
   settings: {
     x: { scale: "xScale" },
     y: { scale: "yScale" },
     shape: "circle",
     size: { scale: "sizeScale" },
     sizeLimits: { minPx: 10 },
     strokeWidth: 2,
     stroke: "#fff",
     opacity: 0.8
   }
 };
 
 const components = [xAxis, yAxis, xGrid, yGrid, pointLayer];
 
 function createFormatter(format = "$") {
   return value => `${value}${format}`;
 }
 
 const formatters = {
   // built-in currency formatter ($)
   defCurrency: {
     type: "d3-number",
     format: "($.2s"
   },
   // built-in percent formatter
   percent: {
     type: "d3-number",
     format: ".1%"
   },
   // create a Formatter from data
   dataFormatter: {
     data: {
       fields: ["Sales"]
     }
   },
   twoDigitsFormatter: {
     type: "d3-number",
     format: ".2s"
   }
 };
 
 // Settings
 const chart_settings = {
   scales,
   components,
   formatters
 };
 
 const pic = picasso.chart({
   element: document.querySelector("#container"),
   data: [],
   settings: chart_settings
 });
 
 function update() {
   pic.update({
     data,
     chart_settings
   });
 }
 
 update();
 