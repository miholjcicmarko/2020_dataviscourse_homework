/**
 * Makes the first bar chart appear as a staircase.
 *
 * Note: use only the DOM API, not D3!
 */
function staircase() {
  // ****** TODO: PART II ******
  let bar = document.getElementById("aBarChart");

  let barChart = bar.getElementsByTagName("rect");

  let arr = [];

  for (let i = 0; i < barChart.length; i++){
      arr.push(barChart[i].attributes.width.nodeValue);
  }

  var sorter = new Intl.Collator(undefined, {numeric:true})
  arr.sort(sorter.compare);

  for (let k = 0; k < barChart.length; k++){
    barChart[k].attributes.width.nodeValue = arr[k];
  }

}

/**
 * Render the visualizations
 * @param data
 */
function update(data) {
  /**
   * D3 loads all CSV data as strings. While Javascript is pretty smart
   * about interpreting strings as numbers when you do things like
   * multiplication, it will still treat them as strings where it makes
   * sense (e.g. adding strings will concatenate them, not add the values
   * together, or comparing strings will do string comparison, not numeric
   * comparison).
   *
   * We need to explicitly convert values to numbers so that comparisons work
   * when we call d3.max()
   **/

  for (let d of data) {
    d.cases = +d.cases; //unary operator converts string to number
    d.deaths = +d.deaths; //unary operator converts string to number
  }

  // Set up the scales
  let barChart_width = 345;
  let areaChart_width = 295;
  let maxBar_width = 240;
  let data_length = 15;
  let aScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, d => d.cases)])
    .range([0, maxBar_width]);
  let bScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, d => d.deaths)])
    .range([0, maxBar_width]);
  let iScale_line = d3
    .scaleLinear()
    .domain([0, data.length])
    .range([10, 500]);
  let iScale_area = d3
    .scaleLinear()
    .domain([0, data_length])
    .range([0, 260]);
  
  // Draw axis for Bar Charts, Line Charts and Area Charts (You don't need to change this part.)
  d3.select("#aBarChart-axis").attr("transform", "translate(0,210)").call(d3.axisBottom(d3.scaleLinear().domain([0, d3.max(data, d => d.cases)]).range([barChart_width, barChart_width-maxBar_width])).ticks(5));
  d3.select("#aAreaChart-axis").attr("transform", "translate(0,245)").call(d3.axisBottom(d3.scaleLinear().domain([0, d3.max(data, d => d.cases)]).range([areaChart_width, areaChart_width-maxBar_width])).ticks(5));
  d3.select("#bBarChart-axis").attr("transform", "translate(5,210)").call(d3.axisBottom(bScale).ticks(5));
  d3.select("#bAreaChart-axis").attr("transform", "translate(5,245)").call(d3.axisBottom(bScale).ticks(5));
  let aAxis_line = d3.axisLeft(aScale).ticks(5);
  d3.select("#aLineChart-axis").attr("transform", "translate(50,15)").call(aAxis_line);
  d3.select("#aLineChart-axis").append("text").text("New Cases").attr("transform", "translate(50, -3)");
  let bAxis_line = d3.axisRight(bScale).ticks(5);
  d3.select("#bLineChart-axis").attr("transform", "translate(550,15)").call(bAxis_line);
  d3.select("#bLineChart-axis").append("text").text("New Deaths").attr("transform", "translate(-50, -3)");

  // ****** TODO: PART III (you will also edit in PART V) ******

  // TODO: Select and update the 'a' bar chart bars
  let achart = d3.selectAll("#aBarChart").selectAll("rect") 
      .data(data);

  if (achart.exit().length < achart.enter().length) {
    achart = achart.enter().append("rect");

    achart.merge(achart);
  
    achart.attr("width", d => aScale(d.cases))
        .attr("height", "12")
        .attr("transfrom", (d,i) => {return "translate(" +0+ "," + 14*i + ") scale(-1, 1)"});  
  }
  else {
    achart.exit().remove();
  
    achart = achart.enter().append("rect");

    achart.merge(achart);

    achart.attr("width", d => aScale(d.cases))
      .attr("height", "12")
      .attr("transfrom", (d,i) => {return "translate(" +0+ "," + 14*i + ") scale(-1, 1)"});
  }

  //achart.exit().remove();
  
  //achart = achart.enter().append("rect");

  //achart.merge(achart);

  //achart.attr("width", d => aScale(d.cases))
  //    .attr("height", "12")
  //    .attr("transfrom", (d,i) => {return "translate(" +0+ "," + 14*i + ") scale(-1, 1)"});

  // TODO: Select and update the 'b' bar chart bars
  let bchart = d3.selectAll("#bBarChart").selectAll("rect")
        .data(data);

  bchart = bchart.enter().append("rect").merge(bchart);      
  
  bchart.attr("width", d => bScale(d.deaths))
      .attr("height", "12")
      .attr("transform", (d,i) => {return "translate(" +0+ "," + 14*i + ") scale(1, -1)"})

  // TODO: Select and update the 'a' line chart path using this line generator
  let aLineGenerator = d3
    .line()
    .x((d, i) => iScale_line(i))
    .y((d,i) => aScale(d.cases));

  let aLineC = d3.selectAll("#aLineChart")
    .datum(data);
  aLineC.attr("d", aLineGenerator);

  // TODO: Select and update the 'b' line chart path (create your own generator)
  let bLineGenerator = d3
    .line()
    .x((d, i) => iScale_line(i))
    .y((d,i) => bScale(d.deaths));

  let bLineC = d3.selectAll("#bLineChart")
    .datum(data);
  bLineC.attr("d", bLineGenerator);

  // TODO: Select and update the 'a' area chart path using this area generator
  let aAreaGenerator = d3
    .area()
    .x((d, i) => iScale_area(i))
    .y0(0)
    .y1((d,i) => aScale(d.cases));

  let aAreaC = d3.selectAll("#aAreaChart")
    .datum(data);
  aAreaC.attr("d", aAreaGenerator);

  // TODO: Select and update the 'b' area chart path (create your own generator)
  let bAreaGenerator = d3
    .area()
    .x((d, i) => iScale_area(i))
    .y0(0)
    .y1((d,i) => bScale(d.deaths));

  let bAreaC = d3.selectAll("#bAreaChart")
    .datum(data);
  bAreaC.attr("d", bAreaGenerator);

  // TODO: Select and update the scatterplot points
  d3.select("#x-axis").attr("transform", "translate(10,250)").call(d3.axisBottom(aScale).ticks(5));
  let yAxis_line = d3.axisLeft(bScale).ticks(5);
  d3.select("#y-axis").attr("transform", "translate(10,10)").call(yAxis_line);

