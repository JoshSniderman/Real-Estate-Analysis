var svgWidth = 2000;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 120
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select(".bubblechart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "SqFt";

// Initial Params
var chosenYAxis = "Price";

// function used for updating x-scale var upon click on axis label
function xScale(DemoghrapicData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(DemoghrapicData, d =>  d[chosenXAxis])-1, d3.max(DemoghrapicData, d =>  d[chosenXAxis])])
    .range([0, width]);

  return xLinearScale;

}

// function used for updating y-scale var upon click on axis label
function yScale(DemoghrapicData, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(DemoghrapicData, d => d[chosenYAxis])-1, d3.max(DemoghrapicData, d => d[chosenYAxis])])
    .range([height, 0]);

  return yLinearScale;

}

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating yAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
	.attr("cy", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}

function renderCirclesLabels(textGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

  textGroup.transition()
    .duration(1000)
    .attr("x", d => newXScale(d[chosenXAxis])-8)
	.attr("y", d => newYScale(d[chosenYAxis]));
	

  return textGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

  var xlabel;
  var ylabel;

  if (chosenXAxis === "SqFt") {
    xlabel = "SqFt.";
  }
  else if (chosenXAxis === "NumberOfBaths") {
    xlabel = "# of Baths";
  }
  else if (chosenXAxis === "Price") {
    xlabel = "Price ($)";
  }
  else {
    xlabel = "# of Beds";
  }
  
  if (chosenYAxis === "SqFt") {
    ylabel = "SqFt.";
  }
  else if (chosenYAxis === "NumberOfBaths") {
    ylabel = "# of Baths";
  }
  else if (chosenYAxis === "Price") {
    ylabel = "Price ($)";
  }
  else {
    ylabel = "# of Beds";
  }

  var toolTip = d3.tip()
	  .attr("class", "tooltip")
	  .offset([80, -60])
	  .html(function(d) {
		return (`Zipcode: ${d.ZipCode}<br>${xlabel}: ${d[chosenXAxis]}<br>${ylabel}: ${d[chosenYAxis]}`);
	  });
	  
  

  chartGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data, this);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}


//*****************filter data*****************
function filterData(data, inputValue) {
 return data.City === "Frisco";
}

// Function called by DOM changes
function getData() {
	var rows_dom = DemoghrapicData_Actual.filter(filterData);
}

