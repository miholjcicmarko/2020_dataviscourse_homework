/** Data structure for the data associated with an individual country. */
class PlotData {
    /**
     *
     * @param country country name from the x data object
     * @param xVal value from the data object chosen for x at the active year
     * @param yVal value from the data object chosen for y at the active year
     * @param id country id
     * @param region country region
     * @param circleSize value for r from data object chosen for circleSizeIndicator
     */
    constructor(country, xVal, yVal, id, region, circleSize) {
        this.country = country;
        this.xVal = xVal;
        this.yVal = yVal;
        this.id = id;
        this.region = region;
        this.circleSize = circleSize;
    }
}

/** Class representing the scatter plot view. */
class GapPlot {

    /**
     * Creates an new GapPlot Object
     *
     * For part 2 of the homework, you only need to worry about the first parameter.
     * You will be updating the plot with the data in updatePlot,
     * but first you need to draw the plot structure that you will be updating.
     *
     * Set the data as a variable that will be accessible to you in updatePlot()
     * Call the drawplot() function after you set it up to draw the plot structure on GapPlot load
     *
     * We have provided the dimensions for you!
     *
     * @param updateCountry a callback function used to notify other parts of the program when the selected
     * country was updated (clicked)
     * @param updateYear a callback function used to notify other parts of the program when a year was updated
     * @param activeYear the year for which the data should be drawn initially
     */
    constructor(data, updateCountry, updateYear, activeYear) {

        // ******* TODO: PART 2 *******

        this.margin = { top: 20, right: 20, bottom: 60, left: 80 };
        this.width = 810 - this.margin.left - this.margin.right;
        this.height = 500 - this.margin.top - this.margin.bottom;
        this.activeYear = activeYear;

        this.data = data;

        //TODO - your code goes here -
        this.drawPlot();
        this.updateYear = updateYear;
        this.updateCountry = updateCountry;
        //this.updatePlot(updateYear, "population", "population", "gdp");
        this.drawDropDown();
        this.drawLegend();
        this.drawYearBar();

        // ******* TODO: PART 3 *******
        /**
         For part 4 of the homework, you will be using the other 3 parameters.
         * assign the highlightUpdate function as a variable that will be accessible to you in updatePlot()
         * assign the dragUpdate function as a variable that will be accessible to you in updatePlot()
         */

        //TODO - your code goes here -


    }

    /**
     * Sets up the plot, axes, and slider,
     */

    drawPlot() {
        // ******* TODO: PART 2 *******
        /**
         You will be setting up the plot for the scatterplot.
         Here you will create axes for the x and y data that you will be selecting and calling in updatePlot
         (hint): class them.

         Main things you should set up here:
         1). Create the x and y axes
         2). Create the activeYear background text
        

         The dropdown menus have been created for you!

         */

        d3.select('#scatter-plot')
            .append('div').attr('id', 'chart-view');

        d3.select('#scatter-plot')
            .append('div').attr('id', 'activeYear-bar');

        d3.select('#chart-view')
            .append('div')
            .attr("class", "tooltip")
            .style("opacity", 0);

        d3.select('#chart-view')
            .append('svg').classed('plot-svg', true)
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom);

        let svgGroup = d3.select('#chart-view').select('.plot-svg').append('g').classed('wrapper-group', true);

        //TODO - your code goes here
        //let xAxisScale = d3
        //    .scaleLinear()
        //    .domain([0, d3.max(this.data.gdp)])
        //    .range([0, this.width]);
    
        let xaxis = d3.select(".plot-svg").selectAll("g")
            .classed("x-axis", true)
            //.attr("transform", "translate(25,"+ this.height+")");
            //.attr("class", "axis line")
            //.attr("id", "x-axis")
            //.call(d3.axisBottom(xAxisScale).ticks(5));

        //let yAxisScale = d3
        //    .scaleLinear()
        //    .domain([0, d3.max(this.data.gdp)])
        //    .range([0,this.height]);

