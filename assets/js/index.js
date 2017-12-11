//Based in the following example: https://bl.ocks.org/mbostock/3887118
//You can find it and a lot more examples in: https://github.com/d3/d3/wiki/Gallery
//I changed the scale the tooltip and the legends. 


const myURL =
  "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

const margin = { top: 20, right: 20, bottom: 30, left: 40 },
  width = 750 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

let x = d3.scale.linear().range([0, width]);

let y = d3.scale.linear().range([height, 0]);

let color = d3.scale.category10();

let xAxis = d3.svg
  .axis()
  .scale(x)
  .orient("bottom");

let yAxis = d3.svg
  .axis()
  .scale(y)
  .orient("left");

let svg = d3
  .select("#chart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//get json data
d3.json(myURL, function(error, data) {
  if (error) throw error;

  console.log(data);

  const fastestTime = data[0].Seconds;
  console.log(fastestTime);

  data.forEach(function(d) {
    d.Place = +d.Place;
    d.Seconds = +d.Seconds - fastestTime;

    if(d.Doping !== '') d.Doping = 'Doping';
    if(d.Doping === '') d.Doping = 'No doping';
  });

  x
    .domain(
      d3.extent(data, function(d) {
        return d.Place;
      })
    )
    .nice();
  y
    .domain(
      d3.extent(data, function(d) {
        return d.Seconds;
      })
    )
    .nice();

  //append x axis
  svg
    .append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .append("text")
    .attr("class", "label")
    .attr("x", width)
    .attr("y", -6)
    .style("text-anchor", "end")
    .text("Ranking");

  //append y axis
  svg
    .append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("class", "label")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Seconds behind fastest time");

  //place items
  svg
    .selectAll(".dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("r", 3.5)
    .attr("cx", function(d) {   //cx means circle in x axis
      return x(d.Place);
    })
    .attr("cy", function(d) {   //cy means circle in y axis
      return y(d.Seconds);
    })
    .style("fill", function(d) {
      return color(d.Doping);
    });

  var legend = svg
    .selectAll(".legend")
    .data(color.domain())
    .enter()
    .append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) {
      return "translate(0," + i * 20 + ")";
    });

  legend
    .append("rect")
    .attr("x", width - 18)
    .attr("y", 250)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", color);

  legend
    .append("text")
    .attr("x", width - 24)
    .attr("y", 259)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(function(d) {
      return d;
    });
    

  //hover in each circle
  svg
    .selectAll(".dot")
    //increase width and opacity effect
    .on("mouseover", function(d) {
      var eachCircle = d3.select(this);
      eachCircle
        .attr("r", 5)
        .attr("class", "mouseover")
        .transition()
        .duration(300)
        .style("opacity", 0.8);
    })
    .on("mouseout", function() {
      var eachCircle = d3.select(this);
      eachCircle
        .attr("r", 3.5)
        .attr("class", "mouseoff")
        .transition()
        .duration(300)
        .style("opacity", 1);
    })
    //info as a title attribute
    .append("svg:title")
    .text(function(d) {
      return (
        "Place: " + d.Place + 
        "\nName: " + d.Name + 
        "\nNationality: " + d.Nationality + 
        "\nTime: " + d.Time + 
        "\nSeconds: " + d.Seconds + 
        "\nDoping: " + d.Doping 
      );
    });

});
