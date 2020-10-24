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

      this.margin = {top: 50, right: 30, bottom: 50, left: 30};
      this.width = 1000 - this.margin.left - this.margin.right;
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
            .range([this.margin.left, this.width-this.margin.right]);

        this.yScale = d3.scaleLinear()
            .domain([d3.min(yVals), d3.max(yVals)])
            .range([this.margin.top, this.height - this.margin.bottom]);

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

        this.max_brush_width = this.width

        this.count = 0;

    }

    /**
     * Draws the bubblechart
     *
     */
    drawChart() {
        // create the diverging x-axis
        
        //create the tool tip
        if (this.count === 0) {

        d3.select("#bubbleChart")
            .append('div').attr("id", "chart-view");

        d3.select('#chart-view')
            .append('div')
            .attr("class", "tooltip")
            .style("opacity", 0);

        d3.select('#chart-view')
            .append('svg').classed('leaningLabel', true)
            .attr("id", "LeaningLabel")
            .attr("width", this.width)
            .attr("height", this.margin.top);

        d3.select('#chart-view')
            .append('svg').classed('plot-svg', true)
            .attr("id", "bubbleSVG")
            .attr("width", this.width)
            .attr("height", this.chartHeight);

        }

        let leaningLab = d3.select(".leaningLabel");

        let twoLeaners = ["Democratic Leaning", "Republican Leaning"];

        leaningLab.selectAll("text")
            .data(twoLeaners)
            .join("text")
            .attr("x", (d,i) => (this.width)*(5*i/6))
            .attr("y", 4*this.margin.top/5)
            .attr("class", "leaningLabel")
            .text(d => d); 
 
        let svgGroup = d3.select('#chart-view').select('.plot-svg').append('g');
    
            let xaxis = svgGroup.append("g")
                .classed("x-axis", true)
                .attr("id", "x-axis");
                
            let g1 = d3.select('#chart-view').select('.plot-svg')
                        .append('g').classed('brushes', true)
                        .attr("height", this.height-this.margin.top-this.margin.bottom)
                        .attr("id", "g1")
                        .attr("transform", 'translate(0,0)');

            let g2 = d3.select('#chart-view').select('.plot-svg')
                        .append('g').classed('brushes', true)
                        .attr("height", this.height-this.margin.top-this.margin.bottom)
                        .attr("id", "g2")
                        .attr("transform", 'translate(0,'+this.height+')');

            let g3 = d3.select('#chart-view').select('.plot-svg')
                        .append('g').classed('brushes', true)    
                        .attr("height", this.height-this.margin.top-this.margin.bottom)
                        .attr("id", "g3")
                        .attr("transform", 'translate(0,'+this.height*2+')');

            let g4 = d3.select('#chart-view').select('.plot-svg')
                        .append('g').classed('brushes', true)
                        .attr("height", this.height-this.margin.top-this.margin.bottom)
                        .attr("id", "g4")
                        .attr("transform", 'translate(0,'+this.height*3+')');
            
            let g5 = d3.select('#chart-view').select('.plot-svg')
                        .append('g').classed('brushes', true)
                        .attr("height", this.height-this.margin.top-this.margin.bottom)
                        .attr("id", "g5")
                        .attr("transform", 'translate(0,'+this.height*4+')');

            let g6 = d3.select('#chart-view').select('.plot-svg')
                        .append('g').classed('brushes', true)
                        .attr("height", this.height-this.margin.top-this.margin.bottom)
                        .attr("id", "g6")
                        .attr("transform", 'translate(0,'+this.height*5+')');

            let groupLabel = d3.select('#chart-view').selectAll('.plot-svg')
                                .append('g')
                                .attr("id", "groupLabel");

            let toggleGroup = d3.select("#toggle-group");

            let extremeButton = d3.select("#extreme-button");

            this.addCatLabels();
                
            this.addCircles();

            let that = this;
               
            toggleGroup.on("change", function() {
                that.toggleExpansion();
            });

            extremeButton.on("click", function() {
                that.showExtremes();
            });

            let chartListener = d3.select('.innerWrapper1');
                
            chartListener.on("click", function() {
                that.updateTable(null);
            });

    }

     /**
     * Draws the Circles
     *
     */
    addCircles() {
        // size of circle encodes the  total use of the N-grams.
        // the circle is colored by category

        let xaxis = d3.select('#x-axis')
            .attr("transform", "translate(0,25)");

        let xaxisdata = [-50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50];

        this.axisXscale = d3.scaleLinear()
             .domain([-50, 50])
             .range([this.margin.left, this.width-this.margin.right])

        xaxis.call(d3.axisTop(this.axisXscale).ticks(11));
        
        xaxis.select('.domain').attr("stroke-width", 0);

        d3.selectAll("#midline").remove();

        let midline = d3.select('#chart-view').select('.plot-svg').append('g')
                        .attr("id", "midline");

        let midline_data = [0];
       
            if (this.isExpanded) {
                midline.selectAll("line")
                    .data(midline_data)
                    .join("line")
                    .attr("x1", (d) => this.axisXscale(d))
                    .attr("y1", this.margin.right)
                    .attr("x2", (d) => this.axisXscale(d))
                    .attr("y2", this.chartHeight)
                    .attr("class", "midline");
            }
            else if (this.isExpanded === false) {

                midline.selectAll("line")
                    .data(midline_data)
                    .join("line")
                    .attr("x1", (d) => this.axisXscale(d))
                    .attr("y1", this.margin.right)
                    .attr("x2", (d) => this.axisXscale(d))
                    .attr("y2", this.height)
                    .attr("class", "midline");
            }

        this.cat_circles = [];

        for (let i = 0; i < this.unique_categories.length; i++) {
            let cat = this.circles_arr.filter(d => d.category === this.unique_categories[i]);
            this.cat_circles.push(cat);
        }
        
        this.group = ['g1', 'g2', 'g3', 'g4', 'g5', 'g6'];

        let svg = d3.select('#chart-view').select('.plot-svg');

        let brush_chart = d3.selectAll('.brushes');

        let brush_width = this.xScale(this.max_brush_width);
        let brush_height = this.height-this.margin.top;
    
        this.brush(svg, brush_chart, brush_width, brush_height);

        this.bindCircle(this.cat_circles, this.group);
                
    }

    /*
    * Adds the labels of all the catgories to the plot
    */

    addCatLabels() {

        let catLabels = d3.select('#groupLabel').selectAll('text')
                            .data(this.unique_categories)
                            .join('text')
                            .text(d => d)
                            .attr("x", (d,i) => 10)
                            .attr("y", (d,i) => 50+(i*140));

        if (this.isExpanded) {
             catLabels.attr("opacity", 0.8);
        }
        else if (this.isExpanded === false) {
             catLabels.attr("opacity", 0);
        }
    }

    /*
    Binds the circles
    */
    bindCircle (data, group) {

        for (let i = 0; i < data.length; i++) {

            let data_arr = data[i];
            let group_select = group[i];
            let group_loc = this.height*i;

            debugger;
        
            let circles = d3.select('.plot-svg').select('#'+group_select).selectAll("circle")
                    .data(data_arr)
                    .enter().append("circle")
                    .attr('cx', (d,i) => this.xScale(d.xVal))
                    .attr('cy', (d,i) => this.yScale(d.yVal) - group_loc)
                    .attr('r', (d,i) => d.circleSize)
                    .attr("class", "bubble")
                    .attr("stroke", "black")
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

                let tooltip = d3.select('.tooltip');

                let that = this;

                circles.on('mouseover', function(d,i) {
                    tooltip.transition()
                        .duration(200)
                        .style("opacity", 0.9);
            
                    tooltip.html(that.tooltipDivRender(d))
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
                });

                circles.on("mouseout", function(d,i) {
                    tooltip.transition()
                        .duration(500)
                        .style("opacity", 0);
                });

        };

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

                            svg.selectAll("circle").classed("notbrushed", true);

                            activeBrushNode.selectAll("circle")
                                .filter(d=>d.xVal>=that.xScale.invert(x1) && d.xVal<=that.xScale.invert(x2))
                                .classed("notbrushed",false);
                                
                        }
                        else if (that.isExpanded === false) {
                            svg.selectAll("circle").classed("notbrushed", true);

                            svg.selectAll("circle")
                                .filter(d=>d.xVal>=that.xScale.invert(x1) && d.xVal<=that.xScale.invert(x2))
                                .classed("notbrushed",false);
                        }

                        that.updateTable(selectionData);
                    }
                   
                });
            brush   
                .on('end', function() {
                    
                    let brushSelection = d3.brushSelection(selectionThis);
                    if(!brushSelection){
                        svg.selectAll("circle").classed("notbrushed",false);
                        that.updateTable(that.circles_arr);
                        return;
                    }
                 
                    if (brushSelection !== null) {
                        let [x1,x2] = brushSelection;
                        
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

                        svg.selectAll("circle").classed("notbrushed", true);

                        activeBrushNode.selectAll("circle")
                            .filter(d=>d.xVal>=that.xScale.invert(x1) && d.xVal<=that.xScale.invert(x2))
                            .classed("notbrushed",false);
        
                    }
                    else if (that.isExpanded === false) {
                        svg.selectAll("circle").classed("notbrushed", true);

                        svg.selectAll("circle")
                            .filter(d=>d.xVal>=that.xScale.invert(x1) && d.xVal<=that.xScale.invert(x2))
                            .classed("notbrushed",false);
                    }
                    that.updateTable(selectionData);
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
        this.count = 1;
        let that = this;

        that.updateTable(null);

        if (that.isExpanded === false){
            that.isExpanded = true;

            d3.selectAll('.brushes').remove();

            document.getElementById('overlay').style.display = "none";
            that.isExtreme = false; 
            
            that.drawChart();

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

            that.addCatLabels();
        }
        else if (that.isExpanded === true) {
            that.isExpanded = false;

            d3.selectAll('.brushes').remove();

            document.getElementById('overlay').style.display = "none";
            that.isExtreme = false; 

            that.drawChart();

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
         
            this.isExtreme = true; 

            if (this.isExpanded) {
                debugger;
            
                let scrollvert = document.getElementById('dem-Extreme').scrollTop;

                let scrollside = document.getElementById('dem-Extreme').scrollLeft;

                let rect = document.getElementById('dem-Extreme');
                
                let coord = rect.getBoundingClientRect();

                let drDiv = d3.select('#overlay')
                                .style("top", 0 + "px")
                                .style("left", 0 + "px");

                rect.select('#dem-Extreme').classed("blueChosen", true);

                drDiv.append("div")
                    .attr("id", "textDem")
                    .style("width", "100px")
                    .style("height", "70px");

                let textDiv = d3.select('#textDem')
                        .style("position", "absolute")
                        .style("top", coord.y - scrollvert+ "px")
                        .style("left", 0 - scrollside + "px")
                        .style("border", "2px solid black")
                        .classed("textDiv", true);
                
                textDiv.html(this.extremeRender("dem"));

                let rect2 = document.getElementById('rep-Extreme');
                
                let coord2 = rect2.getBoundingClientRect();

                drDiv.append("div")
                    .attr("id", "textRep")
                    .style("width", "100px")
                    .style("height", "70px");

                let textDiv2 = d3.select('#textRep')
                        .style("position", "relative")
                        .style("top", coord2.y+60 - scrollvert + "px")
                        .style("left", coord2.x - scrollside + "px")
                        .style("border", "2px solid black")
                        .classed("textDiv", true);
                
                textDiv2.html(this.extremeRender("rep"));

                document.getElementById('overlay').style.display = "block";
                
            }
            else if (this.isExpanded === false) {
                let scrollvert = document.getElementById('dem-Extreme').scrollTop;

                let scrollside = document.getElementById('dem-Extreme').scrollLeft;

                let rect = document.getElementById('dem-Extreme');
                
                let coord = rect.getBoundingClientRect();

                let drDiv = d3.select('#overlay')
                                .style("top", 0 + "px")
                                .style("left", 0 + "px");

                drDiv.append("div")
                    .attr("id", "textDem")
                    .style("width", "100px")
                    .style("height", "70px");

                let textDiv = d3.select('#textDem')
                        .style("position", "relative")
                        .style("top", coord.y+35 - scrollvert+ "px")
                        .style("left", coord.x -225 - scrollside + "px")
                        .style("border", "2px solid blue")
                        .style("background", "steelblue")
                        .classed("textDiv", true);

                drDiv.select('#dem-Extreme')
                    .classed("blueChosen", true);
                
                textDiv.html(this.extremeRender("dem"));

                let rect2 = document.getElementById('rep-Extreme');
                
                let coord2 = rect2.getBoundingClientRect();

                drDiv.append("div")
                    .attr("id", "textRep")
                    .style("width", "100px")
                    .style("height", "70px");

                let textDiv2 = d3.select('#textRep')
                        .style("position", "relative")
                        .style("top", coord2.y-50 + "px")
                        .style("left", coord2.x + 100 + "px")
                        .style("border", "2px solid red")
                        .style("background", "orangered")
                        .classed("textDiv", true);
                
                textDiv2.html(this.extremeRender("rep"));

                document.getElementById('overlay').style.display = "block";

            }
        }
        else if (this.isExtreme === true) {
            this.isExtreme = false;

            document.getElementById('overlay').style.display = "none";            
        }
    }

    extremeRender(identifier) {
        if (identifier === "dem") {
            let text = "<h5>" + "Democratic speeches" + "<br/>" +
                        "mentioned climate change" + "<br/>" +
                        "49.11% more </h5>";
            return text;
        }
        else if (identifier === "rep") {
            let text = "<h5>" + "Republican speeches" + "\n" +
                        "mentioned prison" + "\n" +
                        "52.33% more" + "</h5>";
            return text;
        }
    }

    tooltipDivRender(data) {
        let phrase = data['phrase'];
        let freq = data['frequency']*100;
        let frequency_fixed = freq.toFixed(0)
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
        return "<h5>" + phrase + "<br/>" + 
            party + " " + pos + "%" +"<br/>" + 
            "In " + frequency_fixed + "%" + " of speeches" + "</h5>";
    }

}