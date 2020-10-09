/** Class implementing the table. */
class Table {
    /**
     * Creates a Table Object
     */
    constructor(forecastData, pollData) {
        this.forecastData = forecastData;
        this.tableData = [...forecastData];
        // add useful attributes
        for (let forecast of this.tableData)
        {
            forecast.isForecast = true;
            forecast.isExpanded = false;
        }
        this.pollData = pollData;
        this.headerData = [
            {
                sorted: false,
                ascending: false,
                key: 'state'
            },
            {
                sorted: false,
                ascending: false,
                key: 'margin',
                alterFunc: d => Math.abs(+d)
            },
            {
                sorted: false,
                ascending: false,
                key: 'winstate_inc',
                alterFunc: d => +d
            },
        ]

        this.vizWidth = 300;
        this.vizHeight = 30;
        this.smallVizHeight = 20;

        this.scaleX = d3.scaleLinear()
            .domain([-100, 100])
            .range([0, this.vizWidth]);

        this.attachSortHandlers();
        this.drawLegend();
    }

    drawLegend() {
        ////////////
        // PART 2 // 
        ////////////
        /**
         * Draw the legend for the bar chart.
         */

        let legend = d3.select("#marginAxis")
            .attr("width", this.vizWidth)
            .attr("height", this.vizHeight);

        let dem_rep = [-75, -50, -25, 25, 50, 75]

        legend.selectAll("text")
            .data(dem_rep)
            .join("text")
            .attr("x", (d) => this.scaleX(d))
            .attr("y", this.smallVizHeight)
            .attr("class", function(d) { 
                if (d > 0) {
                    return "margin-bar trump";
                }
                else {
                    return "margin bar biden";
                }
            })
            .text(function(d) {
                if (d < 0) {
                    return "+"+d * -1
                }
                else {
                    return "+"+d
                }
            });

        legend.append("line")
            .attr("x1", this.scaleX(0))
            .attr("y1", 0)
            .attr("x2", this.scaleX(0))
            .attr("y1", this.vizHeight)
            .attr("stroke-width", 1)
            .attr("stroke", "black");
    
    }

    drawTable() {
        d3.select("#predictionTableBody").selectAll("*").remove();
        this.updateHeaders();
        let rowSelection = d3.select('#predictionTableBody')
            .selectAll('tr')
            .data(this.tableData)
            .join('tr');

        rowSelection.on('click', (event, d) => 
            {
                if (d.isForecast)
                {
                    this.toggleRow(d, this.tableData.indexOf(d));
                }
            });

        let forecastSelection = rowSelection.selectAll('td')
            .data(this.rowToCellDataTransform)
            .join('td')
            .attr('class', d => d.class);


        ////////////
        // PART 1 // 
        ////////////
        /**
         * with the forecastSelection you need to set the text based on the dat value as long as the type is 'text'
         */
        let txtSelection = forecastSelection.filter(d => d.type === 'text');

        let textSelect = txtSelection.selectAll('text')
            .data(d => [d])
            .join("text")
            .text(function(d) {return d.value});

        let vizSelection = forecastSelection.filter(d => d.type === 'viz');

        let svgSelect = vizSelection.selectAll('svg')
            .data(d => [d])
            .join('svg')
            .attr('width', this.vizWidth)
            .attr('height', d => d.isForecast ? this.vizHeight : this.smallVizHeight);

        let grouperSelect = svgSelect.selectAll('g')
            .data(d => [d, d, d])
            .join('g');
        
        debugger;
        this.addGridlines(grouperSelect.filter((d,i) => i === 0), [-75, -50, -25, 0, 25, 50, 75]);
        this.addRectangles(grouperSelect.filter((d,i) => i === 1));
        this.addCircles(grouperSelect.filter((d,i) => i === 2));
    }

