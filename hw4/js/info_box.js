/** Data structure for the data associated with an individual country. */
class InfoBoxData {
    /**
     *
     * @param country name of the active country
     * @param region region of the active country
     * @param indicator_name the label name from the data category
     * @param value the number value from the active year
     */
    constructor(country, region, indicator_name, value) {
        this.country = country;
        this.region = region;
        this.indicator_name = indicator_name;
        this.value = value;
    }
}

/** Class representing the highlighting and selection interactivity. */
class InfoBox {
    /**
     * Creates a InfoBox Object
     * @param data the full data array
     */
    constructor(data) {
        
        //TODO - your code goes here -
        this.data = data;
    }

    /**
     * Renders the country description
     * @param activeCountry the IDs for the active country
     * @param activeYear the year to render the data for
     */
    updateTextDescription(activeCountry, activeYear) {
        // ******* TODO: PART 4 *******
        // Update the text elements in the infoBox to reflect:
        // Selected country, region, population and stats associated with the country.
        /*
         * You will need to get an array of the values for each category in your data object
         * hint: you can do this by using Object.values(this.data)
         * you will then need to filter just the activeCountry data from each array
         * you will then pass the data as paramters to make an InfoBoxData object for each category
         *
         */

        //TODO - your code goes here -
        let categories = ["population", "gdp", "child-mortality", "life-expectancy",
                        "fertility-rate"];

        let infobox_data = [];

        for (let i = 0; i < categories.length; i++) {
            let select_category = categories[i];
        
            for (let k = 0; k < this.data[""+select_category].length; k++) {
                if (this.data[""+select_category][k].geo.toUpperCase() === activeCountry ||
                this.data[""+select_category][k].geo === activeCountry) {
                    let country_name = this.data[""+select_category][k].country;

                    let infobox = new InfoBoxData(country_name, 
                        "region", ""+select_category, 
                        this.data[""+select_category][k][""+activeYear]);
                        infobox_data.push(infobox);
                }
            }
        }

        for (let i = 0; i < infobox_data.length; i++) {
            for (let k = 0; k < this.data["population"].length; k++) {
                if (infobox_data[i].country === this.data["population"][k].country) {
                    infobox_data[i].region = this.data["population"][k].region;
                }
            }
        }

        let country_name = infobox_data[0].country;

        d3.select("#country-detail").selectAll("text")
            .remove();

        d3.select("#country-detail").selectAll("svg")
            .remove();

        d3.select("#country-detail").selectAll("circle")
            .remove();

        d3.select("#country-detail").append("text")
            .attr("x", 40)
            .attr("y", 40)
            .text(country_name)
            .attr("class", ""+infobox_data[0].region);

        let text_box = d3.select("#country-detail").append("svg")
            .attr("width", 780)
            .attr("height", 300)
            .attr("id", "textbox_container");

        text_box.selectAll("#textbox_container").remove();

        text_box.selectAll("text")
            .data(infobox_data)
            .join("text")
            .attr("y", (d,i) => 20+(i*20))
            .text(function(d) {return d.indicator_name +": " + d.value});

        
        d3.select("#textbox_container").append("circle")
            .attr("cx", 75)
            .attr("cy",150)
            .attr("r", 20)
            .attr("class", d => {return infobox_data[0].region});

        d3.select("#textbox_container").append("text")
            .attr("x", 0)
            .attr("y",150)
            .text("region:");

    }

    /**
     * Removes or makes invisible the info box
     */
    clearHighlight() {

        //TODO - your code goes here -
        d3.select("#country-detail").selectAll("text")
            .style("opacity", 1)
            .remove()
            .transition()
            .duration(1500)
            .style("opacity", 0);

        d3.select("#country-detail").selectAll("circle")
            .style("opacity", 1)
            .remove()
            .transition()
            .duration(1500)
            .style("opacity", 0);

    }

}