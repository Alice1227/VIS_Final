// split casts into array
for (let d of dataOriginal) {
  d.id = d.drama;
  d.casts = d.casts.split(",");
}

//range slider of years
var data_year = [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019];
var sliderRange = d3
    .sliderBottom()
    .min(d3.min(data_year))
    .max(d3.max(data_year))
    .width(500)
    .tickFormat(d3.format('.0f'))
    .ticks(10)
    .tickValues(data_year)
    .default([2010, 2011])
    .fill('#2196f3')
    .on('onchange', val => {
      d3.select('p#value-range').text(val.map(d3.format('.0f')).join('-'));
      val=val.map(d3.format('.0f'));
      setUpData(val[0],val[1]);
      // console.log(val);
    });

  var gRange = d3
    .select('div#slider-range')
    .append('svg')
    .attr('width', 500)
    .attr('height', 100)
    .append('g')
    .attr('transform', 'translate(30,30)');

  gRange.call(sliderRange);

  d3.select('p#value-range').text(
    sliderRange
      .value()
      .map(d3.format('.0f'))
      .join('-')
  );

setUpData(2010,2011);

function setUpData(startYear,endYear){
  console.log(startYear+","+endYear);

  //因為一次十年node實在太多，先限定
  data = dataOriginal.filter((item, index, array) => (item.year >= startYear) && (item.year <= endYear));

  //get unique years
  let years = [];
  let uniqueYears = [];
  for (let d of data){
    if (uniqueYears.indexOf(d.year.toString()) == -1) {
      let obj = {
        id: d.year
      };
      years.push(obj);
      uniqueYears.push(d.year.toString());
    }
  }
  console.log("years: ", years);

  

  // let drama data be sorted by descending of average
  data = data.sort(function (a,b){
    return a.average < b.average ? 1:-1;
  })
  console.log("data sorted by average:", data);

  //define the max ratings for the years nodes' adius
  maxRatings=data[0].average;
  console.log(maxRatings);

  // get unique casts
  let casts = [];
  let uniqueCasts = [];
  for (let d of data) {
    for (let cast of d.casts) {
      if (uniqueCasts.indexOf(cast) == -1) {
        let obj = {
          id: cast,
          cast: cast
        };
        casts.push(obj);
        uniqueCasts.push(cast);
        //casts.push(cast);
      }
    }
  }
  console.log("casts: ", casts);

  // setup links
  links = [];
  for (let d of data) {
    //for years and dramas
    let obj = {
      source: d.year.toString(),
      target: d.drama
    };
    links.push(obj);

    //for dramas and casts
    for (let cast of d.casts) {
      let obj = {
        source: d.drama,
        target: cast
      };
      links.push(obj);
    }
  }
  console.log("links: ", links);

  // setup nodes
  nodes = [];
  nodes = (years.concat(data)).concat(casts);
  console.log("nodes: ", nodes);
}
