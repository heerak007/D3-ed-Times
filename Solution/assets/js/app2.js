//this method combines some labelgroups as well as groups together the circles and text
// allowing animation to be less involved and less lines of code needed
var svgWidth2 = 960;
var svgHeight2 = 500;

var margin2 = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width2 = svgWidth2 - margin2.left - margin2.right;
var height2 = svgHeight2 - margin2.top - margin2.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg2 = d3
  .select("#scattertwo")
  .append("svg")
  .attr("width", svgWidth2)
  .attr("height", svgHeight2);

// Append an SVG group
var chartGroup2 = svg2.append("g")
  .attr("transform", `translate(${margin2.left}, ${margin2.top})`);

// Initial Params
var chosenXAxis2 = "poverty";
var chosenYAxis2 = "healthcare";

// -----------------------------------------------------------------------------

// function used for updating x-scale var upon click on axis label
function xScale2(stateData, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(stateData, d => d[chosenXAxis]) * 0.8,
        d3.max(stateData, d => d[chosenXAxis]) * 1.1
      ])
      .range([0, width2]);
  
    return xLinearScale;
}
// function used for updating y-scale var upon click on axis label
function yScale2(stateData, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(stateData, d => d[chosenYAxis]) * 0.8,
        d3.max(stateData, d => d[chosenYAxis]) * 1.1
      ])
      .range([height2, 0]);
  
    return yLinearScale;
}

// -----------------------------------------------------------------------------

// function used for updating xAxis var upon click on axis label
function renderXAxes2(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
}
  // function used for updating xAxis var upon click on axis label
function renderYAxes2(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
  
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
  
    return yAxis;
}

// -----------------------------------------------------------------------------

// function used for updating circles group with a transition to
// different method of combining the circle and text into one animation
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("transform", function(d){return `translate(${newXScale(d[chosenXAxis])},${newYScale(d[chosenYAxis])})`})
  
    return circlesGroup;
}

