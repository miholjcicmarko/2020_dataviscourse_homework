class Table {

    /**
     * Creates a Table Object
     *
     * @param data the full dataset
     */
    constructor(data) {
        this.data = wordData;
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
        this.vizWidth = 300;

        this.scaleXFreq = d3.ScaleLinear()
            .domain([0,100])
            .range([0, this.vizWidth]);

        this.scaleXPercent = d3.ScaleLinear()
            .domain([-100,100])
            .range([0, this.vizWidth]);

        this.sortHandlers();
        this.drawLegend();
    }

    /**
     * Draws the legend for the table
     *
     */
    drawLegend() {

        
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