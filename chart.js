
const margin = 50;
const padding = 30;
const h = 600 - margin;
const w = 800 - margin;


d3.csv('./474data_new.csv').then((data) => {

    //create svg element
    var svg = d3.select("body")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    // get the state data
    var stateList = {};
    data.forEach(function(d) {
        stateList[d['Name']] = [];
    });
    var states = Object.keys(stateList).sort();

    // create state filter dropdown
    d3.select('#filter')
    .append('select')
    .attr('id', 'dropdown')
    .selectAll('option')
    .data(states)
    .enter()
    .append('option')
    .attr('id', 'option')
    .attr("value", function (d) { return d; })
    .html(function (d) { return d })

    // set Alabama for the default state
    let stateName = 'Alabama';
    let dropdown, userSelect;

    // user interaction with state dropdown
    d3.select('#filter').on("change", function (d) {
        // get user's inputs
        dropdown = document.getElementById("dropdown");
        userSelect = dropdown.options[dropdown.selectedIndex].value;

        // update chosen state
        stateName = userSelect

        // delete old plot and update new plot
        d3.selectAll("svg > *").remove();
        plotData(data, svg, stateName)
    });

    plotData(data, svg, stateName)
});

function plotData (data, svg, stateName) {
    //filter/format the data for use in graph
    let filtData = data.filter(d => d['Name'] == stateName);

    let yVals = [filtData[0]['tot_under$25k_no_coverage'],
    filtData[0]['tot_$25k_to_$49999_no_coverage'],
    filtData[0]['tot_$50k_$74999_no_coverage'],
    filtData[0]['tot_$75k_$99999_no_coverage'],
    filtData[0]['tot_$100k+_no_coverage']];

    let bracketLabels = ["Under $25k",
        "$25k - $49k",
        "$50k - $74k",
        "$75k - $99k",
        "$100k +"];

    //create json data for graph
    let jsonStr = '[';
    for (let i = 0; i < 5; i++) {
        jsonStr += `{"population_count":` + yVals[i] + `,"bracket":"` + bracketLabels[i] + `"},`;
    }
    jsonStr = jsonStr.substr(0, jsonStr.length - 1);
    jsonStr += ']';

    let dat = JSON.parse(jsonStr);

    //scale functions
    let xScale = d3.scaleBand()
        .domain(bracketLabels)
        .range([padding, w])


    let yScale = d3.scaleLinear()
        .domain([0, (yVals[1] * 1.25)])
        .range([h - padding, padding]);

    // make x axis
    const xAxis = svg.append("g")
        .attr("transform", "translate(20," + (h - padding) + ")")
        .call(d3.axisBottom(xScale));

    // make y axis
    const yAxis = svg.append("g")
        .attr("transform", "translate(50,0)")
        .call(d3.axisLeft(yScale))

    //plot points
    svg.selectAll("circles")
        .data(dat)
        .enter()
        .append("circle")
        .attr("cx", function (d) {
            return xScale(d['bracket']);
        })
        .attr("cy", function (d) {
            return yScale(d['population_count']);
        })
        .attr("transform", "translate(90,0)")
        .attr("r", 5)
        .attr('fill', 'steelblue')
        .style("stroke", "steelblue")
}