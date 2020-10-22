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
    
    constructor(phrase, xVal, yVal, category, circleSize, moveX, moveY,
                position, total, d_percentage, r_percentage) {

        let position_val = +position;
        let position_fixed = position_val.toFixed(3);
        let frequency_val = +total/50;
        let frequency_fixed = frequency_val.toFixed(2);

        this.phrase = phrase;
        this.xVal = +xVal;
        this.yVal = +yVal;
        this.category = category;
        this.circleSize = +circleSize;
        this.moveX = +moveX;
        this.moveY = +moveY;
        this.position = position_fixed;
        this.frequency = frequency_fixed;
        this.d_percentage = d_percentage;
        this.r_percentage = r_percentage;
    }
}

class bubblechart {

    /**
     * Creates a bubblechart Object
     *
     * @param data the full dataset
     */
    constructor(wordData, updateTable) {
        this.updateTable = updateTable;

        this.data = wordData;
        this.chartData = [...wordData];

        this.isExpanded = false;
        this.isExtreme = false;

        // for (let bubble of this.chartData)
        // {
        //     bubble.isExpanded = false;
        // }

      this.margin = {top: 50, right: 30, bottom: 50, left: 100};
      this.width = 650 - this.margin.left - this.margin.right;
      this.height = 250 - this.margin.top - this.margin.bottom;

      this.chartHeight = 900;

        let circleSizer = function (d) {
            let cScale = d3.scaleSqrt()
                .range([2, 8])
                .domain([minSize, maxSize]);
            return d.circleSize ? cScale(d.circleSize) : 3;
        }; 

        this.circles_arr = [];
    
        for (let i = 0; i < this.data.length; i++) {
            let circle_data = new CircleData(this.data[i].phrase,
                                this.data[i].sourceX, this.data[i].sourceY,
                                this.data[i].category, this.data[i].total, 
                                this.data[i].moveX, this.data[i].moveY, 
                                this.data[i].position, this.data[i].total, 
                                this.data[i].percent_of_d_speeches, 
                                this.data[i].percent_of_r_speeches);
            this.circles_arr.push(circle_data);
        }

        let circleSize_arr = [];

        for (let i = 0; i < this.circles_arr.length; i++) {
            circleSize_arr.push(this.circles_arr[i].circleSize);
        }

        let minSize = d3.min(circleSize_arr, s => +s);
        let maxSize = d3.max(circleSize_arr, s => +s);
    
        for (let i = 0; i < this.circles_arr.length; i++) {
            this.circles_arr[i].circleSize = circleSizer(this.circles_arr[i])
        }

        let xVals = [];
        let yVals = [];

        for (let i = 0; i < this.circles_arr.length; i++) {
            xVals.push(this.circles_arr[i].xVal);
        }

        for (let i = 0; i < this.circles_arr.length; i++) {
            yVals.push(this.circles_arr[i].yVal);
        }

        this.xScale = d3.scaleLinear()
            .domain([d3.min(xVals),d3.max(xVals)])
            .range([0, this.width - this.margin.left]);

        this.yScale = d3.scaleLinear()
            .domain([d3.min(yVals), d3.max(yVals)])
            .range([this.margin.bottom, this.height]);

        let category_arr = [];

        for (let i = 0; i < this.circles_arr.length; i++) {
            category_arr.push(this.circles_arr[i].category);
        }

        this.unique_categories = [... new Set(category_arr)];

        this.colorScale = d3.scaleOrdinal()
            .domain(this.unique_categories)
            .range(d3.schemeSet2);

        let yMoves = [];

        for (let i = 0; i < this.circles_arr.length; i++) {
            yMoves.push(this.circles_arr[i].moveY);
        }

        this.max_brush_width = d3.max(xVals)+40;

    }