        let yaxis = d3.select(".plot-svg").append("g")
            .classed("y-axis", true)
            //.attr("transform", "translate(25,0)");
            //.attr("class", "axis line")
            //.attr("id", "y-axis")
            //.call(d3.axisLeft(yAxisScale).ticks(5));

        xaxis.append("text")
            .classed("axis-label-x", true)
            //.attr("transform", "translate(350, 30)");
            //.attr("text-anchor", "middle")
            //.attr("class", "axis-label")
            //.attr("class", "x-label")
            //.text("GDP");

        yaxis.append("text")
            .classed("axis-label-y", true)
            //.attr("transform", 'translate(-15,200)rotate(-90)');
            //.attr("class", "axis label")
            //.attr("text-anchor", "middle")
            //.attr("class", "y-label")
            //.text("GDP");    
            
        d3.select(".plot-svg").append("text")
            .attr("class", "activeYear-background")
            .attr("transform", "translate(100, 150)")
            .text(function() { return activeYear});

        /* Below is the setup for the dropdown menu- no need to change this */

        let dropdownWrap = d3.select('#chart-view').append('div').classed('dropdown-wrapper', true);

        let cWrap = dropdownWrap.append('div').classed('dropdown-panel', true);

        cWrap.append('div').classed('c-label', true)
            .append('text')
            .text('Circle Size');

        cWrap.append('div').attr('id', 'dropdown_c').classed('dropdown', true).append('div').classed('dropdown-content', true)
            .append('select');

        let xWrap = dropdownWrap.append('div').classed('dropdown-panel', true);

        xWrap.append('div').classed('x-label', true)
            .append('text')
            .text('X Axis Data');

        xWrap.append('div').attr('id', 'dropdown_x').classed('dropdown', true).append('div').classed('dropdown-content', true)
            .append('select');

        let yWrap = dropdownWrap.append('div').classed('dropdown-panel', true);

        yWrap.append('div').classed('y-label', true)
            .append('text')
            .text('Y Axis Data');

        yWrap.append('div').attr('id', 'dropdown_y').classed('dropdown', true).append('div').classed('dropdown-content', true)
            .append('select');

        d3.select('#chart-view')
            .append('div')
            .classed('circle-legend', true)
            .append('svg')
            .append('g')
            .attr('transform', 'translate(10, 0)');

        debugger;

        d3.selectAll('#dropdown_x')
            .on("change", function (d) {
                let dropdownX = d;
            })

        d3.selectAll('#dropdown_y')
            .on("change", function (d){
                let dropdownY = d;
            })
            
        d3.selectAll('#dropdown_c')
            .on("change", function(d){
                let dropdownC = d;
            })

        //this.updatePlot(dropdownX, dropdownY, dropdownC);

        //let dropdownChange = function() {
        //    let dropdownX = document.getElementById("dropdown_x").value;
        //    let dropdownY = document.getElementById("dropdown_y").value;
        //    let dropdownC = document.getElementById("dropdown_c").value;

         //   this.updatePlot(this.activeYear, dropdownX, dropdownY, dropdownC);
        //}

