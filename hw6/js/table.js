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
            .range([0, this.subWidth]);

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
            .attr('class', "freqlabel-table")
            .text(d => d); 

        let legendP = d3.select("#percentages-axis")
            .attr("width", this.subWidth)
            .attr("height", this.vizHeight);

        let percentValues = [-100, -50, 0, 50, 100];

        legendP.selectAll("text")
            .data(percentValues)
            .join("text")
            .attr("x", (d) => this.scaleXPercent(d))
            .attr("y", this.vizHeight)
            .attr('class', "percentlabel-table")
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
        d3.select("#table").selectAll("*").remove();

        this.updateHeaders();   
        
        let rowSelection = d3.select('#table')
            .selectAll('tr')
            .data(this.chartData)
            .join('tr');
debugger;
        let phraseSelection = rowSelection.selectAll('td')
        .data(this.rowToCellDataTransform)
        .join('td');
        //.attr('class', d => d.class);

        let txtSelection = phraseSelection.filter(d => d.type === 'text');

        let textSelect = txtSelection.selectAll('text')
            .data(d => [d])
            .join("text")
            .text(function(d) {return d.value});

        let freqSelection = phraseSelection.filter(d => d.type === 'freq');
        
        let svgFreq = freqSelection.selectAll('svg')
            .data(d => [d])
            .join('svg')
            .attr('width', this.vizWidth)
            .attr('height', this.vizHeight);

        let grouperFreqSelect = svgFreq.selectAll('g')
            .data(d => [d])
            .join('g');
        
            this.drawFrequencyBars(grouperFreqSelect.filter((d,i) => i === 0));
        
        let percentSelection = phraseSelection.filter(d => d.type === 'percent');

        let svgPercent = percentSelection.selectAll('svg')
            .data(d => [d])
            .join('svg')
            .attr('width', this.vizWidth)
            .attr('height', this.vizHeight);

        let grouperPercentSelect = svgPercent.selectAll('g')
            .data(d => [d,d])
            .join('g');

            this.drawPercentageBars(grouperPercentSelect.filter((d,i) => i === 0));

            this.midline(grouperPercentSelect.filter((d,i) => i === 1));


        
    }

    /**
     * Takes all of the data and converts into a usable form
     * @param {data} d 
     */
    rowToCellDataTransform(d) {
        let phraseInfo = {
            type: "text", 
            value: d.phrase
        };

        let freqInfo = {
            type: "freq",
            value: d.total/50
        };

        let percentInfo = {
            type: "percent",
            value: {
                percent_of_d_speeches: d.percent_of_d_speeches,
                percent_of_r_speeches: d.percent_of_r_speeches
            }
        };

        let totalInfo = {
            type: "text",
            value: d.total
        };

        let dataList = [phraseInfo, freqInfo, percentInfo, totalInfo];

        return dataList;
    }



    /**
     * Draws the bar chart for the frequency column
     *
     */
    drawFrequencyBars (grouperFreqSelect) {
        let that = this;

    }




    /**
     * Draws the bar chart for the percentages column
     *
     */
    drawPercentageBars (grouperPercentSelect) {
        let that = this;

        grouperPercentSelect.selectAll("rect")
            .data(d => {
                let d1 = {
                    "marginLow": d.value.percent_of_d_speeches *-1,
                    "marginHigh": 0,
                    "category" : d.category
                }
                let d2 = {
                    "marginLow": 0,
                    "marginHigh": d.value.percent_of_r_speeches,
                    "category" : d.category
                }
                return [d1,d2];
            })     
            .enter().append("rect")
            .attr("x", function(d) {
                return that.scaleXPercent(d.marginLow);
            })   
            .attr("y", 0)
            .attr("width", function(d) {
                return that.scaleXPercent(d.marginHigh) - that.scaleXPercent(d.marginLow)
            })
            .attr("height", that.vizHeight)
            .attr("class", function(d) {
                if (d.marginHigh < 0) {
                    return "bar-percent-rep";
                }
                else if (d.marginLow > 0) {
                    return "bar-percent-dem";
                }
            });
            
    }   

    /**
     * Create midline
     *
     */
    midline (grouperPercentSelect) {
        debugger;

        let mid = [0];

        grouperPercentSelect.selectAll("line")
            .data(mid)
            .join('line')
            .attr("x1", (d) => this.scaleXPercent(d))
            .attr("y1", 0)
            .attr("x2", (d) => this.scaleXPercent(d))
            .attr("y2", this.vizHeight)
            .attr("stroke-width", 1)
            .attr("stroke", "white");            
    }

    /**
     * Updates the header of the column
     *
     */
    updateHeaders () {


    }

    /**
    * Attach click handlers to all the th elements inside the columnHeaders row.
    * The handler should sort based on that column and alternate between ascending/descending.
    */
    sortHandlers() {

    }


}