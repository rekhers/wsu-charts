(function(){ 


var margin = {top: 90, right: 120, bottom: 90, left: 120},
    width = 900 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom; 


var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .rangeRound([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

//there's a comma formatter method in axis class
var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var color = d3.scale.ordinal()
    .range(["gray", "#7F0014"]);


 d3.csv("scripts/money_data.csv", function(error, data){

	var keys = color.domain(d3.keys(data[0]).filter(function(key) { return key !== "Year"; }));

	data.forEach(function(d){
		var y0 = 0;
		d.money = color.domain().map(function(name){
			return {name:name, y0:y0, y1:y0 += +d[name], year:d.Year};
		}) 
		d.total = d.money[d.money.length-1].y1;

	});


 x.domain(data.map(function(d) { return d.Year; }));
 y.domain([0, d3.max(data, function(d) { return d.total; })]);


 var svg = d3.select(".chartDiv").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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
        return "rotate(-65)";
      })

      svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .selectAll("text")
      .attr("class", "money")
      .attr("y", 6)
      .attr("dy", ".71em");



   var year = svg.selectAll(".year")
      .data(data)
      .enter().append("g")
      .attr("class", "g")
      .attr("transform", function(d) { return "translate(" + x(d.Year) + ",0)"; });


   var bars = year.selectAll("rect")
      .data(function(d) { return d.money ; })
      .enter().append("rect")
      .attr("height", function(d) { 
        return 0; })
      .style("fill", function(d) { return color(d.name)})
      .attr("class", "rectBars")
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.y1); })
      
      .on("mouseenter", function(d){
        var name = d.name;
        console.log(d.name)
     		d3.select(this)
        	.style("fill", "steelBlue");

        d3.selectAll(".labels")
          .style("fill", function(d){
            console.log(d);
            if(d == name){
              return "steelBlue";
            }
            else{
              return color(d);
            }



          })

      })
      .on("mouseleave", function(d){
      	        d3.select(this)
      	.style("fill", color(d.name));

        d3.selectAll(".labels")
          .style("fill", function(d){
            return color(d);
          })
      })
      .transition()
      .delay(function(d, i) { return i * 700; })
      .duration(300)
      .attr('height', function(d) { 
        var barHeight = y(d.y0) - y(d.y1);
        return barHeight })
     


year.append("text")
    	.attr("x", function(d) { 
    		return 30})
    	.attr("y", function(d){
    			return 270;
				})
    .attr("dy", ".35em")
    .attr("class", "fed bar_text")
    .text(function(d) { 
    		return d.Federal;
    })


   year.append("text")
    	.attr("x", function(d) { 
    		return 30;})
    	.attr("y", function(d){
    			return 100;
				})
    .attr("dy", ".35em")
    .attr("class", "nf bar_text")
    .text(function(d) { 
    		return d.NonFederal;
    })


     year.append("text")
    	.attr("x", function(d) { 
    		return 30;})
    	.attr("y", function(d){
      var total = +d.Federal + +d.NonFederal;
      var rightHeight = height - total;
      return rightHeight;
                          	})
    .attr("dy", ".35em")
    .attr("class", "total bar_text")
    .text(function(d) { 
    		return d.total;
    })


    var legend = svg.selectAll(".legend")
      .data(color.domain().slice())
      .enter().append("g")
      .attr("transform", function(d, i) { return "translate(110," + i*25 +")"; })
      .attr("class", "legend");

var legend_text = legend.append("text")
      .attr("x", width - 24)
      .attr("y", function(d){
        if(d == "Federal"){
          return 250;
        }
        if(d == "NonFederal"){
          return 80;
        }
      })
      .attr("dy", ".35em")
      .attr("dx", function(d){
        if(d == "Federal"){
          return "-1.8em";
        }
      })
      .style("fill", function(d){
        return color(d);
      })
      .attr("class", "labels")
      .style("text-anchor", "end")
      .text(function(d) { return d; })
      .on("mouseover", function(d){
        var label = d;
        d3.select(this)
          .style("fill", "steelBlue");

        d3.selectAll(".rectBars")
          .style("fill", function(d){
            if(d.name == label){
              return "steelBlue";
            }
            else{
              return "gray";
            }
          })

      })

      .on("mouseout", function(d){
        d3.select(this)
        .style("fill", function(d){
          return color(d);
        })

        d3.selectAll(".rectBars")
          .style("fill", function(d){
           return color(d.name);

          })


      });




 })

})();