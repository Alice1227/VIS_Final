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