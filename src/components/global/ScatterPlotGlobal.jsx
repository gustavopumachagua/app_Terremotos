import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const ScatterPlotGlobal = () => {
  const svgRef = useRef();

  useEffect(() => {
    const margin = { top: 40, right: 30, bottom: 60, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const loadData = async () => {
      try {
        const data = await d3.csv("public/data.csv");
        return data.map((d) => ({
          Depth: +d.Depth,
          Mag: +d.Mag,
        }));
      } catch (error) {
        console.error("Error loading data:", error);
        return [];
      }
    };

    const renderChart = (data) => {
      const xScale = d3
        .scaleLinear()
        .domain([
          d3.min(data, (d) => d.Depth),
          d3.max(data, (d) => d.Depth) + 10,
        ])
        .range([0, width]);

      const yScale = d3
        .scaleLinear()
        .domain([d3.min(data, (d) => d.Mag), d3.max(data, (d) => d.Mag)])
        .range([height, 0]);

      const colorScale = d3.interpolate("#f7f7f7", "#ff6600");

      svg
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", (d) => xScale(d.Depth))
        .attr("cy", (d) => yScale(d.Mag))
        .attr("r", (d) => d.Mag / 2)
        .attr("fill", (d) => colorScale(d.Mag / d3.max(data, (d) => d.Mag)))
        .attr("opacity", 0.7);

      svg
        .append("text")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom)
        .attr("text-anchor", "middle")
        .attr("class", "text-xl font-bold")
        .text("Profundidad (Km)");

      svg
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -margin.left)
        .attr("dy", "1em")
        .attr("text-anchor", "middle")
        .attr("class", "text-xl font-bold")
        .text("Magnitud");

      svg
        .append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(xScale).ticks(5));

      svg.append("g").call(d3.axisLeft(yScale).ticks(5));
    };

    loadData().then((data) => {
      if (data.length > 0) {
        renderChart(data);
      }
    });
  }, []);

  return <svg ref={svgRef} className="mx-auto my-8"></svg>;
};

export default ScatterPlotGlobal;
