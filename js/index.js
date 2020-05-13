
//因為一次十年node實在太多，先限定一年
data=data.filter((item, index, array) => item.year == 2010);

// split casts into array
for (let d of data) {
  d.id = d.drama;
  d.casts = d.casts.split(",");
}
console.log(data);

// get unique casts
let casts = [];
for (let d of data) {
  for (let cast of d.casts) {
    if (casts.indexOf(cast) == -1) {
      let obj = {
        id: cast
      };
      casts.push(obj);
    }
  }
}
console.log(casts);

// setup links
let links = [];
for (let d of data) {
  for (let cast of d.casts) {
    let obj = {
      source: d.drama,
      target: cast
    };
    links.push(obj);
  }
}
console.log(links);

// setup nodes
let nodes = [];
nodes = data.concat(casts);
console.log(nodes);