//Bar Chart
//定義圖表左右距離與整體長寬
let margin_bar = {
    top: 20,
    right: 0,
    bottom: 140,
    left: 20
  },
  width_bar = $("#barChart").width(),
  height_bar = 300;

let x = d3.scaleBand()
  .range([margin_bar.left, width_bar - margin_bar.left])
  .padding(0.3);
let y = d3.scaleLinear()
  .range([height_bar - margin_bar.bottom, margin_bar.top]);

let xAxis_bar = d3.axisBottom(x);
let yAxis_bar = d3.axisLeft(y);

let barSvg = d3.select('#barChart svg')
  .attr("width", width_bar)
  .attr("height", height_bar);

function setBarGraph(ratings) {
  dataSorting(ratings);
  let data_five = [];
  for (i = 0; i < 5; i++) {
    data_five.push(data[i]);
  }
  // console.log(ratings, data_five);

  d3.selectAll("#barChart svg g").remove();

  let dramaNames = data_five.map(d => d.drama);
  x.domain(dramaNames);
  y.domain([0, d3.max(data_five, d => d[ratings])]);

  //繪製x軸
  barSvg.append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0, ${height_bar - margin_bar.bottom})`)
    .call(xAxis_bar)
    .selectAll("text")
    .attr('font-size', 12)
    .style("text-anchor", "start")
    .attr("rotate", -90)
    .attr("dx", "2em")
    .attr("dy", "-0.3em")
    .attr("kerning", 0)
    .attr("transform", "rotate(90)");

  //繪製y軸
  barSvg.append("g")
    .attr("class", "y axis")
    .attr("transform", `translate(${margin_bar.left}, 0)`)
    .call(yAxis_bar)
    .append("text")
    .attr("transform", `translate(${-margin_bar.left}, 10)`)
    .attr('fill', '#000')
    .attr('font-size', 12)
    .style("text-anchor", "start")
    .style('font-weight', 'bold')
    .text(() => {
      if (ratings == "average") {
        return "平均收視率(%)";
      } else if (ratings == "first") {
        return "首回收視率(%)";
      } else if (ratings == "last") {
        return "終回收視率(%)";
      }
    });

  let slice = barSvg.selectAll(".slice")
    .data(data_five)
    .enter().append("g")
    .attr("class", "g");

  //繪製bar
  slice.selectAll("rect")
    .data(data_five)
    .enter()
    .append("rect")
    .attr("width", x.bandwidth())
    .attr("x", d => x(d.drama))
    .style("fill", "#00b3bc")
    .attr("y", d => y(0))
    .attr("height", 0);

  //製作動態bar
  slice.selectAll("rect")
    .transition()
    .duration(1000)
    .delay((d, i) => i * 200)
    .attr("y", d => y(d[ratings]))
    .attr("height", function(d) {
      return y(0) - y(d[ratings]);
    });

  let format = d3.format(".2f");
  // 寫入每條bar的對應數字
  slice.selectAll("text")
    .data(data_five)
    .enter()
    .append('text')
    .attr('class', 'bar-label')
    .attr('text-anchor', 'middle')
    .attr('fill', '#fff')
    .attr('font-size', 10)
    .attr("x", d => x(d.drama) + x.bandwidth() / 2)
    .attr("y", d => y(0))
    .attr("display", "none")
    .text(d => d[ratings]);

  //製作動態text
  slice.selectAll("text")
    .transition()
    .duration(1000)
    .delay((d, i) => i * 200)
    .attr("display", "")
    .attr("y", d => y(d[ratings]) + 20)
    .tween("string", d => {
      let i = d3.interpolate(0, d[ratings]);
      return function(t) {
        this.textContent = format(i(t).toString());
      }
    });
}

// setBarGraph("average");