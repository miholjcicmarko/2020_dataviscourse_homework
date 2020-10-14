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
            .domain([0,1.1])
            .range([0, this.subWidth]);

        this.scaleXPercent = d3.scaleLinear()
            .domain([-110,110])
            .range([0, this.vizWidth]);

        this.sortHandlers();
        this.drawLegends();
    }

    /**
     * Draws the legend for the table
     *
     */
    drawLegends() {
        let legendF = d3.select("#frequency-axis")
            .attr("width", this.subWidth)
            .attr("height", this.vizHeight);

        let freq_values = [0, 0.5, 1];
        
        legendF.selectAll("text")
            .data(freq_values)
            .join("text")
            .attr("x", (d) => this.scaleXFreq(d))
            .attr("y", this.vizHeight)
            .attr('class', "axislabel-table")
            .text(d => d); 

        let legendP = d3.select("#percentages-axis")
            .attr("width", this.subWidth)
            .attr("height", this.vizHeight);

        let percentValues = [-100, -50, 0, 50, 100];

        legendP.selectAll("text")
            .data(percentvalues)
            .join("text")
            .attr("x", (d) => this.scaleXPercent(d))
            .attr("y", this.vizHeight)
            .attr('class', "axislabel-table")
            .text(function(d) {
                if (d < 0) {
                    return "" + d * -1;
                }
                else {
                    return "" + d;
                }
            });        
        

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