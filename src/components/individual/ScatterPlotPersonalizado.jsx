import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import SearchBarPersonalizado from "./SearchBarPersonalizado";

const ScatterPlotPersonalizado = () => {
  const svgRef = useRef();
  const [data, setData] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
  };

  const clearSVG = () => {
    d3.select(svgRef.current).selectAll("*").remove();
  };

  const renderChart = (data) => {
    clearSVG();

    const margin = { top: 40, right: 30, bottom: 60, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const xScale = d3
      .scaleLinear()
      .domain([d3.min(data, (d) => d.Depth), d3.max(data, (d) => d.Depth) + 10])
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

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch("/data.csv");
        const csvData = await response.text();
        const parsedData = d3.csvParse(csvData, (d) => ({
          Depth: +d.Depth,
          Mag: +d.Mag,
          Country: d.Country,
        }));
        setData(parsedData);
      } catch (error) {
        console.error("Error loading data:", error);
        setData([]);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (data && selectedCountry) {
      const filteredData = data.filter((d) => d.Country === selectedCountry);
      if (filteredData.length > 0) {
        renderChart(filteredData);
      }
    } else {
      clearSVG();
    }
  }, [data, selectedCountry]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-5 text-center">
        Gráfico de dispersión de Profundidad y Magnitud{" "}
        {selectedCountry && `en ${selectedCountry}`}
      </h1>
      <SearchBarPersonalizado
        onSearch={() => {}}
        onCountrySelect={handleCountrySelect}
      />
      <svg ref={svgRef} className="mx-auto my-8"></svg>
    </div>
  );
};

export default ScatterPlotPersonalizado;