    /**
     * Draws the bubblechart
     *
     */
    drawChart() {
        // create the diverging x-axis
        
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
            .attr("height", this.chartHeight + this.margin.top + this.margin.bottom);

        let svgGroup = d3.select('#chart-view').select('.plot-svg').append('g');
    
            let xaxis = svgGroup.append("g")
                .classed("x-axis", true)
                .attr("id", "x-axis");

            let yaxis = svgGroup.append("g")
                .classed("y-axis", true)
                .attr("id", "y-axis");
        
            xaxis.append("text")
                .classed("axis-label-x", true)
                .attr("transform", "translate("+(1000*this.margin.left)+"," +(2*this.margin.top)+")")
                .attr("text-anchor", "middle")
                .attr("class", "axis-label")
                .attr("class", "x-label");

            yaxis.append("text")
                .classed("axis-label-y", true)
                .attr("transform", "translate("+(20*this.margin.bottom) + ","+(2.5*this.margin.left)+")rotate(-90)")
                .attr("class", "axis-label")
                .attr("text-anchor", "middle")
                .attr("class", "y-label");   
                
            let g1 = d3.select('#chart-view').select('.plot-svg')
                        .append('g').classed('brushes', true)
                        //.append('rect').attr('width', this.width)
                        .attr("height", this.height-10)
                        .attr("id", "g1")
                        .attr("transform", 'translate(0,0)');

            let g2 = d3.select('#chart-view').select('.plot-svg')
                        .append('g').classed('brushes', true)
                        //.append('rect').attr('width', this.width)
                        .attr("height", this.height-this.margin.bottom)
                        .attr("id", "g2")
                        .attr("transform", 'translate(0,'+this.height+')');

            let g3 = d3.select('#chart-view').select('.plot-svg')
                        .append('g').classed('brushes', true)    
                        //.append('rect').attr('width', this.width)
                        .attr("height", this.height-this.margin.bottom)
                        .attr("id", "g3")
                        .attr("transform", 'translate(0,'+this.height*2+')');

            let g4 = d3.select('#chart-view').select('.plot-svg')
                        .append('g').classed('brushes', true)
                        //.append('rect').attr('width', this.max_brush_width)
                        .attr("height", this.height-this.margin.bottom)
                        .attr("id", "g4")
                        .attr("transform", 'translate(0,'+this.height*3+')');
            
            let g5 = d3.select('#chart-view').select('.plot-svg')
                        .append('g').classed('brushes', true)
                        //.append('rect').attr('width', this.max_brush_width)
                        .attr("height", this.height-this.margin.bottom)
                        .attr("id", "g5")
                        .attr("transform", 'translate(0,'+this.height*4+')');

            let g6 = d3.select('#chart-view').select('.plot-svg')
                        .append('g').classed('brushes', true)
                        //.append('rect').attr('width', this.max_brush_width)
                        .attr("height", this.height-this.margin.bottom)
                        .attr("id", "g6")
                        .attr("transform", 'translate(0,'+this.height*5+')');

            let toggleGroup = d3.select("#toggle-group");

            let extremeButton = d3.select("#extreme-button");
                
            this.addCircles();

            let that = this;
               
            toggleGroup.on("change", function() {
                that.toggleExpansion();
            });

            extremeButton.on("click", function() {
                that.showExtremes();
            });

            let tooltip = d3.selectAll('.plot-svg').selectAll("circle");

            tooltip.on("mouseover", function(d) {

                d3.select(this).append("title")
                    .attr("class", "div.tooltip")
                    .attr("class", "tooltip h2")
                    .text(that.tooltipRender(d));
            });

    }

     /**
     * Draws the Circles
     *
     */
    addCircles() {
        // size of circle encodes the  total use of the N-grams.
        // the circle is colored by category

        let xaxis_data = d3.select('#x-axis');

        xaxis_data.call(d3.axisBottom(this.xScale).ticks(5))
            //.attr("transform", "translate("+this.margin.left+"," +this.height+")")
            .attr("class", "axis line");

        let yaxis = d3.select('#y-axis');

        yaxis.call(d3.axisLeft(this.yScale).ticks(5))
            //.attr("transform", "translate("+this.margin.left+",0)")
            .attr("class", "axis line");

        this.cat_circles = [];

        for (let i = 0; i < this.unique_categories.length; i++) {
            let cat = this.circles_arr.filter(d => d.category === this.unique_categories[i]);
            this.cat_circles.push(cat);
        }
        
        this.group = ['g1', 'g2', 'g3', 'g4', 'g5', 'g6'];

        this.bindCircle(this.cat_circles, this.group, this.isExpanded);

        let svg = d3.select('#chart-view').select('.plot-svg');

        let brush_chart = d3.selectAll('.brushes');

        let brush_width = this.xScale(this.max_brush_width);
        let brush_height = this.height;
    
        this.brush(svg, brush_chart, brush_width, brush_height);
                
    }

