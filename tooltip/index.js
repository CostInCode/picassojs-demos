/**
 * NATIVE Picasso tooltip
 */
 import "./style.css";
 import picasso from "picasso.js";
 
 // Data
 const measures = ["Sales", "Budget", "Margin"];
 const months = ["Jan", "Feb", "Mar", "Apr"];
 const fields = ["Month", ...measures];
 const matrix = [
   [500, 450, 360],
   [510, 480, 380],
   [520, 490, 370],
   [530, 410, 350]
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
 
 const colorScale = {
   data: {
     extract: {
       field: "Margin"
     }
   },
   range: ["#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00"],
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
 
 const point = {
   key: "p",
   type: "point",
   data: {
     extract: {
       field: "Month",
       props: {
         x: { field: "Sales" },
         y: { field: "Budget" },
         size: { field: "Margin" },
         color: { field: "Margin" }
       }
     }
   },
   settings: {
     x: { scale: "xScale" },
     y: { scale: "yScale" },
     shape: "circle",
     size: { scale: sizeScale },
     sizeLimits: { minPx: 10 },
     strokeWidth: 2,
     stroke: "#fff",
     opacity: 0.8,
     fill: { scale: "colorScale", ref: "color" }
   }
 };
 
 const tooltip = {
   key: "tooltip",
   type: "tooltip",
   settings: {
     // Since we only want to target the point marker
     filter: nodes =>
       nodes.filter(node => node.key === "p" && node.type === "circle"),
     // Create the data model
     extract: ({ node }) => {
       /*const formatterFn = resources.formatter({
         type: "d3-number",
         format: ".2s"
       });*/
       const dataProps = Object.keys(node.data)
         .filter(
           key =>
             key !== "value" &&
             key !== "label" &&
             key !== "source" &&
             key !== "color"
         )
         .map(key => ({
           label: node.data[key].source.field,
           value: node.data[key].value
           /*isNaN(node.data[key].value)
               ? node.data[key].value
               : formatterFn(node.data[key].value)*/
         }));
 
       return {
         title: node.data.value,
         color: node.attrs.fill,
         props: dataProps
       };
     },
     // Generate virtual nodes
     content: ({ h, data }) => {
       const rows = [];
       data.forEach(node => {
         const titleRow = h(
           "th",
           {
             colSpan: 2,
             style: {
               fontWeight: "bold",
               textAlign: "center",
               backgroundColor: node.color // color of tooltip element
             }
           },
           node.title
         );
 
         rows.push(titleRow);
 
         node.props.forEach(prop => {
           const cells = [
             h("td", {}, `${prop.label}:`),
             h("td", { style: { "text-align": "right" } }, prop.value)
           ];
           rows.push(h("tr", {}, cells));
         });
       });
 
       return h("div", { display: "table" }, rows);
     },
     afterShow({ element }) {
       element.children[0].style.opacity = 1;
       element.children[1].style.opacity = 1;
     },
     onHide({ element }) {
       element.children[0].style.opacity = 0;
       element.children[1].style.opacity = 0;
     },
     placement: {
       type: "pointer",
       area: "target"
     }
   },
   style: {
     content: {
       borderSpacing: "4px",
       opacity: 0,
       transition: "opacity 150ms ease-in"
     },
     arrow: {
       opacity: 0,
       transition: "opacity 150ms ease-in"
     }
   }
 };
 
 const components = [xAxis, yAxis, xGrid, yGrid, point, tooltip];
 
 const interactions = [
   {
     type: "native",
     events: {
       mousemove: function(e) {
         this.chart.component("tooltip").emit("show", e);
       },
       mouseleave: function(e) {
         this.chart.component("tooltip").emit("hide");
       }
     }
   }
 ];
 
 // Settings
 const settings = {
   scales,
   components,
   interactions
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
 