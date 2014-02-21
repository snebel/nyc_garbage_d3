
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
    

  },
  fail: function(data){
    console.log('FAIL');
  }
})




