/**
 * Data Structure for the circles used in the plot
 */
class CircleData {
    /**
     * 
     * @param {phrase} phrase 
     * @param {xVal} xVal x-position
     * @param {*} yVal y-position
     * @param {*} category category 
     * @param {*} circleSize the radius of the circle
     */
    
    constructor(phrase, xVal, yVal, category, circleSize, moveX, moveY,
                position, total) {

        let position_val = +position;
        let position_fixed = position_val.toFixed(3);
        let frequency_val = +total/50;
        let frequency_fixed = frequency_val.toFixed(2);

        this.phrase = phrase;
        this.xVal = xVal;
        this.yVal = yVal;
        this.category = category;
        this.circleSize = +circleSize;
        this.moveX = moveX;
        this.moveY = moveY;
        this.position = position_fixed;
        this.frequency = frequency_fixed;
    }
}

class bubblechart {

    /**
     * Creates a bubblechart Object
     *
     * @param data the full dataset
     */
    constructor(wordData) {
        this.data = wordData;
        this.chartData = [...wordData];

        this.isExpanded = false;

        // for (let bubble of this.chartData)
        // {
        //     bubble.isExpanded = false;
        // }

      this.margin = {top: 50, right: 30, bottom: 50, left: 100};
      this.width = 650 - this.margin.left - this.margin.right;
      this.height = 250 - this.margin.top - this.margin.bottom;

      this.chartHeight = 900;

        let circleSizer = function (d) {
            let cScale = d3.scaleSqrt()
                .range([2, 8])
                .domain([minSize, maxSize]);
            return d.circleSize ? cScale(d.circleSize) : 3;
        }; 

        this.circles_arr = [];
    
        for (let i = 0; i < this.data.length; i++) {
            let circle_data = new CircleData(this.data[i].phrase,
                                this.data[i].sourceX, this.data[i].sourceY,
                                this.data[i].category, this.data[i].total, 
                                this.data[i].moveX, this.data[i].moveY, 
                                this.data[i].position, this.data[i].total);
            this.circles_arr.push(circle_data);
        }

        let circleSize_arr = [];

        for (let i = 0; i < this.circles_arr.length; i++) {
            circleSize_arr.push(this.circles_arr[i].circleSize);
        }

        let minSize = d3.min(circleSize_arr, s => +s);
        let maxSize = d3.max(circleSize_arr, s => +s);
    
        for (let i = 0; i < this.circles_arr.length; i++) {
            this.circles_arr[i].circleSize = circleSizer(this.circles_arr[i])
        }

        let xVals = [];
        let yVals = [];

        for (let i = 0; i < this.circles_arr.length; i++) {
            xVals.push(this.circles_arr[i].xVal);
        }

        for (let i = 0; i < this.circles_arr.length; i++) {
            yVals.push(this.circles_arr[i].yVal);
        }

        this.xScale = d3.scaleLinear()
            .domain([d3.min(xVals),d3.max(xVals)])
            .range([0, this.width]);

        this.yScale = d3.scaleLinear()
            .domain([d3.min(yVals), d3.max(yVals)])
            .range([this.margin.bottom, this.height]);

        let category_arr = [];

        for (let i = 0; i < this.circles_arr.length; i++) {
            category_arr.push(this.circles_arr[i].category);
        }

        let unique_categories = [... new Set(category_arr)];

        this.colorScale = d3.scaleOrdinal()
            .domain(unique_categories)
            .range(d3.schemeSet2);

    }

    /**
     * Draws the bubblechart
     *
     */
    drawChart() {
        // create the diverging x-axis
        
        //create the tool tip
        d3.select("#bubbleChart")
            .append('div').attr("id", "chart-view");

        d3.select('#chart-view')
            .append('div')
            .attr("class", "tooltip")
            .style("opacity", 0);

        d3.select('#chart-view')
            .append('svg').classed('plot-svg', true)
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.chartHeight + this.margin.top + this.margin.bottom);

        let svgGroup = d3.select('#chart-view').select('.plot-svg').append('g');
    
            let xaxis = svgGroup.append("g")
                .classed("x-axis", true)
                .attr("id", "x-axis");

            let yaxis = svgGroup.append("g")
                .classed("y-axis", true)
                .attr("id", "y-axis");
        
            xaxis.append("text")
                .classed("axis-label-x", true)
                .attr("transform", "translate("+(1000*this.margin.left)+"," +(2*this.margin.top)+")")
                .attr("text-anchor", "middle")
                .attr("class", "axis-label")
                .attr("class", "x-label");

            yaxis.append("text")
                .classed("axis-label-y", true)
                .attr("transform", "translate("+(20*this.margin.bottom) + ","+(2.5*this.margin.left)+")rotate(-90)")
                .attr("class", "axis-label")
                .attr("text-anchor", "middle")
                .attr("class", "y-label");   
                
            let brushGroup = d3.select('#chart-view').select('.plot-svg')
                .append('g').classed('brushes', true);
                
            let toggleGroup = d3.select("#toggle-group");

            let extremeButton = d3.select("#extreme-button");
            
            this.addCircles();

            let brush_chart = d3.selectAll('.brushes');

            let activeBrush = null;
            let activeBrushNode = null;

