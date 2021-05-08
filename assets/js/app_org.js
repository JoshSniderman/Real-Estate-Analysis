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

// d3.csv("./assets/data/data.csv").then(function(journalData) {

  // console.log(journalData);
  // });
  
// Initial Params for x-axis
var chosenXAxis = "poverty";

// Initial Params for y-axis
var chosenYAxis = "healthcare";

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
  
    if (chosenXAxis === "poverty") {
      xlabel = "In Poverty (%)";
    }
    else if (chosenXAxis === "age") {
      xlabel = "Age (Median)";
    }
    else {
      xlabel = "Household Income (Median)";
    }
    
    if (chosenYAxis === "healthcare") {
      ylabel = "Lacks Healthcare (%)";
    }
    else if (chosenYAxis === "smokes") {
      ylabel = "Smokes (%)";
    }
    else {
      ylabel = "Obese (%)";
    }
  
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
          return (`${d.state}<br>${xlabel}: ${d[chosenXAxis]}<br>${ylabel}: ${d[chosenYAxis]}`);
        });
  
        circlesGroup.call(toolTip);
  
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
  
    return circlesGroup;
  }

// Retrieve data from the CSV file and execute everything below
d3.csv("./assets/data/data.csv").then(function(DemoghrapicData, err) {
    if (err) throw err;
  
    // parse data
    DemoghrapicData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.age = +data.age;
      data.income = +data.income;
      
      data.healthcare = +data.healthcare;
      data.smokes = +data.smokes;
      data.obesity = +data.obesity;
      data.abbr = data.abbr
    });
  
// xLinearScale function above csv import
var xLinearScale = xScale(DemoghrapicData, chosenXAxis);
  
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
var circlesGroup = chartGroup.selectAll("circle")
.data(DemoghrapicData)
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
    .data(DemoghrapicData)
    .enter()
    .append("text")
	//.join("text")
	.attr("font-family", "sans-serif")
	.attr("font-weight", "bold")
    .attr("font-size", 12)
    .attr("dy", "0.35em")
	.attr("x", d => xLinearScale(d[chosenXAxis]) -8)
	.attr("y", d => yLinearScale(d[chosenYAxis]))
	//.text(d => d.abbr)
	.text(function(d) {return d.abbr})
	.attr("fill", "white");


// Create group for x-axis labels
var labelsGroup = chartGroup.append("g")
.attr("transform", `translate(${width / 2}, ${height + 20})`);

var PovertyLabel = labelsGroup.append("text")
.attr("x", 0)
.attr("y", 20)
.attr("value", "poverty") // value to grab for event listener
.classed("active", true)
.text("In Poverty (%)");

var AgeLabel = labelsGroup.append("text")
.attr("x", 0)
.attr("y", 40)
.attr("value", "age") // value to grab for event listener
.classed("inactive", true)
.text("Age (Median)");

var IncomeLabel = labelsGroup.append("text")
.attr("x", 0)
.attr("y", 60)
.attr("value", "income") // value to grab for event listener
.classed("inactive", true)
.text("Household Income (Median)");

// Create group for x-axis labels
var labelsYGroup = chartGroup.append("g")
.attr("transform", "rotate(-90)");

var HealthcareLabel = labelsYGroup.append("text")
.attr("x", - (height / 2))
.attr("y", -40)
.attr("dy", "1em")
.attr("value", "healthcare") // value to grab for event listener
.classed("active", true)
.text("Lacks Healthcare (%)");

var SmokesLabel = labelsYGroup.append("text")
.attr("x", 0 - (height / 2))
.attr("y", -60)
.attr("dy", "1em")
.attr("value", "smokes") // value to grab for event listener
.classed("inactive", true)
.text("Smokes (%)");

var ObeseLabel = labelsYGroup.append("text")
.attr("x", 0 - (height/2))
.attr("y", -80)
.attr("dy", "1em")
.attr("value", "obesity") // value to grab for event listener
.classed("inactive", true)
.text("Obese (%)");


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
      if (value === "poverty") {
          
        AgeLabel
          .classed("active", false)
          .classed("inactive", true);
        PovertyLabel
          .classed("active", true)
          .classed("inactive", false);
        IncomeLabel
          .classed("active", false)
          .classed("inactive", true);
      }
      else if (value === "income") {
      
          AgeLabel
          .classed("active", false)
          .classed("inactive", true);
        PovertyLabel
          .classed("active", false)
          .classed("inactive", true);
        IncomeLabel
          .classed("active", true)
          .classed("inactive", false);
      }
      else if (value === "age") {
          
        AgeLabel
          .classed("active", true)
          .classed("inactive", false);
        PovertyLabel
          .classed("active", false)
          .classed("inactive", true);
        IncomeLabel
          .classed("active", false)
          .classed("inactive", true);
      }
      
      
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
      
      if (value === "healthcare") {
  
        ObeseLabel
          .classed("active", false)
          .classed("inactive", true);
        SmokesLabel
          .classed("active", false)
          .classed("inactive", true);
        HealthcareLabel
          .classed("active", true)
          .classed("inactive", false);
      }
      
      else if (value === "smokes") {
          
        ObeseLabel
          .classed("active", false)
          .classed("inactive", true);
        SmokesLabel
          .classed("active", true)
          .classed("inactive", false);
        HealthcareLabel
          .classed("active", false)
          .classed("inactive", true);
      }
      
      else if (value === "obesity") {
          
        ObeseLabel
          .classed("active", true)
          .classed("inactive", false);
        SmokesLabel
          .classed("active", false)
          .classed("inactive", true);
        HealthcareLabel
          .classed("active", false)
          .classed("inactive", true);
      }
      
      
    }
  });

}).catch(function(error) {
console.log(error);
});

  