    /*
    Binds the circles
    */
    bindCircle (data, group, isExpanded) {
        if (!isExpanded) {

            for (let i = 0; i < data.length; i++) {

                let data_arr = data[i];
                let group_select = group[i];
                let group_loc = this.height*i;
        
                d3.select('.plot-svg').select('#'+group_select).selectAll("circle")
                    .data(data_arr)
                    .enter().append("circle")
                    .attr('cx', (d,i) => this.xScale(d.xVal))
                    .attr('cy', (d,i) => this.yScale(d.yVal) - group_loc)
                    .attr('r', (d,i) => d.circleSize)
                    .attr("class", "circle")
                    .attr("transform", "translate("+10+",0)")
                    .attr("fill", (d,i) => this.colorScale(d.category))
                    .attr("id", function(d) {
                        if (d.d_percentage > 49) {
                            return "dem-Extreme";
                        }
                        else if (d.r_percentage > 51) {
                            return "rep-Extreme";
                        }
                    });
            };

        
           
        }

    }

    /**
     * Creates the brush
     */
    brush(svg, brush_chart, brush_width, brush_height) {
        let that = this;
        let activeBrush = null;
        let activeBrushNode = null;

        brush_chart.each(function() {
            let selectionThis = this;
            let selection = d3.select(selectionThis);

            let brush = d3.brushX().extent([[0,0], [brush_width, brush_height]]);

            brush
                .on('start', function() {
                    if (activeBrush && selection !== activeBrushNode) {
                        activeBrushNode.call(activeBrush.move, null);
                    }
                    activeBrush = brush;

                    activeBrushNode = selection;
                   
                });
            brush
                .on('brush', function () {
                    let brushSelection = d3.brushSelection(selectionThis);
                    if (brushSelection) {

                        let [x1,x2] = brushSelection;

                        svg.selectAll("circle").classed("brushed", false);
                        
                        let selectionData = that.circles_arr.filter(d => d.xVal >= that.xScale.invert(x1) &&
                                                    d.xVal <= that.xScale.invert(x2));

                        if (that.isExpanded) {
                            
                            let group_select = d3.select(this).attr("id");    
                            
                            let groups = ['g1', 'g2', 'g3', 'g4', 'g5', 'g6'];

                            let index = 0;
                                
                            for (let i = 0; i < groups.length; i++) {
                                if (group_select === groups[i]) {
                                    index = i;
                                }
                            }
                                
                            let category = that.unique_categories[index];
                                
                            selectionData = selectionData.filter(d => d.category === category);
                                
                        }

                        that.updateTable(selectionData);
                    }
                });
            brush   
                .on('end', function() {
                    let brushSelection = d3.brushSelection(selectionThis);
                    if(!brushSelection){
                        svg.selectAll("circle").classed("brushed",true);
                    }
                 
                    if (brushSelection !== null) {
                        let [x1,x2] = brushSelection;

                        svg.selectAll("circle").classed("brushed", false);
                        
                        let selectionData = that.circles_arr.filter(d => d.xVal >= that.xScale.invert(x1) &&
                                                d.xVal <= that.xScale.invert(x2));
                   
                        if (that.isExpanded) {
                            let group_select = d3.select(this).attr("id");

                            let groups = ['g1', 'g2', 'g3', 'g4', 'g5', 'g6'];

                            let index = 0;

                        for (let i = 0; i < groups.length; i++) {
                            if (group_select === groups[i]) {
                                index = i;
                            }
                        }

                        let category = that.unique_categories[index];

                        selectionData = selectionData.filter(d => d.category === category);

                        debugger;

                        that.updateTable(selectionData);
                    }
                }

                });
            selection.call(brush);
            
        });
    }


