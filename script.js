async function drawScatter() {
  //STEP 1- Access Data
  //******************
  // data from: https://www.kaggle.com/code/alexisbcook/scatter-plots/tutorial
  const dataset = await d3.csv(
    "https://raw.githubusercontent.com/AhmadMobin/bmivscharges/main/Example1_BobRoss/insurance.csv"
  ) //("./insurance.csv")
  //console.log(dataset)
  //console.table(dataset[0])

  const xAccessor = (d) => parseFloat(d.bmi)
  // console.log(xAccessor(dataset[0]))

  const yAccessor = (d) => parseFloat(d.charges)
  // console.log(yAccessor(dataset[0]))

  //STEP 2- Chart Dimensions
  //************************

  //*Note: Scatter plots is typically a square
  //*will take the smaller value of either the window width vs window height
  const width = d3.min([window.innerWidth * 0.9, window.innerHeight * 0.9])

  //set the dimensions and the margins
  let dimensions = {
    width: width,
    height: width,
    margin: {
      top: 10,
      right: 10,
      bottom: 50,
      left: 100,
    },
  }
  //use the dimensions and margins to calculate the width and height of the bounds (the chart area)
  dimensions.boundedWidth =
    dimensions.width - dimensions.margin.right - dimensions.margin.left
  dimensions.boundedHeight =
    dimensions.height - dimensions.margin.top - dimensions.margin.bottom
  console.log(dimensions) // check to see if dimensions.boundedWidth = dimensions.boundedHeight

  //STEP 3- Draw Canvas
  //*******************
  //adding the wrapper and bounds to the html element

  //wrapper (total visual area)
  const wrapper = d3
    .select("#wrapper")
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height)

  //bounds: area available for the chart
  const bounds = wrapper
    .append("g")
    .style(
      "transform",
      `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`
    )

  //STEP 4: Create Scales
  //~~~~~~~~~~~~~~~~~~~~~~
  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(dataset, xAccessor))
    .range([0, dimensions.boundedWidth])
    .nice()

  //    console.log(d3.extent(dataset, xAccessor)) // min = 15.96 ; max = 53.13
  //     console.log(xScale(53.13))

  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(dataset, yAccessor))
    .range([dimensions.boundedHeight, 0]) // min = 10043.249 ; max = 9991.03765;
    .nice()
  //console.log(d3.extent(dataset, yAccessor))
  // console.log(yScale(9991.03765))

  //STEP 5: Draw Data
  //~~~~~~~~~~~~~~~~~~

  const dots = bounds.selectAll("circle").data(dataset)
  //console.log(dots)
  dots
    .join("circle")
    .attr("cx", (d) => xScale(xAccessor(d)))
    .attr("cy", (d) => yScale(yAccessor(d)))
    .attr("r", 1.5)
    .attr("fill", "#af9358")

  // * Step 6: Draw Peripherals

  // *x-Axis
  const xAxisGenerator = d3.axisBottom().scale(xScale)

  const xAxis = bounds
    .append("g")
    .call(xAxisGenerator)
    .style("transform", `translateY(${dimensions.boundedHeight}px)`)

  const xAxisLabel = xAxis
    .append("text")
    .attr("x", dimensions.boundedWidth / 2)
    .attr("y", dimensions.margin.bottom - 0)
    .attr("fill", "blue")
    .style("font-size", "3em")
    .html("Body Mass Index")

  // *y-Axis
  const yAxisGenerator = d3.axisLeft().scale(yScale)

  const yAxis = bounds.append("g").call(yAxisGenerator)

  const yAxisLabel = yAxis
    .append("text")
    .attr("x", -dimensions.boundedHeight / 2)
    .attr("y", -dimensions.margin.left + 40)
    .attr("fill", "green")
    .style("font-size", "3em")
    .text("Charges ($)")
    .style("transform", "rotate(-90deg)")
    .style("text-anchor", "middle")
}
drawScatter()
