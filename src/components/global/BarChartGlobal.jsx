import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import Papa from "papaparse";

const BarChartGlobal = () => {
  const svgRef = useRef(null);

  useEffect(() => {
    const width = 928;
    const height = 500;
    const marginTop = 30;
    const marginRight = 0;
    const marginBottom = 80;
    const marginLeft = 80;

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    // Load data from CSV using Papaparse
    d3.text("/data.csv").then((data) => {
      const parsedData = Papa.parse(data, { header: true }).data;

      // Count and sort by frequency in descending order
      const countByRegion = d3
        .rollups(
          parsedData,
          (v) => v.length,
          (d) => d.Continent
        )
        .sort((a, b) => b[1] - a[1]);

      const x = d3
        .scaleBand()
        .domain(countByRegion.map((d) => d[0]))
        .range([marginLeft, width - marginRight])
        .padding(0.1);

      const y = d3
        .scaleLinear()
        .domain([0, d3.max(countByRegion, (d) => d[1])])
        .nice()
        .range([height - marginBottom, marginTop]);

      svg
        .selectAll("rect")
        .data(countByRegion)
        .enter()
        .append("rect")
        .attr("x", (d) => x(d[0]))
        .attr("y", (d) => y(d[1]))
        .attr("width", x.bandwidth())
        .attr("height", (d) => height - marginBottom - y(d[1]))
        .attr("fill", "steelblue")
        .attr("class", "bar");

      // Rotate x-axis labels
      svg
        .append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(d3.axisBottom(x).tickSizeOuter(0))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end")
        .attr("dx", "-0.5em")
        .attr("dy", "0.5em")
        .attr("class", (d, i) =>
          i === countByRegion.length - 1 ? "last-label" : ""
        );

      svg
        .append("g")
        .attr("class", "y-axis")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(d3.axisLeft(y).tickFormat((y) => (y * 100).toFixed()))
        .call((g) => g.select(".domain").remove())
        .call((g) =>
          g
            .append("text")
            .attr("x", -marginLeft)
            .attr("y", 10)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .text("↑ Frequency (%)")
        );
    });
  }, []);

  return <svg ref={svgRef} className="mx-auto my-8"></svg>;
};

export default BarChartGlobal;