            brush_chart.each(function() {
                let selectionThis = this;
                let selection = d3.select(selectionThis);

                brush = d3.brushX().extent([[0,0], [this.width, this.chartHeight]]);

                brush
                    .on('start', function() {
                        if (activeBrush && selection !== activeBrushNode) {
                            activeBrushNode.call(activeBrush.move, null);
                        }
                        activeBrush = brush;

                        activeBrushNode = selection;
                    });
                brush
                    .on('brush', function () {
                        brushSelection = d3.brushSelection(selectionThis);
                        if (!brushSelection) {
                            return;
                        }
                        let [y1,y2] = brushSelection;

                        brushGroup.selectAll("circle").classed("brushed", false);

                        let filteredGroups = activeBrushNode.selectAll("circle")
                            .filter(d => d[1] >= y1 && d[1] <= y2)
                            .classed("brushed", true);

                    });
                brush   
                    .on('end', function() {
                        let brushSelection = d3.brushSelection(selectionThis);
                        if(!brushSelection){
                            brushGroup.selectAll("circle").classed("brushed",false);
                        }
                    });
                
                selection.call(brush);
            })

            let that = this;
               
            toggleGroup.on("change", function() {
                that.toggleExpansion();
            });

            extremeButton.on("click", function() {
                that.showExtremes();
            });

            let tooltip = d3.selectAll('.plot-svg').selectAll("circle");

            tooltip.on("mouseover", function(d) {

                d3.select(this).append("title")
                    .attr("class", "div.tooltip")
                    .attr("class", "tooltip h2")
                    .text(that.tooltipRender(d));
            });

    }

     /**
     * Draws the Circles
     *
     */
    addCircles() {
        // size of circle encodes the  total use of the N-grams.
        // the circle is colored by category

        let xaxis_data = d3.select('#x-axis');

        xaxis_data.call(d3.axisBottom(this.xScale).ticks(5))
            //.attr("transform", "translate("+this.margin.left+"," +this.height+")")
            .attr("class", "axis line");

        let yaxis = d3.select('#y-axis');

        yaxis.call(d3.axisLeft(this.yScale).ticks(5))
            //.attr("transform", "translate("+this.margin.left+",0)")
            .attr("class", "axis line");

        d3.select('.plot-svg').select('.brushes').selectAll('circle')
            .data(this.circles_arr)
            .enter().append("circle")
            .attr('cx', (d,i) => this.xScale(d.xVal))
            .attr('cy', (d,i) => this.yScale(d.yVal))
            .attr('r', (d,i) => d.circleSize)
            .attr("class", "circle")
            .attr("transform", "translate("+10+",0)")
            .attr("fill", (d,i) => this.colorScale(d.category));
   
    }

    /**
     * Toggles between the separation of the categories
     *
     */
    toggleExpansion() {
        //button toggles between
        // animated transitions
        let that = this;

        if (that.isExpanded === false){
            that.isExpanded = true;
            let chart = d3.select('.plot-svg').selectAll('circle')
                .data(that.circles_arr)

            chart.style("opacity", 1)
                .exit().remove()
                .transition()
                .duration(5)
                .style("opacity",0);
            
            chart
                .enter().append("rect")
                .merge(chart)
            
            chart.style("opacity", 0)
                .transition()
                .duration(750)
                .attr('cx', (d,i) => that.xScale(d.moveX))
                .attr('cy', (d,i) => that.yScale(d.moveY))
                .attr('r', (d,i) => d.circleSize)
                .attr("class", "circle")
                .attr("transform", "translate("+10+",0)")
                .attr("fill", (d,i) => this.colorScale(d.category))
                .style("opacity", 1);

        }
        else if (that.isExpanded === true) {
            that.isExpanded = false;

            let chart = d3.select('.plot-svg').selectAll('circle')
                .data(that.circles_arr)

            chart.style("opacity", 1)
                .exit().remove()
                .transition()
                .duration(5)
                .style("opacity",0);
            
            chart
                .enter().append("rect")
                .merge(chart)
            
            chart.style("opacity", 0)
                .transition()
                .duration(750)
                .attr('cx', (d,i) => that.xScale(d.xVal))
                .attr('cy', (d,i) => that.yScale(d.yVal))
                .attr('r', (d,i) => d.circleSize)
                .attr("class", "circle")
                .attr("transform", "translate("+10+",0)")
                .attr("fill", (d,i) => this.colorScale(d.category))
                .style("opacity", 1);
        }
           

    }

    /**
     * Shows the Extremes when the button is pressed
     *
     */
    showExtremes() {
        let that = this;
    }


    /**
     * Returns html that can be used to render the tooltip.
     * @param data 
     * @returns {string}
     */
    tooltipRender(data) {
        let phrase = data['phrase'];
        let freq = data['frequency']*100;
        let pos = +data['position'];
        let party = "";
        if (pos > 0) {
            party = party + "R+"
        }
        else if (pos < 0) {
            party = party + "D+"
            let pos_val = pos * -1;
            pos = pos_val.toFixed(3);
        }
        return phrase + "\n" + 
            party + " " + pos + "%" +"\n" + 
            "In " + freq + "%" + " of speeches";
    }

}