    rowToCellDataTransform(d) {
        let stateInfo = {
            type: 'text',
            class: d.isForecast ? 'state-name' : 'poll-name',
            value: d.isForecast ? d.state : d.name
        };

        let marginInfo = {
            type: 'viz',
            value: {
                marginLow: +d.margin_lo,
                margin: +d.margin,
                marginHigh: +d.margin_hi,
            }
        };
        let winChance;
        if (d.isForecast)
        {
            const trumpWinChance = +d.winstate_inc;
            const bidenWinChance = +d.winstate_chal;

            const trumpWin = trumpWinChance > bidenWinChance;
            const winOddsValue = 100 * Math.max(trumpWinChance, bidenWinChance);
            let winOddsMessage = `${Math.floor(winOddsValue)} of 100`
            if (winOddsValue > 99.5 && winOddsValue !== 100)
            {
                winOddsMessage = '> ' + winOddsMessage
            }
            winChance = {
                type: 'text',
                class: trumpWin ? 'trump' : 'biden',
                value: winOddsMessage
            }
        }
        else
        {
            winChance = {type: 'text', class: '', value: ''}
        }

        let dataList = [stateInfo, marginInfo, winChance];
        for (let point of dataList)
        {
            point.isForecast = d.isForecast;
        }
        return dataList;
    }

    updateHeaders() {
        ////////////
        // PART 6 // 
        ////////////
        /**
         * update the column headers based on the sort state
         */
    
        let that = this;

        let states = d3.selectAll(".sortable").filter((d,i) => i === 0);
        let pred = d3.selectAll(".sortable").filter((d,i) => i === 1);
        let wins = d3.selectAll(".sortable").filter((d,i) => i === 2);
    
    
        if (that.headerData[0].sorted === true && that.headerData[0].ascending === true) {
            states.selectAll("i")
                .attr("class", "fas fa-sort-up");
            states.classed("sorting", true);
            pred.classed("sorting", false);
            pred.selectAll("i")
                .attr("class", "fas no-display");
            wins.classed("sorting", false);
            wins.selectAll("i")
                .attr("class", "fas no-display");
            return;
        }
        else if (that.headerData[0].sorted === true && that.headerData[0].ascending === false) {
            states.selectAll("i")
                .attr("class", "fas fa-sort-down");
            states.classed("sorting", true);
            pred.classed("sorting", false);
            pred.selectAll("i")
                .attr("class", "fas no-display");
            wins.classed("sorting", false);
            wins.selectAll("i")
                .attr("class", "fas no-display");
            return;
        }
        else if (that.headerData[1].sorted === true && that.headerData[1].ascending === true) {
            states.selectAll("i")
                .attr("class", "fas no-display");
            states.classed("sorting", false);
            pred.classed("sorting", true);
            pred.selectAll("i")
                .attr("class", "fas fa-sort-up");
            wins.classed("sorting", false);
            wins.selectAll("i")
                .attr("class", "fas no-display");
        }
        else if (that.headerData[1].sorted === true && that.headerData[1].ascending === false) {
            states.selectAll("i")
                .attr("class", "fas no-display");
            states.classed("sorting", false);
            pred.classed("sorting", true);
            pred.selectAll("i")
                .attr("class", "fas fa-sort-down");
            wins.classed("sorting", false);
            wins.selectAll("i")
                .attr("class", "fas no-display");
        }
        else if (that.headerData[2].sorted === true && that.headerData[2].ascending === true) {
            states.selectAll("i")
                .attr("class", "fas no-display");
            states.classed("sorting", false);
            pred.classed("sorting", false);
            pred.selectAll("i")
                .attr("class", "fas fa-no-display");
            wins.classed("sorting", true);
            wins.selectAll("i")
                .attr("class", "fas fa-sort-up");
        }
        else if (that.headerData[2].sorted === true && that.headerData[2].ascending === false) {
            states.selectAll("i")
                .attr("class", "fas no-display");
            states.classed("sorting", false);
            pred.classed("sorting", false);
            pred.selectAll("i")
                .attr("class", "fas no-display");
            wins.classed("sorting", true);
            wins.selectAll("i")
                .attr("class", "fas fa-sort-down");
        }
        else {
            states.selectAll("i")
                .attr("class", "fas no-display");
            states.classed("sorting", false);
            pred.classed("sorting", false);
            pred.selectAll("i")
                .attr("class", "fas no-display");
            wins.classed("sorting", false);
            wins.selectAll("i")
                .attr("class", "fas no-display");
        }    
    }

    addGridlines(containerSelect, ticks) {
        ////////////
        // PART 3 // 
        ////////////
        /**
         * add gridlines to the vizualization
         */

        containerSelect
            .data(ticks)
            .join('line')
            .attr("x1", (d) => this.scaleX(d))
            .attr("y1", 0)
            .attr("x2", (d) => this.scaleX(d))
            .attr("y2", this.vizHeight)
            .attr("stroke-width", 1)
            .attr("stroke", function(d) {
                if (d === 0) {
                    return "black";
                }
                else {
                    return "grey";
                }
            })
            .style("opacity", function(d) {
                if (d === 0) {
                    return 1;
                }
                else {
                    return 0.4;
                }
            })
    
    }

