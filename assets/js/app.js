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
var chosenXAxis = "sqft";

// Initial Params for y-axis
var chosenYAxis = "price";

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

    var xlabel = "SqFt";
    var ylabel = "Price";
  
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([100, 0])
        .html(function(d) {
          return (`${d.ZipCode}<br>${xlabel}: ${d[chosenXAxis]}<br>${ylabel}: ${d[chosenYAxis]}`);
        });
  
        circlesGroup.call(toolTip);
  
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
	  d3.select(this)
        .transition()
        .duration(1000)
        .attr("r", 60)
		.attr("opacity", ".7");
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
		d3.select(this)
        .transition()
        .duration(1000)
        .attr("r", 20)
		.attr("opacity", ".5");
      });
  
    return circlesGroup;
  }

/* // Retrieve data from the CSV file and execute everything below */
// d3.csv("./CSVs/Redfin_Scrape.csv")
d3.json("./assets/data/current_listing.json")
	.then(function(DemoData, err) {
    if (err) throw err;
  
    // /* parse data */
    DemoData.forEach(function(data) {
      data.sqft = +data.SqFt;
      data.price = +data.Price;	  
    });
  
  
// /* xLinearScale function above csv import */
var xLinearScale = xScale(DemoData, chosenXAxis);
  
// /* // yLinearScale function above csv import */
var yLinearScale = yScale(DemoData, chosenYAxis);

// /* // Create initial axis functions */
var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);

/* // append x axis */
var xAxis = chartGroup.append("g")
.classed("x-axis", true)
.attr("transform", `translate(0, ${height})`)
.call(bottomAxis);

var yAxis = chartGroup.append("g")
.classed("y-axis", true)
.call(leftAxis);

/* // append initial circles */
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


/* // append initial circles labels */
  var textGroup = chartGroup.selectAll()
    .data(DemoData)
    .enter()
    .append("text")
	.attr("font-family", "sans-serif")
	.attr("font-weight", "bold")
    .attr("font-size", 12)
    .attr("dy", "0.35em")
	.attr("x", d => xLinearScale(d[chosenXAxis]) -8)
	.attr("y", d => yLinearScale(d[chosenYAxis]));


// /* // Create group for x-axis labels */
var labelsGroup = chartGroup.append("g")
.attr("transform", `translate(${width / 2}, ${height + 20})`);

var SqFtLabel = labelsGroup.append("text")
.attr("x", 0)
.attr("y", 20)
.attr("value", "sqft") // value to grab for event listener
.classed("active", true)
.text("SqFt");

/* Create group for x-axis labels */
var labelsYGroup = chartGroup.append("g")
.attr("transform", "rotate(-90)");

var PriceLabel = labelsYGroup.append("text")
.attr("x", - (height / 2))
.attr("y", -80)
.attr("dy", "1em")
.attr("value", "price") 
.classed("active", true)
.text("Price");

var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis ,circlesGroup);  

}).catch(function(error) {
console.log(error);
});

  
// d3.json("./assets/data/sold_listing.json")
	// .then(function(DemoData, err) {
    // if (err) throw err;
  
    // /* // parse data */
    // DemoData.forEach(function(data) {
      // data.sqft = +data.SqFt;
      // data.price = +data.Price;	  
    // });
  
  
// /* // xLinearScale function above csv import */
// var xLinearScale = xScale(DemoData, chosenXAxis);
  
/* // yLinearScale function above csv import */
// var yLinearScale = yScale(DemoData, chosenYAxis);

/* // Create initial axis functions */
// var bottomAxis = d3.axisBottom(xLinearScale);
// var leftAxis = d3.axisLeft(yLinearScale);

// /* // append x axis */
// var xAxis = chartGroup.append("g")
// .classed("x-axis", true)
// .attr("transform", `translate(0, ${height})`)
// .call(bottomAxis);

// var yAxis = chartGroup.append("g")
// .classed("y-axis", true)
// .call(leftAxis);

// /* // append initial circles */
// var circlesGroup = chartGroup.selectAll("circle")
// .data(DemoData)
// .enter()
// .append("circle")
// .attr("cx", d => xLinearScale(d[chosenXAxis]))
// .attr("cy", d => yLinearScale(d[chosenYAxis]))
// .attr("r", 20)
// .attr("fill", "red")
// .attr("opacity", ".5")
// ;


// /* // append initial circles labels */
  // var textGroup = chartGroup.selectAll()
    // .data(DemoData)
    // .enter()
    // .append("text")
	// .attr("font-family", "sans-serif")
	// .attr("font-weight", "bold")
    // .attr("font-size", 12)
    // .attr("dy", "0.35em")
	// .attr("x", d => xLinearScale(d[chosenXAxis]) -8)
	// .attr("y", d => yLinearScale(d[chosenYAxis]));


/* // Create group for x-axis labels */
// var labelsGroup = chartGroup.append("g")
// .attr("transform", `translate(${width / 2}, ${height + 20})`);

// var SqFtLabel = labelsGroup.append("text")
// .attr("x", 0)
// .attr("y", 20)
// .attr("value", "sqft") // value to grab for event listener
// .classed("active", true)
// .text("SqFt");

// /* Create group for x-axis labels */
// var labelsYGroup = chartGroup.append("g")
// .attr("transform", "rotate(-90)");

// var PriceLabel = labelsYGroup.append("text")
// .attr("x", - (height / 2))
// .attr("y", -80)
// .attr("dy", "1em")
// .attr("value", "price") 
// .classed("active", true)
// .text("Price");

// var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis ,circlesGroup);  

// }).catch(function(error) {
// console.log(error);
// });