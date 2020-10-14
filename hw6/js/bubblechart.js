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

      let margin = {top: 50, right: 30, bottom: 50, left: 100};
      this.width = 1000 - margin.left - margin.right;
      this.height = 800 - margin.top - margin.bottom;


        this.drawChart();
    }

    /**
     * Draws the bubblechart
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