//因為一次十年node實在太多，先限定一年
data=data.filter((item, index, array) => item.year == 2010);

for (let d of data) {
  d.id = d.drama;
  d.casts = d.casts.split(",");
}
console.log(data);

let casts = [];

for (let d of data) {
  for (let c of d.casts) {
    if (casts.indexOf(c) == -1) {
      let obj = {
        id: c
      }
      casts.push(obj);
      //$("body").append(c);
    }
  }
}
console.log(casts);

function link(source, target) {
  this.source = source;
  this.target = target;
}

let links = [];
for (let d of data) {
  for (let c of d.casts) {
    links.push(new link(d.drama, c));
  }
}

console.log(links);

let nodes = [];
nodes = data.concat(casts);
console.log(nodes);