    addRectangles(containerSelect) {
        ////////////
        // PART 4 // 
        ////////////
        /**
         * add rectangles for the bar charts
         */

        let that = this;

        containerSelect.selectAll("rect")
            .data(d => {
                if ((d.value.marginLow < 0 && d.value.marginHigh > 0)) {
                    let d1 = {
                        "marginLow" : d.value.marginLow,
                        "marginHigh" : 0,
                        "isForecast" : true
                    }
                    let d2 = {
                        "marginLow" : 0,
                        "marginHigh" : d.value.marginHigh,
                        "isForecast" : true
                    }
                        return [d1, d2];
                    }
                else {
                    return [d.value]   
                }
            })
            .enter().append("rect")
            .attr("x", function(d) {
                return that.scaleX(d.marginLow)
                })
            .attr("y", 0)
            .attr("width", function(d) {
                return that.scaleX(d.marginHigh) - that.scaleX(d.marginLow);
           })
            .attr("height", that.smallVizHeight)
            .attr("class", function(d) {
                if (d.marginHigh <= 0) {
                   return "margin-bar biden" 
                }
                else if (d.marginLow >= 0){
                    return "margin-bar trump" 
                }  
           });
           containerSelect.filter(d => d.isForecast !== true)
            .selectAll("rect").remove();
    }

    addCircles(containerSelect) {
        ////////////
        // PART 5 // 
        ////////////
        /**
         * add circles to the vizualizations
         */

        let that = this;

        containerSelect
            .data(d => [d])
            .append("circle")
            .attr("cx", function(d) {
                return that.scaleX(d.value.margin);
                })
            .attr("cy", this.smallVizHeight/2)
            .attr("r", 5)
            .attr("class", function(d) {
                if(d.value.margin > 0) {
                    return "margin-circle trump"
                }
                else {
                    return "margin-circle biden"
                }
            });
    }

