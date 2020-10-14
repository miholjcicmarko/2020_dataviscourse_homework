class table {

    /**
     * Creates a Table Object
     *
     * @param data the full dataset
     */
    constructor(data) {
        this.data = data;
        this.chartData = [...data]

        this.headerData = [
            {
                sorted: false,
                ascending: false,
                key: 'phrase'
            },
            {
                sorted: false,
                ascending: false,
                key: 'frequency'
            },
            {
                sorted: false,
                ascending: false,
                key: 'percentages'
            },
            {
                sorted: false,
                ascending: false,
                key: 'total'
            }
        ]
    
        this.vizHeight = 20;
        this.vizWidth = 400;

        this.subWidth = 100;

        this.scaleXFreq = d3.scaleLinear()
            .domain([0,1])
            .range([0, this.vizWidth]);

        this.scaleXPercent = d3.scaleLinear()
            .domain([-100,100])
            .range([0, this.vizWidth]);

        this.sortHandlers();
        this.drawLegends();
    }

    /**
     * Draws the legend for the table
     *
     */
    drawLegends() {
        let legend = d3.select("#frequency-axis")
            .attr("width", this.subWidth)
            .attr("height", this.vizHeight);

        let freq_values = [0, 0.5, 1];
        
        legend.selectAll("text")
            .data(freq_values)
            .join("text")
            .attr("x", (d) => this.scaleXFreq(d))
            .attr("y", this.vizHeight)
            .attr('class', "axislabel-table");

        


        
    }

    /**
     * Draws the Table
     *
     */
    drawTable() {

        
    }

    /**
     * Draws the bar chart for the frequency column
     *
     */
    drawFrequencyBars () {

    }

    /**
     * Draws the bar chart for the percentages column
     *
     */
    drawPercentageBars () {

    }    

    /**
    * Attach click handlers to all the th elements inside the columnHeaders row.
    * The handler should sort based on that column and alternate between ascending/descending.
    */
    sortHandlers() {

    }


}