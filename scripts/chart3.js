(function(){

var margin = {top: 350, right: 200, bottom: 90, left: 220};
 width = 600,
 height = 3000;

var x = d3.scale.linear()
    .range([0, width/2]);

var y = d3.scale.ordinal();

var chart = d3.select(".chartDiv3")
	.append("svg")
    .attr("width", "3000px");

var color = d3.scale.ordinal()
    .range(["#89182b", "#aa1f37", "#bb625d"]);

d3.csv("scripts/data_file.csv", function(error, data) {

	// data.forEach(function(d){
	// 	d.money = color.domain().map(function(source){
	// 		return {source:d.Source, amsount = +d.Amount }
	// 	})
	// })

	// var keys = color.domain(d3.keys(data[0]).filter(function(key) { return key; }));

	// data.forEach(function(d){
	// 	var y0 = 0;
	// 	d.money = color.domain().map(function(name){
	// 		return {name:name, y0: +d[name], amount:d.Amount};
	// 	}) 

	// });

var barHeight = 20;
var holdArray = [];

var stringInfo = "";

	data.forEach(function(d, i){
		stringInfo = d.Source + "  " + d.Amount;
		holdArray[i] = stringInfo;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                

	});


  x.domain([0, d3.max(data, function(d) { return +d.Amount; })]);
  y.domain(data.map(function(d){return d.Source}));



  var bar = chart.selectAll("g")
      .data(data)
      .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  bar.append("rect")
      .attr("width", function(d) { 
      	return x(d.Amount); })
      .attr("height", 20)
      .attr("class", "rectBars3")
      .style("fill", function(d){
      	return color(d.Source);
      });


var legend = chart.selectAll(".legend")
      .data(color.domain().slice())
      .enter().append("g")
      .attr("transform", function(d, i) { return "translate(10," + i*25 +")"; })
      .attr("class", "legend");

      
  legend.append("rect")
      .attr("x", width - 15)
      .attr("width", 15)
      .attr("height", 15)
      .style("fill", color);


var legend_text = legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .attr("class", "legend-text")
      .style("text-anchor", "end")
      .text(function(d) { return d; })

var tl = 0;


var number_legend = chart.selectAll(".legend2")
                        .data(data)
                        .enter().append("g")
                        .attr("transform", function(d, i){
                          return "translate(3," + i*25 + ")";
                        })
                        .attr("class", "legend");



var number_text = legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .attr("class", "number-text")
      .style("text-anchor", "end")
      .text(function(d) { return d.Amount; })

// var agency = chart.selectAll(".agency")
//       .data(data)
//       .enter().append("g")
//       .attr("class", "g")
//       .attr("transform", function(d) { return "translate(" + x(d.Source) + ",0)"; });

//  	 agency.append("text")
//  	 	 .attr("x", function(d){
//  	 	 	return x(d.Amount)-40;
//  	 	 })
//  	 	 .attr("y", function(d, i){
//  	 	 	return i*18;
 	 	 	
//  	 	 })
//  	 	 .text(function(d){
//  	 	 	return d.Amount;

//  	 	 });

 	 	 
});


})();
