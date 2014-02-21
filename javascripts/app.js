//rendering
    var margin = {top: 40, right: 10, bottom: 10, left: 10},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    var color = d3.scale.category20c();

    var treemap = function(){ return d3.layout.treemap()
      .size([width, height])
      .sticky(true)
      .value(function(d) { return d.size; })
    }

    var div = d3.select("body").append("div")
      .style("position", "relative")
      .style("width", (width + margin.left + margin.right) + "px")
      .style("height", (height + margin.top + margin.bottom) + "px")
      .style("left", margin.left + "px")
      .style("top", margin.top + "px");

    var node;

    function render(root){
      console.log(root);
      node = div.datum(root).selectAll(".node")
        .data(treemap().nodes)
      node
        .enter().append("div")
        .attr("class", "node")
      node
        .call(position)
        .style("background", function(d) { return d.children ? color(d.name) : null; })
        .text(function(d) { return d.children ? null : d.name; })
      node.exit().transition().remove();  
      d3.selectAll("input").on("change", function change() {

        boroughs = {
          "Brooklyn": 1,
          "Manhattan": 0,
        }
        var data = root[boroughs[this.value]]
          ? function() { return 1 }
          : function(d) { 
            console.log(d);
            return d.size; };

        node 
          .data(treemap().value(value).nodes)
          .transition()
          .duration(2000)
          .call(position);

        console.log("ASDFASDF");
      });    
    }


    d3.selectAll("input").on("change", function change() {

        var value = this.value === "Manhattan"
          ? function() { return 1; }
          : function(d) { return d.size; };

        node 
          .data(treemap.value(value).nodes)
          .transition()
          .duration(2000)
          .call(position);

        console.log("ASDFASDF");
        //var value = determineBorough(root, this.value) 



        // var value = this.value === "Manhattan"
        //   // ? render(nyc.children[2])
        //   // : render(nyc);
        //   ? function(d) { return d.size; }
        //   : function(d) { return d.size; };

        // node
        //   .data(treemap.value(value).nodes)
        //   .transition()
        //   .duration(1500)
        //   .call(position);
      });


    function determineBorough(root, value) {
      if (value === "Manhattan") {
        console.log("manhattan");
        return function() { return root.children[0].size; }
      }
      else {
        console.log("return some other borugh");
        return root;
      }
    }

    function position() {
      this.style("left", function(d) { return d.x + "px"; })
      .style("top", function(d) { return d.y + "px"; })
      .style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
      .style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });
    }


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

function District(name, trash_array){
  this.name = name;
  this.children = trash_array;
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




