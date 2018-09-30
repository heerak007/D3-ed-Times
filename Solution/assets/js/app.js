var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// -----------------------------------------------------------------------------

// function used for updating x-scale var upon click on axis label
function xScale(stateData, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(stateData, d => d[chosenXAxis]) * 0.8,
        d3.max(stateData, d => d[chosenXAxis]) * 1.1
      ])
      .range([0, width]);
  
    return xLinearScale;
}
// function used for updating y-scale var upon click on axis label
function yScale(stateData, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(stateData, d => d[chosenYAxis]) * 0.8,
        d3.max(stateData, d => d[chosenYAxis]) * 1.1
      ])
      .range([height, 0]);
  
    return yLinearScale;
}

// -----------------------------------------------------------------------------

// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
}
  // function used for updating xAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
  
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
  
    return yAxis;
}

// -----------------------------------------------------------------------------

// function used for updating circles group with a transition to
// new circles
function XrenderCircles(circlesGroup, newXScale, chosenXAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]))
  
    return circlesGroup;
}
function YrenderCircles(circlesGroup, newYScale, chosenYAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cy", d => newYScale(d[chosenYAxis]));
  
    return circlesGroup;
}

// -----------------------------------------------------------------------------

function XrenderText(textGroup, newXScale, chosenXAxis) {

    textGroup.transition()
      .duration(1000)
      .attr("dx", d => newXScale(d[chosenXAxis]))
  
    return textGroup;
}
function YrenderText(textGroup, newYScale, chosenYAxis) {

    textGroup.transition()
      .duration(1000)
      .attr("dy", d => newYScale(d[chosenYAxis]));
  
    return textGroup;
}

// -----------------------------------------------------------------------------

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

    var xlabel = `${chosenXAxis}: `;
    var ylabel = `${chosenYAxis}: `;
    
  
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>${xlabel} ${d[chosenXAxis]}<br>${ylabel} ${d[chosenYAxis]}`);
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
    var xLinearScale = xScale(stateData, chosenXAxis);
    // yLinearScale function above csv import
    var yLinearScale = yScale(stateData, chosenYAxis);

    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append x axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    // append y axis
    var yAxis = chartGroup.append("g")
        .call(leftAxis);

    var textGroup = chartGroup.selectAll(null)
        .data(stateData)
        .enter()
        .append("text")
        .attr("dx", d => xLinearScale(d[chosenXAxis]))
        .attr("dy", d => yLinearScale(d[chosenYAxis]))
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "central")
        .text(d => d.abbr)
        .style("fill", "black")
        .classed("small",true);
        // vertical-align

    // append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(stateData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 12)
        .attr("fill", "#1a99af")
        .attr("opacity", ".5");


    var XlabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);
    var YlabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(-20, ${height/2}) rotate(-90)`);

        var povertyLabel = XlabelsGroup
        .append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("id", "poverty")
        .attr("value", "poverty") // value to grab for event listener
        .classed("active",true)
        .text("Poverty Level");

        var ageLabel = XlabelsGroup
        .append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("id", "age")
        .attr("value", "age") // value to grab for event listener
        .classed("inactive", true)
        .text("Median Age");

        var incomeLabel = XlabelsGroup
        .append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("id", "income")
        .attr("value", "income") // value to grab for event listener
        .classed("inactive", true)
        .text("Household Income");

        var healthcareLabel = YlabelsGroup
        .append("text")
        .attr("y", -20)
        .attr("id", "healthcare")
        .attr("value", "healthcare") // value to grab for event listener
        .classed("active", true)
        .text("Lacks Healthcare");

        var smokesLabel = YlabelsGroup
        .append("text")
        .attr("y", -40)
        .attr("id", "smokes")
        .attr("value", "smokes") // value to grab for event listener
        .classed("inactive", true)
        .text("Smokes %");

        var obesityLabel = YlabelsGroup
        .append("text")
        .attr("y", -60)
        .attr("id", "obesity")
        .attr("value", "obesity") // value to grab for event listener
        .classed("inactive", true)
        .text("Obesity %");



    // updateToolTip function above csv import
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

    // x axis labels event listener
    XlabelsGroup.selectAll("text")
        .on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenXAxis) {

            // replaces chosenXAxis with value
            chosenXAxis = value;
            console.log(chosenXAxis+", "+chosenYAxis)

            // functions here found above csv import
            // updates x scale for new data
            xLinearScale = xScale(stateData, chosenXAxis);

            // updates x axis with transition
            xAxis = renderXAxes(xLinearScale, xAxis);

            // updates circles with new x values
            circlesGroup = XrenderCircles(circlesGroup, xLinearScale, chosenXAxis);
            textGroup = XrenderText(textGroup, xLinearScale, chosenXAxis);

            // updates tooltips with new info
            circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

            XlabelsGroup.selectAll("text").attr("class", "inactive");
            d3.select(`#${chosenXAxis}`).attr("class", "active");

            
        }
    });
    
    // y axis labels event listener
    YlabelsGroup.selectAll("text")
        .on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenYAxis) {

            // replaces chosenXAxis with value
            chosenYAxis = value;
            console.log(chosenXAxis+", "+chosenYAxis)

            // functions here found above csv import
            // updates x scale for new data
            yLinearScale = yScale(stateData, chosenYAxis);

            // updates x axis with transition
            yAxis = renderYAxes(yLinearScale, yAxis);

            // updates circles with new x values
            circlesGroup = YrenderCircles(circlesGroup, yLinearScale, chosenYAxis);
            textGroup = YrenderText(textGroup, yLinearScale, chosenYAxis);

            // updates tooltips with new info
            circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

            YlabelsGroup.selectAll("text").attr("class", "inactive");
            d3.select(`#${chosenYAxis}`).attr("class", "active");
            
        }
    });
    
});