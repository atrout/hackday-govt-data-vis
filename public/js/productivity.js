var data, japandata ; // a global

function visualizeit() {
    //console.info("visualizing it");

    /*
    BAR CHART
    var chart = d3.select("body").append("div").attr("class", "chart");

    chart.selectAll("div")
        .data(data.observations)
        .enter().append("div")
        .style("width", function(d) { return d.value / 100 + "px"; })
        .text(function(d) { return d.date; });
    */

    var margin = {top: 20, right: 20, bottom: 30, left: 100},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    var parseDate = d3.time.format("%Y-%m-%d").parse;

    var x = d3.time.scale()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var line = d3.svg.line()
        .x(function(d) { return x(d.parsedate); })
        .y(function(d) { 
            if (isNaN(d.close))
                return y(0);
            else
                return y(d.close); 
        });

    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //console.info("requesting gdp");
    d3.json("/gdp", function(error, json) {
        if (error) return console.warn(error);
        data = json;

        console.info("data: ", data);

        data.observations.forEach(function(d) {
            d.parsedate = parseDate(d.date);
            d.close = +d.value;
        });

        console.info("requesting gdp data for japan");
        d3.json("/gdpjapan", function(error, json) {
            if (error) return console.warn(error);
            
            japandata = json;
            console.info("data: ", japandata);

            japandata.observations.forEach(function(d) {
                d.parsedate = parseDate(d.date);
                d.close = +d.value;
            });

            x.domain(d3.extent(data.observations.concat(japandata.observations), function(d) { return d.parsedate; }));
            y.domain(d3.extent(data.observations.concat(japandata.observations), function(d) { return d.close; }));
            //console.info(d3.extent(allobservations, function(d) { return d.close; }));

            //console.info("line: ", line(data.observations));
            svg.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis);

            svg.append("g")
              .attr("class", "y axis")
              .call(yAxis)
            .append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", 6)
              .attr("dy", ".71em")
              .style("text-anchor", "end")
              .text("GDP ($)");

            svg.append("path")
              .datum(data.observations)
              .attr("class", "us")
              .attr("d", line);

            svg.append("path")
              .datum(japandata.observations)
              .attr("class", "japan")
              .attr("d", line);
        });

    });

// Do I want to graph debt over time too? 
http://www.bwater.com/Uploads/FileManager/research/how-the-economic-machine-works/ray_dalio__how_the_economic_machine_works__leveragings_and_deleveragings.pdf
http://www.youtube.com/watch?v=PHe0bXAIuk0
}

visualizeit();





