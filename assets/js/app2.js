var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select(".bubblechart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params for x-axis
var chosenXAxis = "ZipCode";

// Initial Params for y-axis
var chosenYAxis = "Mean";

// function used for updating x-scale var upon click on axis label
function xScale(DemoData, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(DemoData, d =>  d[chosenXAxis])-1, d3.max(DemoData, d =>  d[chosenXAxis])])
      .range([0, width]);
    return xLinearScale;
  }
  
  // function used for updating y-scale var upon click on axis label
  function yScale(DemoData, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(DemoData, d => d[chosenYAxis])-1, d3.max(DemoData, d => d[chosenYAxis])])
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

    var xlabel = "ZipCode";
    var ylabel = "Mean";
    
    if (chosenYAxis === "Mean") {
      ylabel = "Mean";
    }
	else if (chosenYAxis === "Median") {
      ylabel = "Median)";
    }
    else if (chosenYAxis === "Max") {
      ylabel = "Max";
    }
    else {
      ylabel = "Min";
    }
  
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([100, 0])
        .html(function(d) {
          return (`${d.zipcode}<br><br>${ylabel}: ${d[chosenYAxis]}`);
        });
  
        circlesGroup.call(toolTip);
  
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
	  d3.select(this)
        .transition()
        .duration(1000)
        .attr("r", 100)
		.attr("fill", "red")
		.attr("opacity", ".6");
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
		d3.select(this)
        .transition()
        .duration(1000)
        .attr("r", 20)
		.attr("fill", "blue")
		.attr("opacity", ".5");
      });
  
    return circlesGroup;
  }

// Retrieve data from the CSV file and execute everything below
d3.csv("./Group_by_zip.csv")
	.then(function(DemoData, err) {
    if (err) throw err;
  
    // parse data
    DemoData.forEach(function(data) {
      data.zipcode = +data.ZipCode;
      data.mean = +data.Mean;
      data.median = +data.Median;
      data.max = +data.Max;
      data.min = +data.Min;
    });
  
// xLinearScale function above csv import
var xLinearScale = xScale(DemoData, chosenXAxis);
  
// yLinearScale function above csv import
var yLinearScale = yScale(DemoData, chosenYAxis);

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
var circlesGroup = chartGroup.selectAll("circle")
.data(DemoData)
.enter()
.append("circle")
.attr("cx", d => xLinearScale(d[chosenXAxis]))
.attr("cy", d => yLinearScale(d[chosenYAxis]))
.attr("r", 20)
.attr("fill", "blue")
.attr("opacity", ".5")
;


// append initial circles labels
  var textGroup = chartGroup.selectAll()
    .data(DemoData)
    .enter()
    .append("text")
	.attr("font-family", "sans-serif")
	.attr("font-weight", "bold")
    .attr("font-size", 12)
    .attr("dy", "0.35em")
	.attr("x", d => xLinearScale(d[chosenXAxis]) -8)
	.attr("y", d => yLinearScale(d[chosenYAxis]))


// Create group for x-axis labels
var labelsGroup = chartGroup.append("g")
.attr("transform", `translate(${width / 2}, ${height + 20})`);

var ZipLabel = labelsGroup.append("text")
.attr("x", 0)
.attr("y", 20)
.attr("value", "zipcode") // value to grab for event listener
.classed("active", true)
.text("ZipCode");

// Create group for x-axis labels
var labelsYGroup = chartGroup.append("g")
.attr("transform", "rotate(-90)");

var MeanLabel = labelsYGroup.append("text")
.attr("x", - (height / 2))
.attr("y", -40)
.attr("dy", "1em")
.attr("value", "mean") // value to grab for event listener
.classed("active", true)
.text("Mean");

var MedianLabel = labelsYGroup.append("text")
.attr("x", - (height / 2))
.attr("y", -60)
.attr("dy", "1em")
.attr("value", "median") // value to grab for event listener
.classed("inactive", true)
.text("Median");

var MaxLabel = labelsYGroup.append("text")
.attr("x", 0 - (height / 2))
.attr("y", -80)
.attr("dy", "1em")
.attr("value", "max") // value to grab for event listener
.classed("inactive", true)
.text("Max");

var MinLabel = labelsYGroup.append("text")
.attr("x", 0 - (height/2))
.attr("y", -100)
.attr("dy", "1em")
.attr("value", "min") // value to grab for event listener
.classed("inactive", true)
.text("Min");


// updateToolTip function above csv import
var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis ,circlesGroup);

// x axis labels event listener
labelsGroup.selectAll("text")
  .on("click", function() {
    // get value of selection
    var value = d3.select(this).attr("value");
    
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
    ZipLabel
        .classed("active", true)
        .classed("inactive", false);
          
    }
  });

  //y-axis labels event listener
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
      
      if (value === "Mean") {
  
        MinLabel
          .classed("active", false)
          .classed("inactive", true);
        MaxLabel
          .classed("active", false)
          .classed("inactive", true);
		MedianLabel
          .classed("active", false)
          .classed("inactive", true);
        MeanLabel
          .classed("active", true)
          .classed("inactive", false);
      }
	  
      else if (value === "Median") {
          
        MinLabel
          .classed("active", false)
          .classed("inactive", true);
        MaxLabel
          .classed("active", false)
          .classed("inactive", true);
		MedianLabel
          .classed("active", true)
          .classed("inactive", false);
        MeanLabel
          .classed("active", false)
          .classed("inactive", true);
      }
      
      else if (value === "Max") {
          
        MinLabel
          .classed("active", false)
          .classed("inactive", true);
        MaxLabel
          .classed("active", true)
          .classed("inactive", false);
		MedianLabel
          .classed("active", false)
          .classed("inactive", true);
        MeanLabel
          .classed("active", false)
          .classed("inactive", true);
      }
      
      else if (value === "Min") {
          
        MinLabel
          .classed("active", true)
          .classed("inactive", false);
        MaxLabel
          .classed("active", false)
          .classed("inactive", true);
		MedianLabel
          .classed("active", false)
          .classed("inactive", true);
        MeanLabel
          .classed("active", false)
          .classed("inactive", true);
      }
      
      
    }
  });

}).catch(function(error) {
console.log(error);
});

  
 