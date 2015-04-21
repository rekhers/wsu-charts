(function(){
var margin = {top: 50, right: 120, bottom: 90, left: 80},
    width = 1200 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom; 

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .rangeRound([height, 0]);

var color = d3.scale.ordinal()
    .range(["#7F0014", "gray", "#ac1b37", "#b48484"]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

//there's a comma formatter method in axis class
var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");
    // .tickFormat(d3.format("1s"));

var percent_increase = [0.9, 10.8, 5.1, 10.1];


d3.csv("scripts/wsu-data-no-total.csv", function(error, data) {
var keys = color.domain(d3.keys(data[0]).filter(function(key) { return key !== "Year"; }));


var holder = [];

  data.forEach(function(d, i) {
    var y0 = 0;
    var students = 0;
    d.campuses = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name], year:d.Year}; })
    d.total = d.campuses[d.campuses.length - 1].y1;
    d.students = d.y1 - d.y0;
      


  });


 x.domain(data.map(function(d) { return d.Year; }));
 y.domain([0, d3.max(data, function(d) { return d.total; })]);



/*
    BAR CHART STUFF

*/


var data_hash = {};
var holder = [];
var data_array = [];





function commaHandler(students){
        if(students > 999){
        var string_students = students.toString(),
        end_students = string_students.slice(-4, -1),
        beg_students = string_students.slice(0, -3)
        string_students = beg_students + "," + end_students;
        return string_students;
    }
    else{
      return students;
    }
}



var tip = d3.tip()
   .attr('class', 'd3-tip')
   .offset([-25, 95])
   .html(function(d) {
    //make an array that associates values with years 
    var students = d.y1 - d.y0;

    var thisYear = d.year;

    var endSlice = d.year.slice(5, 7);
    var yearInt = parseInt(endSlice);
    var lastYear = thisYear - 1; 
    var diff_hash = {};
    var numbIncrease = [];
    var holdArray = [];
    var pullman_hash = {};


//returns an associative array with years as keys and students as strings for each campus
 




//returns a value at an index for an associated array
 function valueForIndex(obj, index) {
          var i = 0;
          for(val in obj){
            if(i++ == index){
              return obj[val];
            }
          }
      }


//returns the associated array that you pass into makeData
function makeData(campus){
      data.forEach(function(d, i){
        while(i < data.length){
        holdArray[data[i].Year] = data[i][campus];
        i++;
        }
    });
      return holdArray; 
}

function numberDiff(obj, keys, year){
    for(val in obj){
          var string_year = year.toString();
          for(var f = 0; f < keys.length; f++){
            if(keys[f] == "undefined"){
              return "";
            }
             if(keys[f]== string_year) {
              return valueForIndex(obj, f);
          }
          }    
        }
  }


  function percentDiff(obj, keys, year){
        for(val in obj){
          var string_year = year.toString();
          for(var f = 0; f < keys.length; f++){
            if(keys[f] == "undefined"){
              return "";
            }
             if(keys[f]== string_year) {
              return valueForIndex(obj, f);
          }
          }    
        }

  }

//this one converts into ints and calculates difference
// next up: in this or pass to a separate function: calculate percent increase or decrease 
  function getDiffArr(campus, year){
    var campus_diffs = [];
    var percent_diffs = [];
    var counter = 1;
    for(val in makeData(campus)){
        var thisNumb = parseInt(valueForIndex(makeData(campus), counter));
        var lastNumb = parseInt(valueForIndex(makeData(campus), (counter - 1)));
        var numbDiff = thisNumb - lastNumb;
        var percentDifference = 100*(thisNumb - lastNumb)/thisNumb;
        var campus_keys = Object.keys(holdArray);
        var diff_keys = Object.keys(campus_diffs);
        var perc_keys = Object.keys(percent_diffs); 

        campus_diffs[campus_keys[counter]] = numbDiff;
        percent_diffs[campus_keys[counter]] = percentDifference;

        counter++;
      }

      return [(percentDiff(percent_diffs, perc_keys, year)), (numberDiff(campus_diffs, diff_keys, year))];

        }


      function formatNumb(campus, year){
          var arr = getDiffArr(campus, year);
          //this is causing an error but doesn't seem to be breaking anything -- look into it later
          var str = arr[1].toString();
          var plus = "<i class='fa fa-plus' style='color:steelBlue'></i>";
          var minus = "<i class='fa fa-minus' style='color:steelBlue'></i>" + " ";

          if(str.charAt(0) !== "-"){
            var ret_string = plus + " " + str;
            return ret_string;
          }
          else{
           var ret_string = str.replace("-", minus);
           return ret_string;
          }  
         

      }


      function formatPercent(campus, year){
          var arr = getDiffArr(campus, year);
          var str = arr[0].toString();
          str = str.slice(0, 4);
          var up_arrow = "<i style='color:steelBlue;' class='fa fa-long-arrow-up'></i>";
          var down_arrow = "<i style='color:steelBlue;' class='fa fa-long-arrow-down'></i>";

          if(str.charAt(0) == "-"){
            var percent = down_arrow + " " + str + "%";
          }
          else{
            var percent = up_arrow + " " + str + "%";

          }

          return percent;

        }


  

    if(d.name == "Pullman"){  
          return "<span style='color:black'>" + "<strong>" + "<div id='mapDiv'>" + "</div>" + d.name + " " + "(" + d.year + ")" + "</strong>" + "</br>" + "<div class='studentLine'>" + "<p class='studentHeader'>" + "Number of Students: " + "<span class='studentCount'>" + commaHandler(d.y1) + "</span>" + "</div>" + "<div class='studentCount'>" + formatNumb(d.name, d.year) + "</div>" + "</br>" + "<div class='studentCount'>" + formatPercent(d.name, d.year) + "</div>" + "</span>";
    }
    else{ 

      return "<span style='color:black'>" + "<strong>" + "<div id='mapDiv'>" + "</div>" + d.name + " " + "(" + d.year + ")" + "</strong>" + "</br>" + "<div class='studentLine'>" + 
      "<p class='studentHeader'>" + "Number of Students: " + "<span class='studentCount'>" + commaHandler(students) + "</span>" + "</div>" + "<div>" + "</div>" + "<div class='studentCount'>" + formatNumb(d.name, d.year) + "</div>" + "</br>" + "<div class='studentCount'>" + formatPercent(d.name, d.year) + "</div>" + "</span>" + "</span>";
    }
  });



   var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .call(tip);


  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text")
      .attr("class", "year-labels")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", function(d){
        return "rotate(-65)"
      });


  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .selectAll("text")
      .attr("class", "students")
      .attr("y", 6)
      .attr("dy", ".71em");


  var year = svg.selectAll(".year")
      .data(data)
      .enter().append("g")
      .attr("class", "g")
      .attr("transform", function(d) { return "translate(" + x(d.Year) + ",0)"; });