// -----------------------------------------------------------------------------
function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
// function used for updating circles group with new tooltip
function updateToolTip2(chosenXAxis, chosenYAxis, circlesGroup) {

    var xlabel = capitalize(chosenXAxis);
    var ylabel = capitalize(chosenYAxis);
    
  
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>${xlabel}: ${d[chosenXAxis]}<br>${ylabel}: ${d[chosenYAxis]}%`);
      });
  
    circlesGroup.call(toolTip);
  
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data);
    })
      // onmouseout event
      .on("mouseout", function(data) {
        toolTip.hide(data);
      });
  
    return circlesGroup;
}
// -----------------------------------------------------------------------------



d3.csv("assets/data/stateData.csv", function(err, stateData){
    if (err) throw err;
    
      // parse data
    stateData.forEach(function(data) {
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income;
        data.smokes = +data.smokes;
        data.obesity = +data.obesity;
    });

    // xLinearScale function above csv import
    var xLinearScale2 = xScale2(stateData, chosenXAxis2);
    // yLinearScale function above csv import
    var yLinearScale2 = yScale2(stateData, chosenYAxis2);

    // Create initial axis functions
    var bottomAxis2 = d3.axisBottom(xLinearScale2);
    var leftAxis2 = d3.axisLeft(yLinearScale2);

    // append x axis
    var xAxis2 = chartGroup2.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height2})`)
        .call(bottomAxis2);

    // append y axis
    var yAxis2 = chartGroup2.append("g")
        .call(leftAxis2);


    var elem2 = chartGroup2.selectAll(null).data(stateData);
  
    /*Create and place the "blocks" containing the circle and the text */ 
    // combining the circle and text into one group, that later can be called to animate as a group 
    var circlesGroup2 = elem2.enter()
        .append("g")
	    .attr("transform", function(d){return `translate(${xLinearScale2(d[chosenXAxis2])},${yLinearScale2(d[chosenYAxis2])})`});
 
    circlesGroup2.append("text")
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "central")
        .text(d => d.abbr)
        .style("fill", "black")
        .classed("small",true);
    /*Create the circle for each block */
    circlesGroup2.append("circle")
        .attr("r", 12)
        .attr("fill", "red")
        .attr("opacity", ".5");


    var labelsGroup2 = chartGroup2.append("g")

        var povertyLabel2 = labelsGroup2
        .append("text")
        .attr("transform", `translate(${width2 / 2}, ${height2 + 20})`)
        .attr("x", 0)
        .attr("y", 20)
        .attr("id", "poverty")
        .attr("value", "x") // value to grab for event listener
        .classed("active",true)
        .text("Poverty Level %");

        var ageLabel2 = labelsGroup2
        .append("text")
        .attr("transform", `translate(${width2 / 2}, ${height2 + 20})`)
        .attr("x", 0)
        .attr("y", 40)
        .attr("id", "age")
        .attr("value", "x") // value to grab for event listener
        .classed("inactive", true)
        .text("Median Age");

        var incomeLabel2 = labelsGroup2
        .append("text")
        .attr("transform", `translate(${width2 / 2}, ${height2 + 20})`)
        .attr("x", 0)
        .attr("y", 60)
        .attr("id", "income")
        .attr("value", "x") // value to grab for event listener
        .classed("inactive", true)
        .text("Median Household Income");

        var healthcareLabel2 = labelsGroup2
        .append("text")
        .attr("transform", `translate(-20, ${height2/2}) rotate(-90)`)
        .attr("y", -20)
        .attr("id", "healthcare")
        .attr("value", "y") // value to grab for event listener
        .classed("active", true)
        .text("Lacks Healthcare %");

        var smokesLabel2 = labelsGroup2
        .append("text")
        .attr("transform", `translate(-20, ${height2/2}) rotate(-90)`)
        .attr("y", -40)
        .attr("id", "smokes")
        .attr("value", "y") // value to grab for event listener
        .classed("inactive", true)
        .text("Smokes %");

        var obesityLabel2 = labelsGroup2
        .append("text")
        .attr("transform", `translate(-20, ${height2/2}) rotate(-90)`)
        .attr("y", -60)
        .attr("id", "obesity")
        .attr("value", "y") // value to grab for event listener
        .classed("inactive", true)
        .text("Obesity %");



    // updateToolTip function above csv import
    var circlesGroup2 = updateToolTip2(chosenXAxis2, chosenYAxis2, circlesGroup2);

    // x axis labels event listener
    //only one labelgroup needs to be called since the circle and text are grouped.
    labelsGroup2.selectAll("text")
        .on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value");
        var id = d3.select(this).attr("id");

        // value and id was added to each label as an event listener
        // value to distinguish between x axis and y axis
        // and id to give the label an identity 
        console.log(id+" "+value)
        if (value == "x") {
            chosenXAxis2 = id;
        }
        if (value == "y") {
            chosenYAxis2 = id;
        }
        console.log(chosenXAxis2+", "+chosenYAxis2)
        // functions here found above csv import
        // updates x scale for new data
        xLinearScale2 = xScale2(stateData, chosenXAxis2);
        yLinearScale2 = yScale2(stateData, chosenYAxis2);

        // updates x axis with transition
        xAxis2 = renderXAxes2(xLinearScale2, xAxis2);
        yAxis2 = renderYAxes2(yLinearScale2, yAxis2);

        // updates circles with new x values
        circlesGroup2 = renderCircles(circlesGroup2, xLinearScale2, chosenXAxis2, yLinearScale2, chosenYAxis2);

        // updates tooltips with new info
        circlesGroup2 = updateToolTip2(chosenXAxis2, chosenYAxis2, circlesGroup2);

        labelsGroup2.selectAll("text").attr("class", "inactive");
        d3.select("#scattertwo").select(`#${chosenXAxis2}`).attr("class", "active");
        d3.select("#scattertwo").select(`#${chosenYAxis2}`).attr("class", "active");

            
        
    });
    
    
});