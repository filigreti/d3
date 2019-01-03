(function () {
    var width = 1358,
        height = 500;

    var svg = d3.select("#chart")
        .append("svg")
        .attr("height", height)
        .attr("width", width)
        .append("g")
        .attr("transform", "translate(0,0)")



    var defs = svg.append("defs");
    defs.append("pattern")
        .attr("id", "jon-snow")
        .attr("height", "100%")
        .attr("width", "100%")
        .attr("patternContentUnits", "objectBoundingBox")
        .append("image")
        .attr("height", 1)
        .attr("width", 1)
        .attr("preserveAspectRatio", "none")
        .attr("xmlns:xlink", "http://www.w3.org/1999/xlink")
        .attr("xlink:href", "")



    var radiusScale = d3.scaleSqrt().domain([20, 350]).range([10, 80])

    var forceX = d3.forceX(function (d) {
        if (d.decade === 'pre-2000') {
            return 300
        } else {
            return 900
        }
        return width / 2
    }).strength(0.05)

    var forceCollide = d3.forceCollide(function (d) {
        return radiusScale(d.sales) + 1
    })


    var simulation = d3.forceSimulation()
        .force("x", forceX)
        .force("y", d3.forceY(height / 2).strength(0.05))
        .force("collide", forceCollide)

    d3.queue()
        .defer(d3.csv, "sales.csv")
        .await(ready)

    function ready(error, datapoints) {
        defs.selectAll(".artist-pattern")
            .data(datapoints)
            .enter().append("pattern")
            .attr("class", "artist-pattern")
            .attr("id", function (d) {
                return d.name.toLowerCase().replace(/ /g, "-")
            })
            .attr("height", "100%")
            .attr("width", "100%")
            .attr("patternContentUnits", "objectBoundingBox")
            .append("image")
            .attr("height", 1)
            .attr("width", 1)
            .attr("preserveAspectRatio", "none")
            .attr("xmlns:xlink", "http://www.w3.org/1999/xlink")
            .attr("xlink:href", function (d) {
                return d.image_path

            })

        var circles = svg.selectAll(".artist")
            .data(datapoints)
            .enter().append("circle")
            .attr("class", "artist")
            .attr("r", function (d) {
                return radiusScale(d.sales)
            })
            .attr("fill", function (d) {
                return "url(#" + d.name.toLowerCase().replace(/ /g, "-") + ")"
            })
            .attr("cx", 100)
            .attr("cy", 300)
            .style("stroke", "black")
            .on("mouseover", function () {
                tooltip.style("display", null)
            })
            .on("mouseout", function () {
                tooltip.style("display", "none")
            })
            .on("mousemove", function (d) {
                var xPos = d3.mouse(this)[0] - 15;
                var yPos = d3.mouse(this)[1] - 55;
                tooltip.attr("transform", "translate(" + xPos + "," + yPos + ")");
                tooltip.select("text").text(d.name + " : " + d.decade);
            })

            var tooltip = svg.append("g")
            .attr("class", tooltip)
            .style("display", "none");

            tooltip.append("text")
            .attr("x", 15)
            .attr("dy", "1.2em")
            .style("font-size", "1.25em")
            .attr("font-weight", "bold")



        d3.select("#decade").on('click', function () {
            simulation
                .force("x", forceX)
                .alphaTarget(0.5)
                .restart()

        })

        d3.select('#combine').on('click', function () {
            simulation
                .force("x", d3.forceX(width / 2).strength(0.05))
                .alphaTarget(0.5)
                .restart()
        })



        simulation.nodes(datapoints)
            .on('tick', ticked)

        function ticked() {
            circles
                .attr("cx", function (d) {
                    return d.x
                })
                .attr("cy", function (d) {
                    return d.y
                })
        }
    }
})();