var bars = year.selectAll("rect")
      .data(function(d) { return d.campuses; })
      .enter().append("rect")
      .attr("class", "rectBars1")
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.y1); })
      .attr("height", function(d) { return y(d.y0) - y(d.y1); })
      .style("fill", function(d) { return color(d.name); })
      .on("mouseover", tip.show)
      .on("mouseout", tip.hide)
      .on('mouseenter', function(d){
          var name = d.name;
          d3.select(this)
            .style("fill", "steelBlue");

          d3.selectAll('.legend-text')
          .style("fill", function(d){ 
                if(d == name){
                  return "steelBlue";
                }
   
      })
        })
      .on('mouseleave', function(d){
          d3.select(this)
            .style("fill", color(d.name));

          d3.selectAll('.legend-text')
            .style("fill", "black");
          


      });






 /*     
* LEGEND STUFF
*
*/




                     


  var legend = svg.selectAll(".legend")
      .data(color.domain().slice().reverse())
      .enter().append("g")
      .attr("transform", function(d, i) { return "translate(110," + i*25 +")"; })
      .attr("class", "legend");

      

  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);


var legend_text = legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .attr("class", "legend-text")
      .style("text-anchor", "end")
      .text(function(d) { return d; })
    

      .on("mouseenter", function(d){
        var name = d;
        d3.select("#tooltip")
        .style("left", (d3.event.pageX) + 50 + "px")     
        .style("top", (d3.event.pageY - 90) + "px")
        .select("#info-label")  
        .html(function(d){  
                      makeMap(name);

                      if(name== "Pullman"){
                            return "<span>" + name + "</br>" + "<span class='CAGR'>" + "Compound Annual Growth Rate: " + "</span>" + '</br>' + "<i style='color:steelBlue;' class='fa fa-long-arrow-up'></i> "  + "<span class='percentInc'>" + percent_increase[0] + "%" + "</span>"  + "</span>";
                       }
                        if(name == "Spokane"){
                          return "<span>" + name + "</br>" + "<span class='CAGR'>" + "Compound Annual Growth Rate: " + "</span>" + '</br>' + "<i style='color:steelBlue;' class='fa fa-long-arrow-up'></i> "  + "<span class='percentInc'>" + percent_increase[1] + "%" + "</span>" + "</span>";
                        }
                         if(name == "TriCities"){
                          return "<span>" + name + "</br>" + "<span class='CAGR'>" + "Compound Annual Growth Rate: " + "</span>" + '</br>' + "<i style='color:steelBlue;' class='fa fa-long-arrow-up'></i> "  + "<span class='percentInc'>" + percent_increase[2] + "%" + "</span>" + "</span>";
                        }
                         else if(name == "Vancouver"){
                          return "<span>" + name + "</br>" + "<span class='CAGR'>" + "Compound Annual Growth Rate: " + "</span>" + '</br>' + "<i style='color:steelBlue;' class='fa fa-long-arrow-up'></i>"  + "<span class='percentInc'>" + percent_increase[3] + "%" + "</span>" + "<div id='wa-map'>" + "</div>" + "</span>";
                        }



function makeMap(name){

 var $mapDiv = $(d3.select("#mapDiv"));

 if($mapDiv.has("svg")){
  $("#mapDiv svg").remove();
 }


                var w = 140;
                var h = 100;

      var svg = d3.select("#mapDiv")
      .append("svg")
      .attr("width", w)
      .attr("height", h);   


/*
  Tooltip WA Map 
*/     
      
d3.json("scripts/counties.json", function(json) {

    var projection = d3.geo.mercator()
    .scale([1]).translate([0, 0]);

    var path = d3.geo.path()
    .projection(projection);

  var b = path.bounds(json),
      s = .95 / Math.max((b[1][0] - b[0][0]) / w, (b[1][1] - b[0][1]) / h),
      t = [(w - s * (b[1][0] + b[0][0])) / 2, (h - s * (b[1][1] + b[0][1])) / 2];

  projection
      .scale(s)
      .translate(t);

     var pullmanCoords = [{"lat":46.729777, "long": -117.181738}]; 
      var spokaneCoords = [{"lat": 47.658780, "long": -117.426047}];
    //this is richland, wa
      var tricitiesCoords = [{"lat": 46.285691, "long": -119.284462}];
      var vancouverCoords = [{"lat": 45.638728 ,"long": -122.661486}];

      function getCoords(name){
        if(name == "Pullman"){
          return pullmanCoords;
        }
        if(name == "Vancouver"){
          return vancouverCoords;
        }
        if(name == "TriCities"){
          return tricitiesCoords;
        }
        if(name == "Spokane"){
          return spokaneCoords;
        }
      }


var countyMap = svg.selectAll("path")
     .data(json.features)
     .enter()
     .append("path")        
      .attr("class", "county")
      .attr("d", path)
      .style("margin", "90px");


    
var dots = svg.selectAll(".smallDots")
              .data(getCoords(name))
              .enter()
              .append("circle")
              .attr("class", "smallDots")
              .attr("cx", function(d){
                return projection([d.long, d.lat])[0];
              })
              .attr("cy", function(d){
                return projection([d.long, d.lat])[1];
              })
              .attr("r", 5)
              .style("fill", "red");
            

  });
    
}

                      })
            d3.select("#tooltip").classed("hidden", false)
                      
            
         })
     
      .on("mouseleave", function() {
      d3.select("#tooltip").classed("hidden", true)

                
          })
    
      .on("mouseover", function(d){
        legend_label = d;
          d3.select(this)
            .style("fill", "steelBlue");

          d3.selectAll('.rectBars1')
            .style("fill", function(d){
              if(d.name == legend_label){
                return "steelblue"
              }
              else{
                return "gray"
              }
            });
      })
      .on("mouseout", function(d){

        d3.select(this)
          .style("fill", "black");

         d3.selectAll('.rectBars1')
            .style("fill", function(d){
              return color(d.name);
            })
          });




});

})();





