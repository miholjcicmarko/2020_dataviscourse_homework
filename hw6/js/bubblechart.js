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
    
    constructor(phrase, xVal, yVal, category, circleSize) {
        this.phrase = phrase;
        this.xVal = xVal;
        this.yVal = yVal;
        this.category = category;
        this.circleSize = circleSize;
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
      this.width = 1000 - this.margin.left - this.margin.right;
      this.height = 250 - this.margin.top - this.margin.bottom;

      this.toggleExpansion();

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
            .attr("height", this.height + this.margin.top + this.margin.bottom);

        let svgGroup = d3.select('#chart-view').select('.plot-svg').append('g').classed('wrapper-group', true);
    
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

            this.addCircles();
        
    }

     /**
     * Draws the Circles
     *
     */
    addCircles() {
        // size of circle encodes the  total use of the N-grams.
        // the circle is colored by category

        let circleSizer = function (d) {
            let cScale = d3.scaleSqrt()
                .range([3, 12])
                .domain([minSize, maxSize]);
            return d.circleSize ? cScale(d.circleSize) : 3;
        }; 

        let circles_arr = [];
        
        for (let i = 0; i < this.data.length; i++) {
            let circle_data = new CircleData(this.data[i].phrase,
                                    this.data[i].sourceX, this.data[i].sourceY,
                                    this.data[i].category, this.data[i].total);
            circles_arr.push(circle_data);
        }

        let circleSize_arr = [];

        for (let i = 0; i < circles_arr.length; i++) {
            circleSize_arr.push(circles_arr[i].circleSize);
        }

        let minSize = d3.min(circleSize_arr, s => +s);
        let maxSize = d3.max(circleSize_arr, s => +s);
        
        for (let i = 0; i < circles_arr.length; i++) {
            circles_arr[i].circleSize = circleSizer(circles_arr[i])
        }

        let xVals = [];
        let yVals = [];

        for (let i = 0; i < circles_arr.length; i++) {
            xVals.push(circles_arr[i].xVal);
        }

        for (let i = 0; i < circles_arr.length; i++) {
            yVals.push(circles_arr[i].yVal);
        }

        debugger;

        let xScale = d3.scaleLinear()
            .domain([d3.min(xVals),d3.max(xVals)])
            .range([0, this.width-5]);

        let yScale = d3.scaleLinear()
            .domain([d3.min(yVals), d3.max(yVals)])
            .range([this.margin.bottom, this.height]);

        let xaxis_data = d3.select('#x-axis');

        xaxis_data.call(d3.axisBottom(xScale).ticks(5))
            //.attr("transform", "translate("+this.margin.left+"," +this.height+")")
            .attr("class", "axis line");
    
        let yaxis = d3.select('#y-axis');
    
        yaxis.call(d3.axisLeft(yScale).ticks(5))
            //.attr("transform", "translate("+this.margin.left+",0)")
            .attr("class", "axis line");

        let category_arr = [];

        for (let i = 0; i < circles_arr.length; i++) {
            category_arr.push(circles_arr[i].category);
        }

        let unique_categories = [... new Set(category_arr)];
        
        debugger;

        let colorScale = d3.scaleOrdinal()
            .domain(unique_categories)
            .range(d3.schemeSet2);

        d3.select('.plot-svg').selectAll('circle')
            .data(circles_arr)
            .enter().append("circle")
            .attr('cx', (d,i) => xScale(d.xVal))
            .attr('cy', (d,i) => yScale(d.yVal))
            .attr('r', (d,i) => d.circleSize)
            .attr("class", "circle")
            .attr("transform", "translate("+10+",0)")
            .attr("fill", (d,i) => colorScale(d.category));

        
    }

    /**
     * Toggles between the separation of the categories
     *
     */
    toggleExpansion() {
        //button toggles between
        // animated transitions
        debugger;
        let that = this;

        let chartSelection = d3.select('#toggle-group')
            
        chartSelection
            .on("click", () =>{
                if (that.isExpanded === false) {
                    
                }
                else if (that.isExpanded === true) {

                }
            })
           

    }




}