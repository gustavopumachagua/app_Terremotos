import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import Papa from "papaparse";
import SearchBarPersonalizado from "./SearchBarPersonalizado";

const LineChart = () => {
  const svgRef = useRef(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Función para manejar el cambio de país seleccionado
  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/src/data/data.csv");
        const csvString = await response.text();

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

        // Filtrar datos por el país seleccionado
        const filteredData =
          selectedCountry !== null
            ? parsedData.filter((item) => item.Country === selectedCountry)
            : parsedData;

        const data = filteredData.map((d) => ({
          year: new Date(d.Date).getFullYear(),
          count: 1,
        }));

        const groupedData = d3.groups(data, (d) => d.year);

        // Limpiar el contenido del SVG antes de renderizar una nueva gráfica
        d3.select(svgRef.current).selectAll("*").remove();

        const margin = { top: 20, right: 20, bottom: 30, left: 40 };
        const width = 960 - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;

        const svg = d3
          .select(svgRef.current)
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3
          .scaleLinear()
          .domain(d3.extent(data, (d) => d.year))
          .nice()
          .range([0, width]);

        const y = d3
          .scaleLinear()
          .domain([0, d3.max(groupedData, (d) => d[1].length)])
          .nice()
          .range([height, 0]);

        const line = d3
          .line()
          .x((d) => x(d[0]))
          .y((d) => y(d[1].length));

        svg
          .append("path")
          .datum(groupedData)
          .attr("fill", "none")
          .attr("stroke", "blue")
          .attr("stroke-width", 2)
          .attr("d", line);

        svg
          .append("g")
          .attr("transform", `translate(0,${height})`)
          .call(d3.axisBottom(x).tickFormat(d3.format("d")))
          .selectAll("text")
          .attr("class", "text-gray-700"); // Tailwind CSS class for text color

        svg
          .append("g")
          .call(d3.axisLeft(y))
          .selectAll("text")
          .attr("class", "text-gray-700");

        svg
          .append("text")
          .attr("x", width / 2)
          .attr("y", margin.bottom + 450)
          .attr("text-anchor", "middle")
          .text("Año")
          .attr("class", "axis-label");

        svg
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("x", -height / 2)
          .attr("y", -margin.left + 10)
          .attr("text-anchor", "middle")
          .text("Cantidad de terremotos")
          .attr("class", "axis-label");

        // Marcar que los datos se han cargado y el gráfico debe renderizarse
        setDataLoaded(true);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    // Llama a fetchData siempre que selectedCountry cambie
    if (selectedCountry !== null) {
      fetchData();
    } else {
      // Marcar que los datos se han cargado y el gráfico debe renderizarse
      setDataLoaded(true);
    }
  }, [selectedCountry]);

  return (
    <div className="mx-auto p-5">
      <h1 className="text-3xl font-bold mb-5 text-center">
        Gráfico de Serie Temporal Por Años{" "}
        {selectedCountry && `en ${selectedCountry}`}
      </h1>
      <SearchBarPersonalizado
        onSearch={() => {}}
        onCountrySelect={handleCountrySelect}
      />
      {dataLoaded && <svg ref={svgRef}></svg>}
    </div>
  );
};

export default LineChart;