    attachSortHandlers() 
    {
        ////////////
        // PART 7 // 
        ////////////
        /**
         * Attach click handlers to all the th elements inside the columnHeaders row.
         * The handler should sort based on that column and alternate between ascending/descending.
         */

        let that = this;

        let states = d3.selectAll(".sortable").filter((d,i) => i === 0);
        let pred = d3.selectAll(".sortable").filter((d,i) => i === 1);
        let wins = d3.selectAll(".sortable").filter((d,i) => i === 2);

        states
            .on('click', () => {
                if (that.headerData[0].sorted === false && that.headerData[0].ascending === false) {
                    let newData = that.tableData.slice().sort((a,b) => d3.ascending(a.state, b.state)); 
                    that.tableData = newData;
                    that.headerData[0].sorted = true;
                    that.headerData[0].ascending = true;
                    that.headerData[1].sorted = false;
                    that.headerData[1].ascending = false;
                    that.headerData[2].sorted = false;
                    that.headerData[2].ascending = false;
                    that.drawTable();
                }
                else if (that.headerData[0].sorted === true && that.headerData[0].ascending === false) {
                    let newData = that.tableData.slice().sort((a,b) => d3.ascending(a.state, b.state));
                    that.tableData = newData;
                    that.headerData[0].ascending = true;
                    that.headerData[1].sorted = false;
                    that.headerData[1].ascending = false;
                    that.headerData[2].sorted = false;
                    that.headerData[2].ascending = false;
                    that.drawTable();
                }
                else {
                    let newData = that.tableData.slice().sort((a,b) => d3.descending(a.state, b.state));
                    that.tableData = newData;
                    that.headerData[0].ascending = false;
                    that.headerData[1].sorted = false;
                    that.headerData[1].ascending = false;
                    that.headerData[2].sorted = false;
                    that.headerData[2].ascending = false;
                    that.drawTable();
                }
        })

        pred
            .on("click", () => {

                if (that.headerData[1].sorted === false && that.headerData[1].ascending === false) {
                    let poll_data = [];

                    for (let i = 0; i < that.tableData.length; i++) {
                        if (that.tableData[i].isForecast === false) {
                            poll_data.push(that.tableData[i]);
                            that.tableData.splice(i, 1);
                        }
                        else {
                            continue;
                        }
                    }

                    debugger;

                    let newData = that.tableData.slice().sort((a,b) => d3.ascending(Math.abs(a.margin), Math.abs(b.margin))); 
                    that.tableData = newData;

                    that.headerData[1].sorted = true;
                    that.headerData[1].ascending = true;
                    that.headerData[0].sorted = false;
                    that.headerData[0].ascending = false;
                    that.headerData[2].sorted = false;
                    that.headerData[2].ascending = false;
                    that.drawTable();
                }
                else if (that.headerData[1].sorted === true && that.headerData[1].ascending === false) {
                    let newData = that.tableData.slice().sort((a,b) => d3.ascending(Math.abs(a.margin), Math.abs(b.margin)));
                    that.tableData = newData;
                    that.headerData[1].ascending = true;
                    that.headerData[0].sorted = false;
                    that.headerData[0].ascending = false;
                    that.headerData[2].sorted = false;
                    that.headerData[2].ascending = false;
                    that.drawTable();
                }

                else {
                    let newData = that.tableData.slice().sort((a,b) => d3.descending(Math.abs(a.margin), Math.abs(b.margin)));
                    that.tableData = newData;
                    that.headerData[1].ascending = false;
                    that.headerData[0].sorted = false;
                    that.headerData[0].ascending = false;
                    that.headerData[2].sorted = false;
                    that.headerData[2].ascending = false;
                    that.drawTable();
                }
            })

        wins
            .on("click", () => {
                if (that.headerData[2].sorted === false && that.headerData[2].ascending === false) {
                    let newData = that.tableData.slice().sort((a,b) => d3.ascending(a.winstate_chal, b.winstate_chal)); 
                    that.tableData = newData;
                    that.headerData[2].sorted = true;
                    that.headerData[2].ascending = true;
                    that.headerData[0].sorted = false;
                    that.headerData[0].ascending = false;
                    that.headerData[1].sorted = false;
                    that.headerData[1].ascending = false;
                    that.drawTable();
                }
                else if (that.headerData[2].sorted === true && that.headerData[2].ascending === false) {
                    let newData = that.tableData.slice().sort((a,b) => d3.ascending(a.winstate_chal, b.winstate_chal));
                    that.tableData = newData;
                    that.headerData[2].ascending = true;
                    that.headerData[0].sorted = false;
                    that.headerData[0].ascending = false;
                    that.headerData[1].sorted = false;
                    that.headerData[1].ascending = false;
                    that.drawTable();
                }
                else {
                    let newData = that.tableData.slice().sort((a,b) => d3.descending(a.winstate_chal, b.winstate_chal));
                    that.tableData = newData;
                    this.headerData[2].sorted = true;
                    that.headerData[2].ascending = false;
                    that.headerData[0].sorted = false;
                    that.headerData[0].ascending = false;
                    that.headerData[1].sorted = false;
                    that.headerData[1].ascending = false;
                    that.drawTable();
                }
            })
    }


    toggleRow(rowData, index) {
        ////////////
        // PART 8 // 
        ////////////
        /**
         * Update table data with the poll data and redraw the table.
         */
        let that = this;

        if (rowData.isExpanded === false) {
            let name = rowData.state;

            let all_poll = this.pollData;

            let state_poll = all_poll.get(name);

            let data_arr = [];

            for (let i = 0; i < state_poll.length; i++) {
                let d1 = {...rowData};
                d1.margin = state_poll[i].margin;
                d1.name = state_poll[i].name;
                d1.isForecast = false;

                data_arr.push(d1);
            }

        for (let i =0; i < data_arr.length; i++) {
            that.tableData.splice((index+1)+i, 0, data_arr[i]);
        }
        rowData.isExpanded = true;

        that.drawTable();
        }
        else if (rowData.isExpanded === true) {
            let name = rowData.state;

            let all_poll = this.pollData;

            let state_poll = all_poll.get(name);

            let data_arr = [];

            for (let i = 0; i < state_poll.length; i++) {
                let d1 = {...rowData};
                d1.margin = state_poll[i].margin;
                d1.name = state_poll[i].name;
                d1.isForecast = false;

                data_arr.push(d1);
            }

            that.tableData.splice((index+1), data_arr.length);

            rowData.isExpanded = false;
            that.drawTable();
        }
    }

    collapseAll() {
        this.tableData = this.tableData.filter(d => d.isForecast)
    }

}
