// /**
// * Requests the file and executes a callback with the parsed result once
// * it is available
// * @param {string} path - The path to the file.
// * @param {function} callback - The callback function to execute once the result is available
// */
// function fetchJSONFile(path, callback) {
//     let httpRequest = new XMLHttpRequest();
//     httpRequest.onreadystatechange = function() {
//         if (httpRequest.readyState === 4) {
//             if (httpRequest.status === 200) {
//                 let data = JSON.parse(httpRequest.responseText);
//                 if (callback) callback(data);
//             }
//         }
//     };
//     httpRequest.open('GET', path);
//     httpRequest.send();
// }

// function updateTable(newData) {

// }

// // call fetchJSONFile then build and render a tree
// // this is the function executed as a callback when parsing is done
// fetchJSONFile('data/words.json', function(data) {
//     debugger;
//     let bubbles = new bubblechart(data);
//     bubbles.drawChart();
//     let bars = new table(data);
//     bars.drawTable();

// });

words_json = d3.json('data/words.json');

Promise.all([words_json]).then(data => {
    data.selectedData = null;

    let that = data;

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

    // This clears a selection by listening for a click
    // document.addEventListener("click", function (e) {
    //     ;
    // }, true);
});