// Retrieve data from the CSV file and execute everything below
d3.csv("./static/data/current_listing.csv").then(function(DemoghrapicData, err) {
	DemoghrapicData_Actual = DemoghrapicData;
	
  if (err) throw err;

  // parse data
  //html_text = ''
  var rows = DemoghrapicData_Actual.filter(filterData);
  
  DemoghrapicData = rows
  DemoghrapicData.forEach(function(data) {
    data.NumberOfBaths = +data.NumberOfBaths;
    data.NumberOfBeds = +data.NumberOfBeds;
	data.Price = +data.Price;
	data.SqFt = +data.SqFt;
	
	data.ZipCode = data.ZipCode
  });
  
  //console.log(html_text)

  // xLinearScale function above csv import
  var xLinearScale = xScale(DemoghrapicData, chosenXAxis);
  
  console.log("Linear Scale")
  console.log(xLinearScale)
  
  // yLinearScale function above csv import
  var yLinearScale = yScale(DemoghrapicData, chosenYAxis); 

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  var yAxis = chartGroup.append("g")
    .classed("y-axis", true)
    .call(leftAxis);

  // append initial circles
  
   // Add a scale for bubble color
  var myColor = d3.scaleOrdinal()
    .domain(["75033", "75034", "75035", "75036"])
    .range(d3.schemeSet2);
  
  var circlesGroup = chartGroup.selectAll("circle")
    .data(DemoghrapicData)
    .enter()
    .append("circle")
	.attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
	.style("fill", function (d) { return myColor(d.ZipCode); } )
    .attr("r", 20)
    //.attr("fill", "blue")
    .attr("opacity", ".8")
	//.select(".bubblechart>svg>g>circle").html(html_text)
	;
	
  var legendOrdinal = d3.legendColor()
  .shape("path", d3.symbol().type(d3.symbolSquare).size(150)())
  .shapePadding(10)
  .scale(myColor);
	
	
  console.log("legendOrdinal")
  console.log(legendOrdinal)
  svg.selectAll(".legendOrdinal").call(legendOrdinal);

 
 data_new = DemoghrapicData

 var textGroup = chartGroup.selectAll()
    .data(data_new)
    .enter()
    .append("text")
	//.join("text")
	.attr("font-family", "sans-serif")
	.attr("font-weight", "bold")
    .attr("font-size", 12)
    .attr("dy", "0.35em")
	.attr("x", d => xLinearScale(d[chosenXAxis]) -8)
	.attr("y", d => yLinearScale(d[chosenYAxis]))
	.attr("fill", "white");


  // Create group for x-axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var SqFtLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "SqFt") // value to grab for event listener
    .classed("active", true)
    .text("SqFt");

  var NumberOfBedsLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "NumberOfBeds") // value to grab for event listener
    .classed("inactive", true)
    .text("# of Beds");

  var NumberOfBathsLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "NumberOfBaths") // value to grab for event listener
    .classed("inactive", true)
    .text("# of Baths");

  var labelsYGroup = chartGroup.append("g")
    .attr("transform", "rotate(-90)");

  var PriceLabel = labelsYGroup.append("text")
    .attr("x", - (height / 2))
    .attr("y", -70)
	.attr("dy", "1em")
    .attr("value", "Price") // value to grab for event listener
    .classed("active", true)
    .text("Price ($)");

  var NumberOfBedsLabel2 = labelsYGroup.append("text")
    .attr("x", 0 - (height / 2))
    .attr("y", -90)
	.attr("dy", "1em")
    .attr("value", "NumberOfBeds") // value to grab for event listener
    .classed("inactive", true)
    .text("# of Beds");
   
   var NumberOfBathsLabel2 = labelsYGroup.append("text")
    .attr("x", 0 - (height/2))
    .attr("y", -110)
	.attr("dy", "1em")
    .attr("value", "NumberOfBaths") // value to grab for event listener
    .classed("inactive", true)
    .text("# of Baths");

  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis ,circlesGroup);

  // x axis labels event listener
  labelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
	  
	  console.log("Value from bubble select",value)
	  
      if (value !== chosenXAxis ) {
		  
		// replaces chosenXAxis with value
        chosenXAxis = value;

        // updates x scale for new data
        xLinearScale = xScale(DemoghrapicData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
		textGroup = renderCirclesLabels(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis ,circlesGroup);
	  
		console.log(value)

        // changes classes to change bold text
        if (value === "SqFt") {
			
          NumberOfBedsLabel
            .classed("active", false)
            .classed("inactive", true);
          SqFtLabel
            .classed("active", true)
            .classed("inactive", false);
		  NumberOfBathsLabel
			.classed("active", false)
            .classed("inactive", true);
        }
		else if (value === "NumberOfBeds") {
		
		  SqFtLabel
            .classed("active", false)
            .classed("inactive", true);
          NumberOfBathsLabel
            .classed("active", false)
            .classed("inactive", true);
		  NumberOfBedsLabel
			.classed("active", true)
            .classed("inactive", false);
		}
        else if (value === "NumberOfBaths") {
			
          NumberOfBathsLabel
            .classed("active", true)
            .classed("inactive", false);
          SqFtLabel
            .classed("active", false)
            .classed("inactive", true);
		  NumberOfBedsLabel
			.classed("active", false)
            .classed("inactive", true);
        }
		
		
      }
    });

labelsYGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
	  
	  console.log(value)
	  
      if (value !== chosenYAxis) {

        // changes classes to change bold text
		// replaces chosenXAxis with value
        chosenYAxis = value;

        // updates x scale for new data
        yLinearScale = yScale(DemoghrapicData, chosenYAxis);

        // updates x axis with transition
        yAxis = renderYAxes(yLinearScale, yAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
		textGroup = renderCirclesLabels(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
		
        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis ,circlesGroup);
        
		if (value === "Price") {
	
          NumberOfBathsLabel2
            .classed("active", false)
            .classed("inactive", true);
          NumberOfBedsLabel2
            .classed("active", false)
            .classed("inactive", true);
		  PriceLabel
			.classed("active", true)
            .classed("inactive", false);
        }
		
		else if (value === "NumberOfBeds") {
			
          PriceLabel
            .classed("active", false)
            .classed("inactive", true);
          NumberOfBedsLabel2
            .classed("active", true)
            .classed("inactive", false);
		  NumberOfBathsLabel2
			.classed("active", false)
            .classed("inactive", true);
        }
		
		else if (value === "NumberOfBaths") {
			
          NumberOfBathsLabel2
            .classed("active", true)
            .classed("inactive", false);
          PriceLabel
            .classed("active", false)
            .classed("inactive", true);
		  NumberOfBedsLabel2
			.classed("active", false)
            .classed("inactive", true);
        }
		
		
      }
    });

}).catch(function(error) {
  console.log(error);
});
