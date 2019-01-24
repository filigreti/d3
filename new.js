(function () {


    



    var width = 800,
        height = 600;

    var svg = d3.select("#chart")
        .append("svg")
        .attr("height", height)
        .attr("width", width)
        .append("g")
        .attr("transform", "translate(0,0)")

    var defs = svg.append("defs"); 

    var radiusScale = d3.scaleSqrt().domain([20, 250]).range([10, 60]);
 

    var forceX = d3.forceX(function (d) { 
        return width / 2
    }).strength(0.07)

    var forceCollide = d3.forceCollide(function (d) {
        return radiusScale(d.articles.score) + 2
    })


    var simulation = d3.forceSimulation()
        .force("x", forceX)
        .force("y", d3.forceY(height/2).strength(0.05))
        .force("collide", forceCollide)

    d3.queue()
        .defer(d3.json, "sales.json")
        .await(ready)
       


    

    function ready(error, datapoints) {
        let quotesArray = [];

        datapoints.forEach(data => {
            data.quotes.quote_list.forEach(quote => {
                quotesArray.push(quote)
            })
        })

        let sortedQuotes = quotesArray.sort((q1, q2) => {
          let q1Views = parseInt(q1.views);
          let q2Views = parseInt(q2.views);
          if(q1Views < q2Views) return 1;
          if(q1Views == q2Views) return 0;
          if(q1Views > q2Views) return -1;
        })
        let aside = d3.select("aside")
        let subHeader = d3.select("#sub-header")
        let panelBody = d3.select(".panel-body")
        let panelHead = d3.select(".panel-head")
        let articleList = panelBody.select('.article-list')
        let tabTwo = panelBody.select('.tab-two')
        let tabOne = panelBody.select('.tab-one')

        let entityImg = tabTwo.select('#pic-section').select('img')
        let entityName = tabTwo.select('#pic-section').select('h4')
        let entityTittle = tabTwo.select('#bio-section')
            .select('h3')  
            .text("QUICK BIO")
        let entityAge = tabTwo.select('#bio-section').select('p:nth-of-type(1)')
        let entityCountry = tabTwo.select('#bio-section').select('p:nth-of-type(2)')  
        let entityWorth = tabTwo.select('#bio-section').select('p:nth-of-type(3)')
        let entityTotalQuotes = tabTwo.select('#bio-section').select('p:nth-of-type(4)')
        let entityBio = tabTwo.select('#bio-section').select('p:nth-of-type(5)') 
        let mainchart = d3.select('#chart')
        let mainchart2 = d3.select('#chart2')

        articleList.selectAll("li")
          .data(sortedQuotes.slice(0, 7))
          .enter()
          .append("li")
          .text(quote => {
            return quote.quote
          })

        defs.selectAll(".artist-pattern")
            .data(datapoints)
            .enter()
            .append("pattern")
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
            .classed("artist", true)
            .attr("stroke", "brown")
            .attr("r", function (d) {
                return radiusScale(d.articles.score)
            })
            .attr("fill", function (d) {
                return "url(#" + d.name.toLowerCase().replace(/ /g, "-") + ")"
            })  
            .on("mouseover", function () {
                tooltip.style("display", null) 
                    // d3.select(this)
                    //   .transition()
                    //   .duration(500) 
                    //   .attr('r', 60) 
                    //   .attr("stroke-width", 5) 

                    if (this !== d3.select('circle:last-child').node()) {
                        this.parentElement.appendChild(this);
                        d3.select(this)
                          .transition()
                          .duration(500) 
                          .attr('r', 70)
                          .attr("stroke-width", 5) 
                      } 
                  
            })
            
            .on("mouseout", function () {
                tooltip.style("display", "none")
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr('r', function(d){
                        return radiusScale(d.articles.score)
                    }) 
                    .attr("stroke-width", 1)
            })
            .on("mousemove", function (d) {
                tooltip.html(
                    '<b>' +  d.name + "</b>" + 
                    "<br/>" +"<p>" + "Viewed by " + d.quotes.total + " people" + "</p>"
                     + "<p>" + "Commented by " + d.age + " people" + "</p>")	     
                .style("top", d3.event.pageY + 20 + "px")
                .style("left", d3.event.pageX + 50 + "px")
                .style("opacity", 1);
            })
            .on("mousedown", function(selectedEntity) {
              
                tabOne.style('display', 'none')
                tabTwo.style('display', 'flex')
                let Info = panelHead.select("#info").style("background-color", "grey").style("color", "white")
                let Article = panelHead.select("#articles").style("background-color", "inherit").style("color", "black")
                entityImg.attr('src', selectedEntity.image_path)
                entityName.text(selectedEntity.name)
                entityAge.text("Age" +" " + ":" + " " + selectedEntity.age)
                entityCountry.text("Country" +" " + ":" + " " + selectedEntity.country)
                entityWorth.text("Est. Net Worth" + " " + ":" + " $" + selectedEntity.net_worth + "M")
                entityTotalQuotes.text("Total Quotes" +" " + ":" + " " + selectedEntity.quotes.total)
                entityBio.text(selectedEntity.bio) 

        
            })
         .on("dblclick",function(d){
                mainchart.style('display', 'none')
                mainchart2.style('display', 'block')
                subHeader.style('display', 'none')
                aside.style('display','none')

                var tooltip = d3.select("body").append("div")
                .attr("class", "chart2")

                var svg = d3.select("#chart2"),
                width = +svg.attr("width"),
                height = +svg.attr("height");
            let arr9 = []
            let arr = []
            let arr2 = []
            let arr3 = []
            let arr4 = []
            let arr5 = []
            let arr6 = []
            let arr7 = []
            let arr8 = []
            let arr10 = []

             let network = [d.network]
             let nodes = d.network.nodes
             let links = d.network.links
            let superlink = links.forEach(function(link){
                arr7.push(link)
            let supernodes = nodes.forEach(function(noded){
                arr8.push(noded)
            })
                
            })
            
          
            
        
             let node2 =  nodes.forEach(function(node){
                //  return node.id
                 arr.push(node.id)
             })
             let node3 =  nodes.forEach(function(node){
            
                 arr3.push(node.group)
             })
           
             let link2 = links.forEach(function(link){
                 arr2.push(link.value)
             })

             let link3 = links.forEach(function(link2){
                 arr4.push(link2.source.x)
                 
             })
             let link14 = links.forEach(function(link){
                 arr9.push(link.source.y)
             })
            //  let link4 = links.forEach(function(link3){
            //     arr5.push(link3.target.x)
            // })
            // let link15 = links.forEach(function(link3){
            //     arr10.push(link3.target.y)
            // })
             let everything = network.forEach(function(every){
                 arr6.push(every)
                 return every
             })
             console.log(arr6)
          
             var color = d3.scaleOrdinal(d3.schemeCategory20);
             
             var simulation = d3.forceSimulation()
            .force("link", d3.forceLink().arr)
            .force("charge", d3.forceManyBody())
            .force("center", d3.forceCenter(width / 2, height / 2));

            

             var link = svg.append("g")
             .attr("class", "links")
             .selectAll("line")
             .data(arr7)
             .enter()
             .append("line")
             .attr("stroke-width", Math.sqrt());
             
             var node = svg.append("g")
             .attr("class", "nodes")
           .selectAll("g")
           .data(nodes)
           .enter().append("g")

           var circles = node.append("circle")
           .attr("r", 5)
           .attr("fill", color(arr3))
           .call(d3.drag()
               .on("start", dragstarted)
               .on("drag", dragged)
               .on("end", dragended));

            var lables = node.append("text")
               .text(arr)
               .attr('x', 6)
               .attr('y', 3);

               node.append("title")
               .text(arr);
              

               simulation
               .nodes(arr8)
               .on("tick", ticked);
              
            
                simulation.force("link")
                .links(arr7);
                
               

               function ticked() {
                link
                    .attr("x1", arr4)
                    .attr("y1", arr9)
                    .attr("x2", arr5)
                    .attr("y2", arr10)
            
                node
                    .attr("transform", "translate(" + arr6.x + "," + arr6.y + ")")
              }
              function dragstarted() {
                if (!d3.event.active) simulation.alphaTarget(0.3).restart();
                arr6.fx = arr6.x;
                arr6.fy = arr6.y;
              }
              function dragged() {
                arr6.fx = d3.event.x;
                arr6.fy = d3.event.y;
              }
              function dragended() {
                if (!d3.event.active) simulation.alphaTarget(0);
                arr6.fx = null;
                arr6.fy = null;
              }
              
              
            
         
         })
   
            

            //apend a div on hover of each bubble
            var tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0)
    
            tooltip.append("text")
                .attr("x", 15)
                .attr("dy", "1.6em")
                .style("font-size", "30px")
                .attr("font-weight", "bold") 
 
        //Make the bubbles stay combined
        simulation
                .force("x", d3.forceX(width / 2).strength(0.05))
                .alphaTarget(0.05)
                .restart()
        
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


