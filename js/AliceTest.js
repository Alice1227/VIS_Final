//Bar Chart
//定義圖表左右距離與整體長寬
let margin_bar = {
    top: 10,
    right: 10,
    bottom: 10,
    left: 10
  },
  width_bar = 200 - margin_bar.left - margin_bar.right,
  height_bar = 200 - margin_bar.top - margin_bar.bottom;

let x = d3.scaleBand()
  .rangeRound([0, width_bar], .1);

let y = d3.scaleLinear()
  .range([height_bar, 0]);

let xAxis_bar = d3.axisBottom(x);

let yAxis_bar = d3.axisLeft(y);

let color = d3.scaleOrdinal()
  .range(["#DD84A1", "#FFBBBE", "#FEE698", "#CBE3B3", "#40DEF1"]);

let barSvg = d3.select('#barChart svg')
  .attr("width", width_bar + margin_bar.left + margin_bar.right)
  .attr("height", height_bar + margin_bar.top + margin_bar.bottom)
  .append("g")
  .attr("transform", "translate(" + margin_bar.left + "," + margin_bar.top + ")");

function setBarGraph(ratings) {
  dataSorting(ratings);
  let data_five = [];
  for (i = 0; i < 5; i++) {
    data_five.push(data[i])
  }
  console.log(ratings, data_five);

}

setBarGraph("average");