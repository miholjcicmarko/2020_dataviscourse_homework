class BubbleChart {

    /**
     * Creates a BubbleChart Object
     *
     * @param data the full dataset
     */
    constructor(wordData) {
        this.data = wordData;
        this.chartData = [...data]

        for (let bubble of this.chartData)
        {
            bubble.isExpanded = false;
        }



        this.drawChart();
    }

    /**
     * Draws the BubbleChart
     *
     */
    drawChart() {
        // create the diverging x-axis

        // create the tool tip
    }

     /**
     * Draws the Circles
     *
     */
    addCircles() {
        // size of circle encodes the  total use of the N-grams.
        // the circle is colored by category
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