    /**
     * Toggles between the separation of the categories
     *
     */
    toggleExpansion() {
        //button toggles between
        // animated transitions
        let that = this;

        if (that.isExpanded === false){
            that.isExpanded = true;

            for (let i = 0; i < that.cat_circles.length; i++) {

            let data_arr = that.cat_circles[i];
            let group_select = that.group[i];
            let group_loc = this.height*i;

            let chart = d3.select('.plot-svg').select('#'+group_select).selectAll('circle')
                .data(data_arr)

            chart.style("opacity", 1)
                .exit().remove()
                .transition()
                .duration(5)
                .style("opacity",0);
            
            chart
                .enter().append("rect")
                .merge(chart)
            
            chart.style("opacity", 0)
                .transition()
                .duration(750)
                .attr('cx', (d,i) => that.xScale(d.moveX))
                .attr('cy', (d,i) => that.yScale(d.moveY - group_loc))
                .attr('r', (d,i) => d.circleSize)
                .attr("class", "circle")
                .attr("transform", "translate("+10+",0)")
                .attr("fill", (d,i) => that.colorScale(d.category))
                .style("opacity", 1);
            }
        }
        else if (that.isExpanded === true) {
            that.isExpanded = false;

            for (let i = 0; i < that.cat_circles.length; i++) {

            let data_arr = that.cat_circles[i];
            let group_select = that.group[i];
            let group_loc = that.height*i;
    
            let chart = d3.select('.plot-svg').select('#'+group_select).selectAll('circle')
                .data(data_arr)

            chart.style("opacity", 1)
                .exit().remove()
                .transition()
                .duration(5)
                .style("opacity",0);
            
            chart
                .enter().append("rect")
                .merge(chart)
            
            chart.style("opacity", 0)
                .transition()
                .duration(750)
                .attr('cx', (d,i) => that.xScale(d.xVal))
                .attr('cy', (d,i) => that.yScale(d.yVal) - group_loc)
                .attr('r', (d,i) => d.circleSize)
                .attr("class", "circle")
                .attr("transform", "translate("+10+",0)")
                .attr("fill", (d,i) => that.colorScale(d.category))
                .style("opacity", 1);
        }
        
    }
    }

    /**
     * Shows the Extremes when the button is pressed
     *
     */
    showExtremes() {
        if (this.isExtreme === false) {
            debugger;
            this.isExtreme = true; 

            if (this.isExpanded) {

                let rect = document.getElementById('dem-Extreme');
                
                let coord = rect.getBoundingClientRect();

                let demDiv = d3.select('#overlay')
                                .style("top", 150 + "px")
                                .style("left", 10 + "px");

                demDiv.append("div")
                    .attr("id", "textDem")
                    .style("width", "100px")
                    .style("height", "70px");

                let textDiv = d3.select('#textDem')
                        .style("position", "relative")
                        .style("top", coord.y+5 + "px")
                        .style("left", 0 + "px")
                        .style("border", "2px solid black")
                        .classed("textDiv", true);

                // demDiv.html(this.extremeRender("dem"))
                //      .classed("textDiv", true)
                //      .style("top", coord.x + "px")
                //      .style("left", coord.y + "px");

                // demDiv
                //      .append('svg')
                //      .attr("id", "svgdem")
                //      .attr("width", this.width)
                //      .attr("height", this.chartHeight)
                //      .classed("svgDiv", true);
                
                // let demsvg = d3.select('#svgdem').append('div')
                //          .style("left", coord.x)
                //          .style("top", coord.y)
                //          .attr("id", "demdiv")
                //          .classed("textDiv", true);

                // let dimdiv = d3.select("demdiv");
                
                textDiv.html(this.extremeRender("dem"));



                // let min = d3.min(this.circles_arr, d => d.moveX)
                // let minIndex = d3.minIndex(this.circles_arr, d => d.moveX);
                // let minY = this.circles_arr[minIndex].moveY;

                document.getElementById('overlay').style.display = "block";

                // minDiv.style.position = "absolute";
                // minDiv.style.top = minY;
                // minDiv.style.left = min;
                // minDiv.innerHTML += "Democratic speeches mentioned climate change 49.11% more";
                

            }


        }

        

    }


    /**
     * Returns html that can be used to render the tooltip.
     * @param data 
     * @returns {string}
     */
    tooltipRender(data) {
        let phrase = data['phrase'];
        let freq = data['frequency']*100;
        let pos = +data['position'];
        let party = "";
        if (pos > 0) {
            party = party + "R+"
        }
        else if (pos < 0) {
            party = party + "D+"
            let pos_val = pos * -1;
            pos = pos_val.toFixed(3);
        }
        return phrase + "\n" + 
            party + " " + pos + "%" +"\n" + 
            "In " + freq + "%" + " of speeches";
    }

    extremeRender(identifier) {
        if (identifier === "dem") {
            let text = "<h5>" + "Democratic speeches" + "<br/>" +
                        "mentioned climate change" + "<br/>" +
                        "49.11% more </h5>";
            return text;
        }
        else if (indentifier === "rep") {
            let text = "Republican speeches" + "\n" +
                        "mentioned prison" + "\n" +
                        "52.33% more"
            return text;
        }
    }


}