let current_ratings = "average";
let links = [];
let nodes = [];
let showCasts = true;
let sy;
let ey;
// split casts into array
for (let d of dataOriginal) {
  d.id = d.drama;
  d.casts = d.casts.split(",");
}

let slider_width = $("#slider-wrapper").width();
//range slider of years
let mySlider = new rSlider({
  target: '#slider',
  values: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019],
  range: true, // range slider
  set: [2010, 2011], // an array of preselected values
  width: slider_width,
  scale: true,
  labels: true,
  tooltip: true,
  step: null, // step size
  disabled: false, // is disabled?
  onChange: function(vals) {
    year_vals = vals.split(",");
    sy = year_vals[0];
    ey = year_vals[1]
    setUpData(sy, ey);
    setGraph();
    setBarGraph(current_ratings);
  }
});

setUpData(2010, 2011);

function setUpData(startYear, endYear) {
  // console.log("現在年份：" + startYear + "," + endYear);

  //因為一次十年node實在太多，先限定
  data = dataOriginal.filter((item, index, array) => (item.year >= startYear) && (item.year <= endYear));


  //get unique years
  let years = [];
  let uniqueYears = [];
  for (let d of data) {
    if (uniqueYears.indexOf(d.year.toString()) == -1) {
      let obj = {
        id: d.year
      };
      years.push(obj);
      uniqueYears.push(d.year.toString());
    }
  }
  // console.log("years: ", years);

  //define the max ratings for the years nodes' adius
  maxRatings = data[0].average;
  // console.log(maxRatings);

  // get unique casts
  let casts = [];
  let uniqueCasts = [];
  for (let d of data) {
    for (let cast of d.casts) {
      if (uniqueCasts.indexOf(cast) == -1) {
        if (showCasts) {
          let obj = {
            id: cast,
            cast: cast,
            opacity: 1
          };
          casts.push(obj);
          uniqueCasts.push(cast);
        } else {
          let obj = {
            id: cast,
            cast: cast,
            opacity: 0
          };
          casts.push(obj);
          uniqueCasts.push(cast);
        }

        //casts.push(cast);
      }
    }
  }
  //console.log("casts: ", casts);

  // setup links
  links = [];
  nodes = [];
  // for (let d of data) {
  //   //for years and dramas
  //   let obj = {
  //     source: d.year.toString(),
  //     target: d.drama
  //   };
  //   links.push(obj);
  //
  //   //for dramas and casts
  //   for (let cast of d.casts) {
  //     let obj = {
  //       source: d.drama,
  //       target: cast
  //     };
  //     links.push(obj);
  //   }
  // }
  // console.log("links: ", links);

  if (showCasts) {
    for (let d of data) {
      //for years and dramas
      let obj = {
        source: d.year.toString(),
        target: d.drama,
        opacity: 1
      };
      links.push(obj);

      //for dramas and casts
      for (let cast of d.casts) {
        let obj = {
          source: d.drama,
          target: cast,
          opacity: 1
        };
        links.push(obj);
      }
    }

    nodes = (years.concat(data)).concat(casts);
  } else {
    for (let d of data) {
      //for years and dramas
      let obj = {
        source: d.year.toString(),
        target: d.drama,
        opacity: 1
      };
      links.push(obj);

      //for dramas and casts
      for (let cast of d.casts) {
        let obj = {
          source: d.drama,
          target: cast,
          opacity: 0
        };
        links.push(obj);
      }
    }

    nodes = (years.concat(data)).concat(casts);
  }

  // setup nodes
  // nodes = [];
  // nodes = (years.concat(data)).concat(casts);
  // console.log("nodes: ", nodes);
}

function dataSorting(ratings) {
  if (ratings == "average") {
    data = data.sort(function(a, b) {
      return a.average < b.average ? 1 : -1;
    })
    // console.log("data sorted by average:", data);
  } else if (ratings == "first") {
    data = data.sort(function(a, b) {
      return a.first < b.first ? 1 : -1;
    })
    // console.log("data sorted by fisrt:", data);
  } else {
    data = data.sort(function(a, b) {
      return a.last < b.last ? 1 : -1;
    })
    // console.log("data sorted by last:", data);
  }
  // let drama data be sorted by descending of average

}
$("#showCasts").on("click", function() {
  if ($(this).prop("checked")) {
    showCasts = false;
    setUpData(sy, ey);
    setGraph();
  } else {
    showCasts = true;
    setUpData(sy, ey);
    setGraph();
  }
})
$(".rating_btn").on("click", () => {
  current_ratings = $("input[name='ratings']:checked").val();
  dataSorting(current_ratings);
  setGraph();
  setBarGraph(current_ratings);
})