        //var dropdown = d3.selectAll('#chart-view').selectAll()
        //    .on("change", dropdownChange);   

        

    }

    /**
     * Renders the plot for the parameters specified
     *
     * @param activeYear the year for which to render
     * @param xIndicator identifies the values to use for the x axis
     * @param yIndicator identifies the values to use for the y axis
     * @param circleSizeIndicator identifies the values to use for the circle size
     */
    updatePlot(activeYear, xIndicator, yIndicator, circleSizeIndicator) {

        // ******* TODO: PART 2 *******
        /*
        You will be updating the scatterplot from the data. hint: use the #chart-view div

        *** Structuring your PlotData objects ***
        You need to start by mapping the data specified by the parameters to the PlotData Object
        Your PlotData object is specified at the top of the file
        You will need get the data specified by the x, y and circle size parameters from the data passed
        to the GapPlot constructor

        

        *** Setting the scales for your x, y, and circle data ***
        For x and y data, you should get the overall max of the whole data set for that data category,
        not just for the activeYear.

        ***draw circles***
        draw the circles with a scaled area from the circle data, with cx from your x data and cy from y data
        You need to size the circles from your circleSize data, we have provided a function for you to do this
        called circleSizer. Use this when you assign the 'r' attribute.
        


        ***Tooltip for the bubbles***
        You need to assign a tooltip to appear on mouse-over of a country bubble to show the name of the country.
        We have provided the mouse-over for you, but you have to set it up
        Hint: you will need to call the tooltipRender function for this.

        *** call the drawLegend() and drawDropDown()
        These will draw the legend and the drop down menus in your data
        Pay attention to the parameters needed in each of the functions
        
        */

        /**
         *  Function to determine the circle radius by circle size
         *  This is the function to size your circles, you don't need to do anything to this
         *  but you will call it and pass the circle data as the parameter.
         * 
         * @param d the data value to encode
         * @returns {number} the radius
         */
        let circleSizer = function (d) {
            let cScale = d3.scaleSqrt().range([3, 20]).domain([minSize, maxSize]);
            return d.circleSize ? cScale(d.circleSize) : 3;
        };

        //let minSize = d3.min(circleSize_arr);
        //let maxSize = d3.max(circleSize_arr);

        //TODO - your code goes here -
        //let circle_data = []

        //if (xIndicator === "population" && yIndicator === "population") {
        //    for (let i = 0; i < this.data[""+yIndicator].length; i++) {
        //        let country_data2 = new PlotData(this.data[""+yIndicator][i].country, 
        //        this.data[""+yIndicator][i][""+activeYear],
        //        this.data[""+yIndicator][i][""+activeYear],
        //        this.data[""+yIndicator][i].geo,
        //        this.data[""+yIndicator][i].region, 
        //        circleSizer(this.data[""+circleSizeIndicator][i]));
        //        circle_data.push(country_data2);
        //    }
        //} 

        //if (circle_data.length === 0 && xIndicator === "population") {
        //    for (let i = 0; i < this.data[""+yIndicator].length; i++) {
        //        for (let k = 0; k < this.data["population"].length; k++) {
        //            if (this.data[""+yIndicator][i].geo === this.data["population"][k].geo) {
        //                this.data[""+yIndicator][i].region = this.data["population"][k].region;
        //                let country_data2 = new PlotData(this.data[""+yIndicator][i].country, 
        //                    this.data[""+yIndicator][i].xVal[""+activeYear],
        //                    this.data[""+yIndicator][i].yVal[""+activeYear],
        //                    this.data[""+yIndicator][i].geo,
        //                    this.data[""+yIndicator][i].region, 
        //                    circleSizer(this.data[""+circleSizeIndicator][i]));
        //                circle_data.push(country_data2);
        //            }
        //        }
        //    }
        //} 
        //if (circle_data.length === 0 && yIndicator === "population") {
        //    for (let i = 0; i < this.data[""+xIndicator].length; i++) {
        //        for (let k = 0; k < this.data["population"].length; k++) {
        //            if (this.data[""+xIndicator][i].geo === this.data["population"][k].geo) {
        //                this.data[""+xIndicator][i].region = this.data["population"][k].region;
        //                let country_data2 = new PlotData(this.data[""+xIndicator][i].country, 
        //                    this.data[""+xIndicator][i].xVal[""+activeYear],
         //                   this.data[""+xIndicator][i].yVal[""+activeYear],
         //                   this.data[""+xIndicator][i].geo,
           //                 this.data[""+xIndicator][i].region, 
             //               circleSizer(this.data[""+circleSizeIndicator][i]));
               //         circle_data.push(country_data2);
                 //   }
                //}
           // }
        //}
        //if (xIndicator !== "population" && yIndicator !== "population") {
        //    for (let i = 0; i < this.data[""+yIndicator].length; i++) {
          //      for (let k = 0; k < this.data["population"].length; k++) {
            //        if (this.data[""+yIndicator][i].geo === this.data["population"][k].geo) {
              //          this.data[""+yIndicator][i].region = this.data["population"][k].region;
                //        let country_data2 = new PlotData(this.data[""+yIndicator][i].country, 
                  //          this.data[""+yIndicator][i].xVal[""+activeYear],
                    //        this.data[""+yIndicator][i].yVal[""+activeYear],
                      //      this.data[""+yIndicator][i].geo,
                        //    this.data[""+yIndicator][i].region, 
              //              circleSizer(this.data[""+circleSizeIndicator][i]));
                //        circle_data.push(country_data2);
               //     }
               // }
           // }
       // }
       
       let plotData_arr = [];

       for (let i = 0; i < this.data[""+xIndicator].length; i++) {
           for (let k = 0; k < this.data[""+yIndicator].length; k++){
               for (let m = 0; m < this.data[""+circleSizeIndicator].length; m++) {
                   if((this.data[""+xIndicator][i].geo === this.data[""+yIndicator][k].geo) && 
                   (this.data[""+circleSizeIndicator][m].geo === this.data[""+xIndicator][i].geo)) {
                        let country_data = new PlotData(this.data[""+xIndicator][i].country,
                                        this.data[""+xIndicator][i][this.activeYear],
                                        this.data[""+yIndicator][k][this.activeYear],
                                        this.data[""+xIndicator][i].geo,
                                        "countries",
                                        this.data[""+circleSizeIndicator][m][this.activeYear]);
                                        plotData_arr.push(country_data);
                   }
               }
           }
       }
       
       let plotData_arr1 = [];

       debugger;

       for (let i = 0; i < plotData_arr.length; i++) {
           for (let k =0; k < this.data["population"].length; k++) {
               if (plotData_arr[i].id === this.data["population"][k].geo) {
                    plotData_arr[i].region = this.data["population"][k].region;
                    plotData_arr1.push(plotData_arr[i]);
               }
           }
       }



       debugger;
       
       //let plotData_arr1 = [];

        //if (circleSizeIndicator === "population") {

        //    for (let i = 0; i < this.data[""+yIndicator].length; i++) {
        //        for (let k = 0; k < this.data["population"].length; k++) {
        //            if (this.data[""+yIndicator][i].geo === this.data["population"][k].geo) {
        //                this.data[""+yIndicator][i].region = this.data["population"][k].region;
        //                let country_data = new PlotData(this.data[""+yIndicator][i].country,
        //                                                this.data[""+xIndicator][i],
         //                                               this.data[""+yIndicator][i], 
         //                                               this.data[""+yIndicator][i].geo,
         //                                               this.data[""+yIndicator][i].region,
         //                                               circleSizer(this.data["population"][i]));
         //               plotData_arr1.push(country_data);
                        //debugger;
        //            }
        //        }
        //    }
        //}
        //else {

        //    for (let i = 0; i < this.data[""+xIndicator].length; i++) {
        //        let country_data = new PlotData(this.data[""+xIndicator][i].country, 
        //                            this.data[""+xIndicator][i],
        //                            this.data[""+yIndicator][i],
        //                            this.data[""+xIndicator][i].geo,
        //                            "region", 
        //                            circleSizer(this.data[""+circleSizeIndicator][i]));
        //        plotData_arr1.push(country_data);
        //    }
        //}

        debugger;

        //if (xIndicator === "population") {
        //    for (let i = 0; i < plotData_arr1.length; i++) {
        //        for (let k = 0; k < this.data["population"].length; k++) {
        //                if (plotData_arr1[i].id === this.data["population"][k].geo) {
        //                    plotData_arr1[i].region = this.data["population"][k].region;
        //                }
        //        }
        //    }
        //}
        //else if (yIndicator === "population") {
        //    for (let i = 0; i < plotData_arr1.length; i++) {
        //        for (let k = 0; k < this.data["population"].length; k++) {
        //                if (plotData_arr1[i].id === this.data["population"][k].geo) {
         //                   plotData_arr1[i].region = this.data["population"][k].region;
         //               }
         //       }    
         //   }
        //}
        //else {
        //    for (let i = 0; i < plotData_arr1.length; i++) {
        //        for (let k = 0; k < this.data["population"].length; k++) {
        //                if (plotData_arr1[i].id === this.data["population"][k].geo) {
        //                    plotData_arr1[i].region = this.data["population"][k].region;
        //                }
        //        }
        //    }
        //}
            

            //for (let i = 0; i < this.data[""+yIndicator].length; i++) {
            //    let country_data = new PlotData(this.data[""+yIndicator][i].country, 
            //                        this.data[""+xIndicator][i],
            //                        this.data[""+yIndicator][i],
            //                        this.data[""+yIndicator][i].geo,
            //                        "region", 
            //                        circleSizer(this.data[""+circleSizeIndicator]));
            //    plotData_arr.push(country_data);
            //} 

        //function isUndefinedXval(d){
        //    return d.xVal !== undefined;
        //}

        //function isUndefinedYval(d){
        //    return d.yVal !== undefined;
        //}

        //let circle_data2 = plotData_arr1.filter(isUndefinedXval);
        //let circle_data1 = circle_data2.filter(isUndefinedYval);

        //let circle_data = [];

        //for (let i = 0; i < circle_data1.length; i++){
        //    let country_data2 = new PlotData(circle_data1[i].country, 
        //                            circle_data1[i].xVal[""+activeYear],
        //                            circle_data1[i].yVal[""+activeYear],
        //                            circle_data1[i].id,
        //                            circle_data1[i].region, 
        //                            circle_data1[i].circleSize);
        //    circle_data.push(country_data2);
        //}

        let xVals = [];
        let yVals = [];

        for (let i = 0; i < plotData_arr1.length; i++) {
            xVals.push(plotData_arr1[i].xVal);
        }

        for (let i = 0; i < plotData_arr1.length; i++) {
            yVals.push(plotData_arr1[i].yVal);
        }

        debugger;

        let circleSize_arr = [];

        for (let i = 0; i < plotData_arr1.length; i++) {
            circleSize_arr.push(plotData_arr1[i].circleSize);
        }

        let minSize = d3.min(circleSize_arr);
        let maxSize = d3.max(circleSize_arr);

        for (let i = 0; i < plotData_arr1.length; i++) {
            plotData_arr1[i].circleSize = circleSizer(plotData_arr1[i]);
        }

        debugger;

        let xUpScale = d3
            .scaleLinear()
            .domain([0, d3.max(xVals)])
            .range([0, this.width]);

        let yUpScale = d3
            .scaleLinear()
            .domain([d3.max(yVals), 0])
            .range([this.margin.bottom,this.height]);

        let xaxis_data = d3.select('.x-axis');

        xaxis_data.call(d3.axisBottom(xUpScale).ticks(5))
            .attr("transform", "translate("+this.margin.left+"," +this.height+")")
            .attr("class", "axis line")
            .attr("id", "x-axis");

        let yaxis = d3.select('.y-axis');

        yaxis.call(d3.axisLeft(yUpScale).ticks(5))
            .attr("transform", "translate("+this.margin.left+",0)")
            .attr("class", "axis line")
            .attr("id", "y-axis");

        let xlab = d3.selectAll('.axis-label-x');

        xlab.attr("transform", "translate("+this.margin.bottom+"," +this.margin.right+")")
            .attr("text-anchor", "middle")
            .attr("class", "axis-label")
            .attr("class", "x-label")
            .attr("fill", "black")
            .text(function() { return xIndicator});

        let ylab = d3.selectAll('.axis-label-y');

        ylab.attr("transform", "translate(-"+ this.margin.left + ","+this.margin.left+")rotate(-90)")
            .attr("class", "axis label")
            .attr("text-anchor", "middle")
            .attr("class", "y-label")
            .attr("fill", "black")
            .text(function() { return yIndicator});

        d3.select('.plot-svg').selectAll("circle")
            .data(plotData_arr1)
            .join("circle")
            .attr('cx', (d,i) => xUpScale(d.xVal))
            .attr('cy', (d,i) => yUpScale(d.yVal))
            .attr('r', (d,i) => d.circleSize)
            .attr("transform", "translate("+this.margin.left+",0)")
            .attr("class", "circle")
            .attr("class", d => d.region);

        let tooltip = d3.selectAll('.plot-svg').selectAll("circle");

        tooltip.on("mouseover", function(d) {

        d3.select('.tooltip')
            .attr("class", "div.tooltip")
            .attr("class", "tooltip h2")
            .text(tooltipRender(d));
        })

        this.drawDropDown(xIndicator,yIndicator,circleSizeIndicator);
        this.drawLegend(d3.min(this.data[""+circleSizeIndicator]), d3.max(this.data[""+circleSizeIndicator]));
                        
    }

    /**
     * Setting up the drop-downs
     * @param xIndicator identifies the values to use for the x axis
     * @param yIndicator identifies the values to use for the y axis
     * @param circleSizeIndicator identifies the values to use for the circle size
     */
    drawDropDown(xIndicator, yIndicator, circleSizeIndicator) {

        let that = this;
        let dropDownWrapper = d3.select('.dropdown-wrapper');
        let dropData = [];

        for (let key in this.data) {
            dropData.push({
                indicator: key,
                indicator_name: this.data[key][0].indicator_name
            });
        }

        /* CIRCLE DROPDOWN */
        let dropC = dropDownWrapper.select('#dropdown_c').select('.dropdown-content').select('select');

        let optionsC = dropC.selectAll('option')
            .data(dropData);


        optionsC.exit().remove();

        let optionsCEnter = optionsC.enter()
            .append('option')
            .attr('value', (d, i) => d.indicator);

        optionsCEnter.append('text')
            .text((d, i) => d.indicator_name);

        optionsC = optionsCEnter.merge(optionsC);

        let selectedC = optionsC.filter(d => d.indicator === circleSizeIndicator)
            .attr('selected', true);

        dropC.on('change', function (d, i) {
            let cValue = this.options[this.selectedIndex].value;
            let xValue = dropX.node().value;
            let yValue = dropY.node().value;
            that.updatePlot(that.activeYear, xValue, yValue, cValue);
        });

        /* X DROPDOWN */
        let dropX = dropDownWrapper.select('#dropdown_x').select('.dropdown-content').select('select');

        let optionsX = dropX.selectAll('option')
            .data(dropData);

        optionsX.exit().remove();

        let optionsXEnter = optionsX.enter()
            .append('option')
            .attr('value', (d, i) => d.indicator);

        optionsXEnter.append('text')
            .text((d, i) => d.indicator_name);

        optionsX = optionsXEnter.merge(optionsX);

        let selectedX = optionsX.filter(d => d.indicator === xIndicator)
            .attr('selected', true);

        dropX.on('change', function (d, i) {
            let xValue = this.options[this.selectedIndex].value;
            let yValue = dropY.node().value;
            let cValue = dropC.node().value;
            that.updatePlot(that.activeYear, xValue, yValue, cValue);
        });

        /* Y DROPDOWN */
        let dropY = dropDownWrapper.select('#dropdown_y').select('.dropdown-content').select('select');

        let optionsY = dropY.selectAll('option')
            .data(dropData);

        optionsY.exit().remove();

        let optionsYEnter = optionsY.enter()
            .append('option')
            .attr('value', (d, i) => d.indicator);

        optionsY = optionsYEnter.merge(optionsY);

        optionsYEnter.append('text')
            .text((d, i) => d.indicator_name);

        let selectedY = optionsY.filter(d => d.indicator === yIndicator)
            .attr('selected', true);

        dropY.on('change', function (d, i) {
            let yValue = this.options[this.selectedIndex].value;
            let xValue = dropX.node().value;
            let cValue = dropC.node().value;
            that.updatePlot(that.activeYear, xValue, yValue, cValue);
        });

    }

    /**
     * Draws the year bar and hooks up the events of a year change
     */
    drawYearBar() {

        // ******* TODO: PART 2 *******
        //The drop-down boxes are set up for you, but you have to set the slider to updatePlot() on activeYear change

        // Create the x scale for the activeYear;
        // hint: the domain should be max and min of the years (1800 - 2020); it's OK to set it as numbers
        // the plot needs to update on move of the slider

        /* ******* TODO: PART 3 *******
        You will need to call the updateYear() function passed from script.js in your activeYear slider
        */
        let that = this;

        //Slider to change the activeYear of the data
        let yearScale = d3.scaleLinear().domain([1800, 2020]).range([30, 730]);

        let yearSlider = d3.select('#activeYear-bar')
            .append('div').classed('slider-wrap', true)
            .append('input').classed('slider', true)
            .attr('type', 'range')
            .attr('min', 1800)
            .attr('max', 2020)
            .attr('value', this.activeYear);

        let sliderLabel = d3.select('.slider-wrap')
            .append('div').classed('slider-label', true)
            .append('svg');

        let sliderText = sliderLabel.append('text').text(this.activeYear);

        sliderText.attr('x', yearScale(this.activeYear));
        sliderText.attr('y', 25);

        yearSlider.on('input', function () {
            //TODO - your code goes here -

            that.drawPlot(that.value);

            //script.updateYear(that.value);

            sliderText
                .text(that.value)
                .attr('x', yearScale(that.value))
                .attr('y', 25); 
        });
    }

    /**
     * Draws the legend for the circle sizes
     *
     * @param min minimum value for the sizeData
     * @param max maximum value for the sizeData
     */
    drawLegend(min, max) {
        // ******* TODO: PART 2*******
        //This has been done for you but you need to call it in updatePlot().
        //Draws the circle legend to show size based on health data
        let scale = d3.scaleSqrt().range([3, 20]).domain([min, max]);

        let circleData = [min, max];

        let svg = d3.select('.circle-legend').select('svg').select('g');

        let circleGroup = svg.selectAll('g').data(circleData);
        circleGroup.exit().remove();

        let circleEnter = circleGroup.enter().append('g');
        circleEnter.append('circle').classed('neutral', true);
        circleEnter.append('text').classed('circle-size-text', true);

        circleGroup = circleEnter.merge(circleGroup);

        circleGroup.attr('transform', (d, i) => 'translate(' + ((i * (5 * scale(d))) + 20) + ', 25)');

        circleGroup.select('circle').attr('r', (d) => scale(d));
        circleGroup.select('circle').attr('cx', '0');
        circleGroup.select('circle').attr('cy', '0');
        let numText = circleGroup.select('text').text(d => new Intl.NumberFormat().format(d));

        numText.attr('transform', (d) => 'translate(' + ((scale(d)) + 10) + ', 0)');
    }

    /**
     * Reacts to a highlight/click event for a country; draws that country darker
     * and fades countries on other continents out
     * @param activeCountry
     */
    updateHighlightClick(activeCountry) {
        /* ******* TODO: PART 3*******
        //You need to assign selected class to the target country and corresponding region
        // Hint: If you followed our suggestion of using classes to style
        // the colors and markers for countries/regions, you can use
        // d3 selection and .classed to set these classes on here.
        // You will not be calling this directly in the gapPlot class,
        // you will need to call it from the updateHighlight function in script.js
        */
        //TODO - your code goes here -
    }

    /**
     * Clears any highlights
     */
    clearHighlight() {
        // ******* TODO: PART 3*******
        // Clear the map of any colors/markers; You can do this with inline styling or by
        // defining a class style in styles.css

        // Hint: If you followed our suggestion of using classes to style
        // the colors and markers for hosts/teams/winners, you can use
        // d3 selection and .classed to set these classes off here.
        //TODO - your code goes here -

    }

    /**
     * Returns html that can be used to render the tooltip.
     * @param data 
     * @returns {string}
     */
    tooltipRender(data) {
        let text = "<h2>" + data['country'] + "</h2>";
        return text;
    }

}
