
const margin = 50;
const padding = 30;
const h = 600 - margin;
const w = 800 - margin;

let stateName = 'California';

console.log(margin);

d3.csv('./474data_new.csv').then((data) => {

    //filter/format the data for use in graph
    let filtData = data.filter(d => d['Name'] == stateName);

    let jsonStr = '[';
    let xVals = [0, 1, 2, 3, 4];

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

    for(let i = 0; i < 5; i++){
        jsonStr += `{"x":` + xVals[i] + `,"y":` + yVals[i] + `,"bracket":"` + bracketLabels[i] +`"},`;
    }
    jsonStr = jsonStr.substr(0, jsonStr.length-1);
    jsonStr += ']';
    
    // console.log(jsonStr);
    // console.log(JSON.parse(jsonStr));

    //scale function
    let xScale = d3.scaleLinear()
        .domain([0,5])
        .range([padding, w]);

    let yScale = d3.scaleLinear()
        .domain([0, 1000000])
        .range([h - padding, padding]);

    //create svg element
    var svg = d3.select("body")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    // make x axis
    const xAxis = svg.append("g")
        .attr("transform", "translate(20," + (h - padding) + ")")
        .call(d3.axisBottom(xScale))

    // make y axis
    const yAxis = svg.append("g")
        .attr("transform", "translate(50,0)")
        .call(d3.axisLeft(yScale))

    let dat = JSON.parse(jsonStr);

    svg.selectAll("circles")
        .data(dat)
        .enter()
        .append("circle")
        .attr("cx", function (d) {
            return xScale(d['x']);
        })
        .attr("cy", function (d) {
            return yScale(d['y']);
        })
        .attr("transform","translate(20,0)")
        .attr("r", 5)
        .attr('fill', 'steelblue')
        .style("stroke", "steelblue")

});