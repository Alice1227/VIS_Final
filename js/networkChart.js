let width = $("#networkChart").width();
let height = 560;
let svg = d3.select("#networkChart svg").attr("width", width).attr("height", height);
let cs = [];
let uc = [];
let times = [];

let isZoomIn = false;

//根據篩選出的data繪製network圖形
function setGraph() {
  cs = [];
  uc = [];
  times = [];
  d3.selectAll("#networkChart svg g").remove();

  //繪製線、點、文字
  let link = svg.append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(links)
    .enter().append("line")
    .attr("stroke-width", 1)
    .attr("stroke-opacity", 0.3)
    .attr("stroke", "#999")
    .attr("opacity", d => d["opacity"]);

  let node = svg.append("g")
    .attr("class", "nodes")
    .selectAll("g")
    .data(nodes)
    .enter().append("g")
    .attr("opacity", (d) => {
      return d["opacity"];
    });

  //Force-Directed graph 需要使用力模擬器forceSimulation，且每個模擬器要定義三個東西：
  //link連結的引力、charge點之間的引力、center引力的中心
  let simulation = d3.forceSimulation(node)
    .force("link", d3.forceLink(link).id(function(d) {
      return d.id;
    }))
    // 在 x、y軸 方向上施加一個力把整個圖形壓扁一點
    .force('xt', d3.forceX().strength(() => 0.02))
    .force('xb', d3.forceX(width).strength(() => 0.02))
    .force('yt', d3.forceY().strength(() => 0.04))
    .force('yb', d3.forceY(height).strength(() => 0.04))
    .force("charge", d3.forceManyBody())
    // 避免節點相互覆蓋
    // .force('collision', d3.forceCollide().radius(d => maxRatings / 2))
    .force("center", d3.forceCenter(width / 2, height / 2));

  let colors = d3.scaleOrdinal(d3.schemePaired);
  let circles = node.append("g");
  //circle for drama
  circles.filter(function(d) {
      return d.drama != null;
    })
    .attr("class", "drama-node")
    .append("circle")
    .attr("r", d => d[current_ratings] * 0.8)
    .attr("fill", d => colors(d.year))
    .on('click', function(d) {
      // d3.select("#detailDiv").attr("hidden", null);
      d3.select("#detailDiv").html('<h6><b>關於『' + d.id + '』</b></h6><table class="table table-striped"><tbody><tr><td class="text-nowrap">主要演員名單</td><td>' + d.casts + '</td></tr><tr><td class="text-nowrap">集數</td><td>' + d.series + '</td></tr><tr><td class="text-nowrap">劇情簡介</td><td>' + d.introduction + '</td></tr><tr><td class="text-nowrap">平均收視率</td><td>' + d.average + ' (%)</td></tr><tr><td class="text-nowrap">首回收視率</td><td>' + d.first + ' (%)</td></tr><tr><td class="text-nowrap">終回收視率</td><td>' + d.last + ' (%)</td></tr></tbody></table>');
    });

  //建立每個演員於link出現次數 By益菕
  //console.log(links)
  for (let i = 0; i < links.length; i++) {
    if (links[i].target.id == undefined) {
      cs.push(links[i].target);
    } else {
      cs.push(links[i].target.id);
    }
  }

  //console.log(cs);
  for (let i = 0; i < cs.length; i++) {
    if (uc.indexOf(cs[i]) == -1) {
      uc.push(cs[i]);
      times.push({
        cast: cs[i],
        time: 1
      });
    } else {
      for (let j = 0; j < times.length; j++) {
        if (cs[i] == times[j].cast) {
          times[j].time++;
        }
      }
    }
  }
  // console.log(uc);
  // console.log(times);

  // circle for casts
  circles.filter(function(d) {
      return d.cast != null;
    })
    .attr("class", "cast-node")
    .append("circle")
    .attr("r", (d) => {
      let c = 0;
      let r = 2;
      for (let a = 0; a < times.length; a++) {
        if (d["cast"] === times[a]["cast"]) {
          r = r + times[a]["time"] * 1.5;
        }
      }
      return r;
    })
    .attr("fill", "#eee")
    .attr("stroke", "#888");

  //circle for years
  circles.filter(function(d) {
      return (d.drama == null) && (d.cast == null);
    })
    .attr("class", "year-node")
    .append("circle")
    .attr("r", maxRatings)
    .attr("fill", "#fff")
    .attr("stroke", d => colors(d.id))
    .attr("stroke-width", 5);

  d3.selectAll(".year-node")
    .append("text")
    .text(d => d.id)
    .attr("fill", d => colors(d.id))
    .attr("text-anchor", "middle")
    .attr("y", 5)
    .style("font-weight", "bold");

  circles.call(d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended));

  circles
    .on('click', fade());

  const textElems = svg.append('g')
    .selectAll('text')
    .data(nodes)
    .join('text')
    .text(d => {
      if (typeof(d.id) != "number") {
        return d.id;
      } else {
        return "";
      }
    })
    .attr('font-size', 10);

  textElems.call(d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended));

  textElems
    .on('click', fade());

  // tooltip的標籤
  node.append("title")
    .text(function(d) {
      if (d.casts != null) {
        // 劇
        return d.id + ": " + d[current_ratings] + "%";

      }

      if (d.cast != null) {
        // 演員
        for (let i = 0; i < times.length; i++) {
          if (d.id == times[i]["cast"]) {
            return d.id + ": " + times[i]["time"] + "部";
          }
        }
      }

      if (typeof(d.id) == "number") {
        // 年
        return d.id;
      }
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

    textElems
      .attr("x", d => d.x + 10)
      .attr("y", d => d.y)
      .attr("visibility", "hidden")
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

  //滑鼠滑過時透明度
  function fade() {
    return d => {
      isZoomIn = !isZoomIn;
      let opacity = isZoomIn ? 0.1 : 1;

      node.style('opacity', function(o) {
        return isConnected(d, o) ? d["opacity"] : opacity;
      });
      textElems.style('visibility', function(o) {
        if (showCasts) {
          return isConnected(d, o) ? "visible" : "hidden";
        } else {
          return "hidden";
        }

      });
      link.style('stroke-opacity', o => (o.source === d || o.target === d ? 1 : opacity));
      if (opacity === 1) {
        node.style('opacity', d => d["opacity"]);
        textElems.style('visibility', 'hidden');
        link.style('stroke-opacity', 0.3);
      }
    }
  }

  const linkedByIndex = {};
  links.forEach(d => {
    linkedByIndex[`${d.source.index},${d.target.index}`] = 1;
  });

  function isConnected(a, b) {
    return linkedByIndex[`${a.index},${b.index}`] || linkedByIndex[`${b.index},${a.index}`] || a.index === b.index;
  }
}