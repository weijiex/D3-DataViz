//setup spacing size
var svg_w = 960;
var svg_h = 700;
var margin = {top: 90, right: 15, bottom: 180, left: 110};
var width = svg_w - margin.left - margin.right;
var height = svg_h - margin.top - margin.bottom;

//load, manipulate and sort dataset
var dataset;
d3.json("data.json", function(error, data) {
	if (error) {console.log(error);}

	data.forEach(function(d) {
		d.Number = +d.Number; 
		d.ID = +d.ID;
	})

	dataset = data;

	dataset.sort(function(x, y) {
		return d3.ascending(x.Number, y.Number);
	});

	createBarchart(dataset);
});


function createBarchart() {

		//create svg, svg g element
		var svg = d3.select("#chart")
				    .append("svg")
				    .attr("width", svg_w)
				    .attr("height", svg_h)
				    
		var g = svg.append("g")
			    	.attr("transform", "translate("+ margin.left + "," + margin.top*2.3 + ")");

		//setup x, y, color scale
		var yScale = d3.scaleLinear()
						.domain(d3.extent(dataset, function(d) { return d.Number;}))
						.range([0,height])
						.nice();

		var xScale = d3.scaleBand()
						.domain(dataset.map(function (d) {return d.Geography;}))
						.rangeRound([0, width]);
						

		var colorScale = d3.scaleOrdinal()
					        .domain(dataset, function(d) {return d.Borough})
					        .range(['#fae3e3', '#f7d4bc', '#cfa5b4', '#c98bb9', '#846b8a']);

		//add x axis			        	
		g.append("g")
			.call(d3.axisTop(xScale))
			.selectAll("text")
			.attr("y", -10)
		    .attr("x", -15)
		    .attr("transform", "rotate(-25)")
		    .style("text-anchor", "start");

		//add y axis
		g.append("g")
			.call(d3.axisLeft(yScale));

		//create bars
		var barwidth = width / (dataset.length + 1);
		g.selectAll(".bar")
		    .data(dataset) 
		    .enter()
		    .append("rect") 
		    .attr("x", function(d, i){ return i * Math.round(barwidth) + 0.8 })
		    .attr("y", 1)
		    .attr("width", barwidth - 1.6)
		    .attr("height", function(d){ return yScale(d.Number) })
		    .attr("fill", function(d) { return colorScale(d.Borough); });

		//add text lable for x axis
		g.append("text")             
			.attr("transform", "translate("+ width/2 + "," + (-margin.top) + ")")
			.style("text-anchor", "middle")
			.text("Community District")
			.attr("dy", "1.8em")
			.attr("dx", "1em")
			.attr("class", "label");

		//add text lable for y axis
		g.append('text')
			.attr("transform", "translate(" + (-margin.left/2) + " ," + (height) + ")" + "rotate(-90)")
		    .attr("text-anchor", "right")
		    .text("Number of Adults with Asthma (rounded to the nearest 1,000)")	            
			.attr("dx", "3em")
		    .attr('class', 'label');
		   
		//add legend
		//reference: http://zeroviscosity.com/d3-js-step-by-step/step-3-adding-a-legend
		var legend = g.append('g')			  		
					    .selectAll('.legend')
					    .data(['Bronx', 'Queens', 'Brooklyn', 'Manhattan', 'Staten Island'])
					    .enter()
					    .append('g')
					    .attr('class', 'legend')
					    .attr("transform", function(d, i) { 
					    	return "translate(" + (margin.left-90) + ',' + (height-margin.bottom/2.3+i*16) + ")"; 
					    		});

		legend.append("rect")
				.attr("fill", colorScale)
			    .attr("width", 15)
			    .attr("height", 15)
			    .attr('rx', 2)
		        .attr('ry', 2);
			    

		legend.append("text")
				.text(function(d) { return d; })
			    .attr("x", 18)
			    .attr("y", 15/2)
			    .attr("dy", "0.4em");	            

		//add legend header, title, subtitle, caption
		g.append('text')
		    .attr('font-size', 14)
		    .attr("transform", "translate(" + (margin.left-90) + ',' + (height-margin.bottom/2.3-5) + ")")
		    .text("Borough")
		    .attr('class', 'label');

		g.append('text')
		    .attr("transform", "translate(" + (margin.left*0.7) + " ," + (-margin.top*1.6) + ")")
		    .text("2014 Adults with Asthma in the Past 12 Months")
		    .attr("class", "title");

		g.append('text')
		    .attr("transform", "translate(" + (margin.left*1.5) + " ," + (-margin.top*1.35) + ")")
		    .text("Examing the distribution on NYC community district level")
		    .attr("class", "subtitle");

		g.append('text')
		    .attr("transform", "translate(" + (width-margin.right*19) + ',' + (height+30) + ")")
		    .text("Source: NYC Environment & Health Data Portal")
		    .attr("class", "caption");
		}

