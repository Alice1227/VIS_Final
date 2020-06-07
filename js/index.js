//因為一次十年node實在太多，先限定
data = data.filter((item, index, array) => (item.year >= 2010) && (item.year <= 2011));
console.log(data)

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

// split casts into array
for (let d of data) {
  d.id = d.drama;
  d.casts = d.casts.split(",");
}
console.log("data", data);

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
let links = [];
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
let nodes = [];
nodes = (years.concat(data)).concat(casts);
console.log("nodes: ", nodes);