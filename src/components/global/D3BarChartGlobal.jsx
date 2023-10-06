import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import Papa from "papaparse";

const D3BarChartGlobal = () => {
  const svgRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("public/data.csv");
        const csvString = await response.text();

        // Parse data using PapaParse
        const parsedData = await new Promise((resolve, reject) => {
          Papa.parse(csvString, {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
            complete: (result) => {
              resolve(result.data);
            },
            error: (error) => {
              reject(error.message);
            },
          });
        });

        // Process data to get the top 20 earthquakes by country
        const top20 = parsedData.sort((a, b) => b.Mag - a.Mag).slice(0, 20);
        const countByRegion = top20.reduce((acc, cur) => {
          acc[cur.Country] = (acc[cur.Country] || 0) + 1;
          return acc;
        }, {});

        // Sort by frequency in descending order
        const sortedData = Object.entries(countByRegion).sort(
          (a, b) => b[1] - a[1]
        );

        // Configure the chart dimensions and margins
        const width = 800;
        const height = 500;
        const margin = { top: 20, right: 30, bottom: 40, left: 50 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        const svg = d3
          .select(svgRef.current)
          .attr("width", width)
          .attr("height", height);

        const x = d3
          .scaleBand()
          .domain(sortedData.map((d) => d[0]))
          .range([margin.left, innerWidth + margin.left])
          .padding(0.1);

        const y = d3
          .scaleLinear()
          .domain([0, d3.max(sortedData, (d) => d[1])])
          .nice()
          .range([innerHeight, margin.top]);

        svg
          .selectAll("rect")
          .data(sortedData)
          .enter()
          .append("rect")
          .attr("x", (d) => x(d[0]))
          .attr("y", (d) => y(d[1]))
          .attr("width", x.bandwidth())
          .attr("height", (d) => innerHeight - y(d[1]))
          .attr("fill", "skyblue")
          .attr("class", "bar");

        svg
          .append("g")
          .attr("class", "x-axis")
          .attr("transform", `translate(0,${innerHeight})`)
          .call(d3.axisBottom(x).tickSize(6))
          .selectAll("text")
          .style("text-anchor", "end")
          .attr("dx", "-.8em")
          .attr("dy", "-.15em")
          .attr("transform", "rotate(-45)");

        svg
          .append("g")
          .attr("class", "y-axis")
          .attr("transform", `translate(${margin.left},0)`)
          .call(d3.axisLeft(y).tickSize(6));

        svg
          .append("text")
          .attr("x", width / 2)
          .attr("y", height - 10)
          .style("text-anchor", "middle")
          .text("País")
          .attr("class", "axis-label");

        svg
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("x", -height / 2)
          .attr("y", 10)
          .style("text-anchor", "middle")
          .text("Cantidad de Terremotos")
          .attr("class", "axis-label");
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    fetchData();
  }, []);

  return <svg ref={svgRef} className="mx-auto"></svg>;
};

export default D3BarChartGlobal;