let scatter = d3.selectAll("#scatterplot").selectAll("circle")
    .data(data);

scatter = scatter.enter().append("circle").merge(scatter);

scatter.attr("cx", (d,i) => aScale(d.cases))
    .attr("cy", (d,i) => bScale(d.deaths))
    .attr("r", 3);

  // ****** TODO: PART IV ******
  
  let rects = achart;

  //let stylesBorig = bchart.nodes().map(d => d3.select(d).attr('class', 'bar-chart-y rect'));

  let stylesAnew = rects.nodes().map(d => d3.select(d).attr('class', 'bar-chart hovered'));
  //let stylesBnew = bchart.nodes().map(d => d3.select(d).attr('class', 'bar-chart hovered'));

  let stylesAorig = rects.nodes().map(d => d3.select(d).attr('class', 'bar-chart-x rect'));

  rects.on("mouseover", function(d) {
      d3.select(this).attr('class', 'bar-chart hovered');
    })
  
  rects.on("mouseout", function(d) {
    d3.select(this).attr('class', 'bar-chart-x rect');
  })

  bchart.on("mouseover", function(d) {
      d3.select(this).attr('class', 'bar-chart hovered');
    })
  
  bchart.on("mouseout", function(d) {
      d3.select(this).attr('class', 'bar-chart-x rect');
  })  

  let coor = d3.selectAll("#scatterplot").selectAll("circle");

  coor.on("click", function(d) {
    let xcor = d.cases  
    let ycor = d.deaths
    let coordinates = "x-coordinate: " + xcor + ", y-coordinate: " + ycor;
      console.log(coordinates);
    })
  






}

/**
 * Update the data according to document settings
 */
async function changeData() {
  //  Load the file indicated by the select menu
  let dataFile = document.getElementById("dataset").value;
  try {
    const data = await d3.csv("data/" + dataFile + ".csv");
    if (document.getElementById("random").checked) {
      // if random
      update(randomSubset(data)); // update w/ random subset of data
    } else {
      // else
      update(data); // update w/ full data
    }
  } catch (error) {
    console.log(error)
    alert("Could not load the dataset!");
  }
}

/**
 *  Slice out a random chunk of the provided in data
 *  @param data
 */
function randomSubset(data) {
  return data.filter(d => Math.random() > 0.5);
}
