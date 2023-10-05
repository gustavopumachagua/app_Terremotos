import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import Papa from "papaparse";
import SearchBarPersonalizado from "./SearchBarPersonalizado"; // Import the search component

const HistogramPersonalizado = () => {
  const svgRef = useRef(null);
  const [data, setData] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
  };

  useEffect(() => {
    Papa.parse("/src/data/data.csv", {
      header: true,
      download: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (result) => {
        const magnitudes = result.data.map((item) => ({
          Mag: item.Mag,
          Country: item.Country,
        }));
        setData(magnitudes);
      },
    });
  }, []);

  useEffect(() => {
    if (data.length === 0 || !selectedCountry) return;

    const filteredData = selectedCountry
      ? data.filter((item) => item.Country === selectedCountry)
      : data;

    const width = 960;
    const height = 500;
    const marginTop = 20;
    const marginRight = 20;
    const marginBottom = 30;
    const marginLeft = 40;

    const bins = d3
      .bin()
      .thresholds(40)
      .value((d) => d.Mag)(filteredData);

    const x = d3
      .scaleLinear()
      .domain([
        d3.min(filteredData, (d) => d.Mag),
        d3.max(filteredData, (d) => d.Mag),
      ])
      .nice()
      .range([marginLeft, width - marginRight]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(bins, (d) => d.length)])
      .nice()
      .range([height - marginBottom, marginTop]);

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;");

    svg.selectAll("*").remove();

    svg
      .append("g")
      .attr("fill", "steelblue")
      .selectAll()
      .data(bins)
      .join("rect")
      .attr("x", (d) => x(d.x0) + 1)
      .attr("width", (d) => Math.max(0, x(d.x1) - x(d.x0) - 1))
      .attr("y", (d) => y(d.length))
      .attr("height", (d) => y(0) - y(d.length));

    svg
      .append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(x).ticks(width / 80))
      .call((g) =>
        g
          .append("text")
          .attr("x", width)
          .attr("y", marginBottom - 4)
          .attr("fill", "currentColor")
          .attr("text-anchor", "end")
          .text("Magnitude of Earthquakes →")
      );

    svg
      .append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y).ticks(height / 40))
      .call((g) => g.select(".domain").remove())
      .call((g) =>
        g
          .append("text")
          .attr("x", -marginLeft)
          .attr("y", 10)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .text("↑ Frequency (Number of Earthquakes)")
      );
  }, [data, selectedCountry]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-5 text-center">
        Histograma de Magnitudes de Terremotos{" "}
        {selectedCountry && `en ${selectedCountry}`}
      </h1>
      <SearchBarPersonalizado
        onSearch={() => {}}
        onCountrySelect={handleCountrySelect}
      />
      {selectedCountry && data.length > 0 && (
        <svg ref={svgRef} className="mx-auto my-8"></svg>
      )}
    </div>
  );
};

export default HistogramPersonalizado;
