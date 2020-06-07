let width = $(window).width();
let height = $(window).height();

// let xScale = d3.scaleLinear()
//   .range([0, width]);
// let yScale = d3.scaleLinear()
//   .range([0, height]);
var svg = d3.select("svg").attr("width", width).attr("height", height);
// .attr("viewBox", `0 0 ${width} ${height}`);
// width = +svg.attr("width"),
// height = +svg.attr("height");
console.log(width, height);


//var color = d3.scaleOrdinal(d3.schemeCategory20);

//Force-Directed graph 需要使用力模擬器forceSimulation，且每個模擬器要定義三個東西：
//link連結的引力、charge點之間的引力、center引力的中心
var simulation = d3.forceSimulation(node)
  .force("link", d3.forceLink(link).id(function(d) {
    return d.id;
  }))
  .force("charge", d3.forceManyBody())
  .force("center", d3.forceCenter(width / 2, height / 2));

//繪製線、點、文字
var link = svg.append("g")
  .attr("class", "links")
  .selectAll("line")
  .data(links)
  .enter().append("line")
  .attr("stroke-width", function(d) {
    return 5;
  })
  .attr("stroke", "#999");

var node = svg.append("g")
  .attr("class", "nodes")
  .selectAll("g")
  .data(nodes)
  .enter().append("g");

var circles = node.append("circle")
circles.filter(function(d) {
    return d.drama != null
  })
  .attr("r", function(d) {
    return d.average
  })
  .attr("fill", "#fdb35d");
circles.filter(function(d) {
    return d.cast != null
  })
  .attr("r", 5)
  .attr("fill", "#a4d9d6");
circles.filter(function(d) {
    return (d.drama == null) && (d.cast == null)
  })
  .attr("r", 25)
  .attr("fill", "#e25a53");
circles.call(d3.drag()
  .on("start", dragstarted)
  .on("drag", dragged)
  .on("end", dragended));

// var lables = node.append("text")
//   .text(function(d) {
//     return d.id;
//   })
//   .attr('x', 6)
//   .attr('y', 3);

node.append("title")
  .text(function(d) {
    return d.id;
  });

//將模擬器綁定點、線
simulation
  .nodes(nodes) //產生index,vx,xy,x,y數值來做視覺化
  .on("tick", ticked); //tick為模擬器的計時器，用來監聽綁定後數據的改變

simulation.force("link")
  .links(links);

//定義ticked()，用來當tick發現數據改變時，要做的動作
function ticked() {
  link
    .attr("x1", function(d) {
      return d.source.x;
    })
    .attr("y1", function(d) {
      return d.source.y;
    })
    .attr("x2", function(d) {
      return d.target.x;
    })
    .attr("y2", function(d) {
      return d.target.y;
    });

  node
    // .attr("transformX", function(d) {
    //   if (d.x >= width || d.x <= 0) {
    //     return `translate(0)`;
    //   } else {
    //     return `translate(${d.x})`;
    //   }
    // })
    // .attr("transformY", function(d) {
    //   if (d.y >= height || d.y <= 0) {
    //     return `translate(0)`;
    //   } else {
    //     return `translate(${d.y})`;
    //   }
    // })
    .attr("transform", function(d) {
      return `translate(${d.x},${d.y})`;
    })
}

//定義拖拉的動作，因為在拖拉的過程中，會中斷模擬器，所以利用restart來重啟
function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}

//但目前有bug顯示不出來
var tool = d3.select(".tooltip");
circles.filter(function(d) {
  return d.drama != null
}).on("mousemove", function(d) {
  tool.style("left", d3.event.pageX + 10 + "px")
  tool.style("top", d3.event.pageY - 20 + "px")
  tool.style("display", "inline-block");
  tool.html(d.drama + '<br>平均收視率:' + d.average)
}).on("mouseout", function(d) {
  tool.style("display", "none");
});