words_json = d3.json('data/words.json');

Promise.all([words_json]).then(data => {
    data.selectedData = null;

    let that = data;

    // updates the table with the brushed data when brushed
    // return the original data set when not brushed
    function updateTable(newData) {

        if (newData === null) {
            let bars = new table(data[0]);
            bars.drawTable();
        }
        else {
            that.selectedData = newData;
            bars.updatePhrase(newData);
        }
    }

    let bubbles = new bubblechart(data[0], updateTable);
    bubbles.drawChart();
    let bars = new table(data[0]);
    bars.drawTable();

});