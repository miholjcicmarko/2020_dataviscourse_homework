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
                key: 'frequency',
                //alterFunc: d => Math.abs(+d)
            },
            {
                sorted: false,
                ascending: false,
                key: 'percentages',
                //alterFunc: d => +d
            },
            {
                sorted: false,
                ascending: false,
                key: 'total',
                //alterFunc: d => +d
            },
        ]
    
        let margin = {top: 50, right: 30, bottom: 50, left: 100},
        this.width = 1000 - margin.left - margin.right,
        this.height = 800 - margin.top - margin.bottom;

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



}