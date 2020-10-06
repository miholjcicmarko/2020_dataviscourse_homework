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
            .attr("width", 300)
            .attr("height", 25);

        let dem_rep = [-75, -50, -25, 25, 50, 75]

        legend.selectAll("text")
            .data(dem_rep)
            .join("text")
            .attr("x", (d) => this.scaleX(d))
            .attr("y", 20)
            .attr("fill", function(d) { 
                if (d > 0) {
                    return "red";
                }
                else {
                    return "steelblue";
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
            
        //for (let i = 0; i < democrat.length; i++) {
        //    legend.append("text")
        //        .text("+" + democrat[i] * -1)
        //        //.attr("x", (i*40) + 15)
        //        .attr("x", this.scaleX(democrat[i]))
        //        .attr("y", 20)
        //        .attr("class", "td:first-of-type")
        //        .attr("fill", "steelblue");
        //}

        legend.append("line")
            .attr("x1", this.scaleX(0))
            .attr("y1", 0)
            .attr("x2", this.scaleX(0))
            .attr("y1", 30)
            .attr("stroke-width", 1)
            .attr("stroke", "black");

        //let republican = [25, 50, 75]

        //legend.selectAll("text")
        //    .data(republican)
        //    .join("text")
        //    .attr("x", (d) => this.scaleX(d))
        ///    .attr("y", 20)
        //    .attr("class", "td:first-of-type")
        //    .attr("fill", "steelblue")
        //    .text(function(d) {return "+"+d});

        //    for (let i = 0; i < republican.length; i++) {
        //        legend.append("text")
        //            .text("+"+republican[i])
        //            //.attr("x", (i*40) + 175)
        //            .attr("x", this.scaleX(republican[i]))
        //            .attr("y", 20)
        //            .attr("class", "td:first-of-type")
        //            .attr("fill", "red");
        //    }
    }

    drawTable() {
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

    }

    addGridlines(containerSelect, ticks) {
        ////////////
        // PART 3 // 
        ////////////
        /**
         * add gridlines to the vizualization
         */

        d3.select("#predictionTableBody")
          .selectAll("tr")
            .data(containerSelect)
            .join('tr')
          .selectAll('td').selectAll("svg").select("g").selectAll("line")
            .data(ticks)
            .join('line')
            .attr("x1", (d) => this.scaleX(d))
            .attr("y1", 0)
            .attr("x2", (d) => this.scaleX(d))
            .attr("y2", 30)
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

        //gridlines.selectAll("line")
        //    .data(lines)
        //    .join("line")
        //    .attr("x", (d) => this.scaleX(d))
        //    .attr("y", 20)
        //    .attr("fill", function(d) { 
        //        if (d > 0) {
        //            return "red";
        //        }
        //        else {
        //            return "steelblue";
        //        }
        //    })

        //for (let i = 0; i < ticks.length; i++) {
        //    if (ticks[i] === 0) {
        //        gridlines.append("line")
        //        .attr("x1", (i*40) + 30)
        //        .attr("y1", 0)
        //        .attr("x2", (i*40) + 30)
        //        .attr("y2", 30)
        //        .attr("stroke-width", 1)
        //        .attr("stroke", "black");
        //    }
        //    else {
        //    gridlines.append("line")
        //        .attr("x1", (i*40) + 30)
        //        .attr("y1", 0)
        //        .attr("x2", (i*40) + 30)
        //        .attr("y2", 30)
        //        .attr("stroke-width", 1)
        //        .attr("stroke", "grey") 
        //        .style("opacity", 0.4);
         //   }  
        //}
    
    }

    addRectangles(containerSelect) {
        ////////////
        // PART 4 // 
        ////////////
        /**
         * add rectangles for the bar charts
         */

        let data_select = [];

        for (let i = 0; i < containerSelect._groups.length; i++) {
            data_select.push(containerSelect._groups[i][0].__data__)
        }

        debugger;

        d3.select("#predictionTableBody")
          .selectAll("tr")
            .data(containerSelect)
            .join("tr")
          .selectAll("td").selectAll("svg").select("g").selectAll("rect")
            .data(data_select)
            .join("rect")
            .attr("x", function(d,i) {
                return this.scaleX(d[i].value.marginHigh)
                })
            .attr("y", 0)
            .attr("width", function(d,i) {
                return this.scaleX(d[i].value.margin)
                })
            .attr("height", 30)
            .style("fill", function(d,i) { 
                if ((d[i].value.marginHigh > 0 && d[i].value.marginLow < 0) ||
                (d[i].value.marginHigh < 0 && d[i].value.marginLow >0)) {
                    return 0;
                }
                else if (margin > 0) {
                    return "red";
                }
                else {
                    return "blue";
                }
            });

        //for (let i = 0; i < containerSelect._groups.length; i++) {
        //    rectangles.append("rect")
        //        .attr("x", scaleX(containerSelect._groups[i][0].__data__.value.marginHigh))
        //        .attr("y", 0)
        //        .attr("width", containerSelect._groups[i][0].__data__.value.margin)
        //        .attr("height", 30);
        //}
 
    }

    addCircles(containerSelect) {
        ////////////
        // PART 5 // 
        ////////////
        /**
         * add circles to the vizualizations
         */

        let data_select = [];

        for (let i = 0; i < containerSelect._groups.length; i++) {
            data_select.push(containerSelect._groups[i][0].__data__)
        }

        d3.select("#predictionTableBody")
          .selectAll("tr")
            .data(containerSelect)
            .join("tr")
          .selectAll("td").selectAll("svg").select("g").append("circle")
            .data(data_select)
            .join("circle")
            .attr("cx", function(d) {
                return this.scaleX(d.value.marginLow) + this.scaleX(d.value.margin)/2;
                })
            .attr("cy", 15)
            .attr("r", 5);
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


    }


    toggleRow(rowData, index) {
        ////////////
        // PART 8 // 
        ////////////
        /**
         * Update table data with the poll data and redraw the table.
         */

    }

    collapseAll() {
        this.tableData = this.tableData.filter(d => d.isForecast)
    }

}
