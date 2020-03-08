
const margin = 50;
const padding = 30;
const h = 600 - margin;
const w = 800 - margin;

let stateName = 'California';

console.log(margin);

let svg = d3.select("body").append('svg')
    .attr('width', w)
    .attr('height', h);

// //scale function
// let xScale = d3.scaleLinear()
//     .domain([0, 200000])
//     .range([padding, w - padding * 2]);

// let yScale = d3.scaleLinear()
//     .domain([20, 80]) //d3.max(data, function (d) { return d['life_expectancy']; })
//     .range([h - padding, padding]);

d3.csv('./474data_new.csv').then((data) => {

    let filtData = data.filter(d => d['Name'] == stateName);

    let newJson = '';
    newJson += '[{"total_population": ' + filtData[0]['Total_Population'] +'}]';
    console.log(JSON.parse(newJson));

    //console.log(filtData);


});