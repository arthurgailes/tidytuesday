
const fig = {
  margin: {top:50,right:20, bottom:20, left: 40}
};
fig.height = height - fig.margin.top - fig.margin.bottom;
fig.width = width - fig.margin.right - fig.margin.left;

var x = d3.scaleLinear()
          .range([0, fig.width])
          .domain(d3.extent(data, d=> d.year_create))
          ;
var y = d3.scaleLinear()
          .range([fig.height, fig.margin.top])
          .domain([d3.min(data, d=> d.age), d3.max(data, d=> d.age)])
          ;
const xAxis = d3.axisBottom(x)
  .tickFormat(d3.format(".0f"))
  .ticks(20)
  ;
  
const yAxis = d3.axisLeft(y)
;

const genderColor = {'Male':'#619CFF', 'Female':"#F8766D"};

const trans = d3.transition().duration(200);
// add dots
svg
  .selectAll('.dot')
  .append('g')
  .data(data)
  .join('circle')
    .attr('class', d=> "dot " + d.gender)
    .attr('cx', d=> x(d.year_create) + fig.margin.left)
    .attr('cy', d=> y(d.age))
    .attr('r',3)
    .style('fill',d=> genderColor[d.gender])
    .style('opacity',0.7)
    .on('mouseover',highlight)
    .on('mouseout',backToNormal)
;
// Axes
svg.append('g')
  .attr('transform','translate(' + fig.margin.left + ',' + fig.height + ')')
  .call(xAxis)
  .selectAll('text')
  .style('text-anchor','end')
  .attr('transform','rotate(-65)')
  .attr("dx", "-.8em")
  .attr("dy", ".15em")
  ;
  
svg.append('g')
  .attr('transform','translate(' + fig.margin.left + ')')
  .call(yAxis)
  ;
svg.append('text')
  .attr('class','axisLabel')
  .attr('x',fig.width/2 - fig.margin.right)
  .attr('y', height - 5)
  .text('Artist Age')
;
svg.append('text')
  .attr('class','axisLabel')
  .attr('x',0-height/1.5)
  .attr('y', 12)
  .attr('transform','rotate(-90)')
  .text('Year of First Artwork')
  ;

// title
svg.append('text')
  .attr('class','chartTitle')
  .text('Age of Artists at Creation of First Major Artwork')
  .attr("text-anchor", "middle")
  .attr('y', fig.margin.top)
  .attr('x', fig.width/2)
  .attr('font-size','18px')
;
svg.append('text')
  .attr('class','chartSubTitle')
  .attr("text-anchor", "middle")
  .attr('y', fig.margin.top + 30)
  .attr('x', fig.width/2)
  .attr('font-size','16px')
  ;
// highlighter function
function highlight(e){
  const d = e.target.__data__,
    parent = d3.select(e.target.parentElement);
  // first, make everything grey
  parent.selectAll('.dot')
    .transition()
    .duration(200)
    .style('fill','lightgrey')
  ;
  // highlight selected
  parent.selectAll('.dot.' + d.gender)
    .transition().duration(200)
    .style('fill', genderColor[d.gender])
    .style('r','7px')
  // change title
  parent.select('.chartSubTitle')
    .text("Showing " + d.gender.toProperCase() + "s") 
    .transition().duration(200)
    .style('fill', genderColor[d.gender])
    ;
}

function backToNormal(e){
  const d = e.target.__data__,
    parent = d3.select(e.target.parentElement);

// return dots to neutral
  parent.selectAll('.dot')
    .transition()
    .duration(200)
    .style('fill',d=> genderColor[d.gender])
    .style('r','3px')
  ;
  
    // change title
  parent.select('.chartSubTitle')
    .text("Showing Both Genders")
    .transition().duration(200)
    .style('fill', 'grey')
    ;
  
}

String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};
