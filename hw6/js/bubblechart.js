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

        for (let bubble of this.chartData)
        {
            bubble.isExpanded = false;
        }

      this.margin = {top: 50, right: 30, bottom: 50, left: 100};
      this.width = 1000 - this.margin.left - this.margin.right;
      this.height = 800 - this.margin.top - this.margin.bottom;

    }

    /**
     * Draws the bubblechart
     *
     */
    drawChart() {
        // create the diverging x-axis
debugger;
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
        
            xaxis.append("text")
                .classed("axis-label-x", true)
                .attr("transform", "translate("+(5*this.margin.left)+"," +(2*this.margin.top)+")")
                .attr("text-anchor", "middle")
                .attr("class", "axis-label")
                .attr("class", "x-label");

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
                .range([0, 15])
                .domain([minSize, maxSize]);
            return d.circleSize ? cScale(d.circleSize) : 1;
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
            circleSize_arr.push(circles_arr[i].total);
        }

        let nonZeros = circleSize_arr.filter(function(d) {
            return d !== 0;
        })

        let minSize = d3.min(nonZeros);
        let maxSize = d3.max(circlesSize_arr);
        
        for (let i = 0; i < circles_arr.length; i++) {
            circles_arr[i].circleSize = circleSizer(circles_arr[i])
        }

        debugger;


    }

    /**
     * Toggles between the separation of the categories
     * 
     *
     */
    toggleExpansion() {
        //button toggles between
        // animated transitions
    }




}