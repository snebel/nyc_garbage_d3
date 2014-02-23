//rendering
  var margin = {top: 40, right: 10, bottom: 10, left: 10},
  width = 1000 - margin.left - margin.right,
  height = 600 - margin.top - margin.bottom,
  color = d3.scale.category20b();

  var div = d3.select("body").append("div")
    .style("position", "relative")
    .style("width", (width + margin.left + margin.right) + "px")
    .style("height", (height + margin.top + margin.bottom) + "px")
    .style("left", margin.left + "px")
    .style("top", margin.top + "px")

  var treemap = function(){ 
    return d3.layout.treemap()
      .size([width, height])
      .sticky(true)
      .value(function(d) { return d.size; });
  }

  function render(root){
    node = div.datum(root).selectAll(".node")
      .data(treemap().nodes)
    node
      .enter().append("div")
      .attr("class", "node")
    node
      .transition().duration(2000)
      .call(position)
      .style("background", function(d) { return d.children ? color(d.name) : null; })
      .text(function(d) { console.log(d) ; return d.children ? null : d.size + ' tons'; })
      .style("color", function(d) {
        return d.dx > 25 && d.dy > 25 ? "rgba(255,255,255,1)" : "rgba(255,255,255,0)"
      })
    
    node.exit().remove();  
  }

  function position() {
    this.style("left", function(d) { return d.x + "px"; })
    .style("top", function(d) { return d.y + "px"; })
    .style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
    .style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });
  }

  d3.selectAll("input").on("change", function change() {
    var i;
    if (this.value === "All") {return render(nyc)}
    else if (this.value === "Brooklyn") {i = 0}
    else if (this.value === "Queens") {i = 1}
    else if (this.value === "Manhattan") {i = 2}
    else if (this.value === "Bronx") {i = 3}
    else if (this.value === "Staten Island") {i = 4}      

    render(nyc.children[i])
  });
//end rendering

var json;
var nyc = {
  name: "NYC",
  children: []
};

function Borough(name) {
  this.name = name;
  this.children = []
}

function sumSizes(array){
  var sum = 0;
  for (var i=0; i<array.length; i++){
    sum += parseInt(array[i].size)
  }
  return sum;
}

function District(name, trash_array){
  console.log(trash_array)
  this.name = name;
  this.children = trash_array;
  this.total = sumSizes(trash_array);
}

var borough_list = ["Manhattan", "Queens", "Brooklyn", "Staten Island", "Bronx"]
var len = borough_list.length;

for (var i=0; i<len; i++) {
  nyc.children.push(new Borough(borough_list[i]))
}

function getBoroughChildren(name){
  var districts = [];
  $(json).each(function(i, e){
    if (e[9] == name) {
      var trash_array = [
        {name:"refuse", size: e[11]},
        {name:"paper", size: e[12]},
        {name:"mgp", size: e[13]}
      ];
      var district = new District(e[10], trash_array)
      districts.push(district);
    }
  })
  return districts;
}

$.ajax({
  url: "https://data.cityofnewyork.us/api/views/ewtv-wftx/rows.json?accessType=DOWNLOAD",
  dataType: 'json',
  method: 'get',
  success: function(data){
    json = data.data;
    $(nyc.children).each(function(i, e){
      e.children = getBoroughChildren(e.name);
    });

    render(nyc);
  },
  fail: function(data){
    console.log('FAIL');
  }
})
