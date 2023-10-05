import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import Papa from "papaparse";
import SearchBarPersonalizado from "./SearchBarPersonalizado";

const LineChartPersonalizado = () => {
  const svgRef = useRef(null);
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!selectedCountry) {
          // No hay país seleccionado, no renderizar la gráfica
          return;
        }

        // Cargar los datos desde tu archivo CSV
        const response = await fetch("/src/data/data.csv");
        const csvString = await response.text();

        // Parsear los datos CSV
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

        // Filtrar terremotos por país si se ha seleccionado uno
        const filteredData =
          selectedCountry !== null
            ? parsedData.filter(
                (item) => item.Country === selectedCountry && item.Mag >= 7.0
              )
            : parsedData.filter((item) => item.Mag >= 7.0);

        // Ordenar los datos por fecha
        filteredData.sort((a, b) => new Date(a.Date) - new Date(b.Date));

        // Obtener el valor mínimo de Mag
        const minMag = d3.min(filteredData, (d) => d.Mag);

        // Configurar dimensiones del gráfico
        const width = 960;
        const height = 500;
        const margin = { top: 20, right: 20, bottom: 30, left: 60 };

        // Crear el elemento SVG
        const svg = d3
          .select(svgRef.current)
          .attr("width", width)
          .attr("height", height);

        // Escala para el eje x (fechas)
        const xScale = d3
          .scaleTime()
          .domain(d3.extent(filteredData, (d) => new Date(d.Date)))
          .range([margin.left, width - margin.right]);

        // Escala para el eje y (magnitud)
        const yScale = d3
          .scaleLinear()
          .domain([minMag, d3.max(filteredData, (d) => d.Mag)])
          .nice()
          .range([height - margin.bottom, margin.top]);

        // Crear la línea
        const line = d3
          .line()
          .x((d) => xScale(new Date(d.Date)))
          .y((d) => yScale(d.Mag));

        // Actualizar la línea y los ejes con los datos filtrados
        svg.selectAll("*").remove(); // Limpiar elementos previos
        svg
          .append("path")
          .datum(filteredData)
          .attr("fill", "none")
          .attr("stroke", "blue")
          .attr("stroke-width", 2)
          .attr("d", line);

        // Eje x
        svg
          .append("g")
          .attr("transform", `translate(0,${height - margin.bottom})`)
          .call(d3.axisBottom(xScale))
          .selectAll("text")
          .style("text-anchor", "middle");

        // Eje y
        svg
          .append("g")
          .attr("transform", `translate(${margin.left},0)`)
          .call(d3.axisLeft(yScale));

        // Etiquetas de ejes
        svg
          .append("text")
          .attr("x", width / 2)
          .attr("y", height)
          .style("text-anchor", "middle")
          .text("Año");

        svg
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("x", -height / 2)
          .attr("y", margin.left - 35)
          .style("text-anchor", "middle")
          .text("Magnitud");

        // Añade estilos de Tailwind CSS aquí
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    fetchData();
  }, [selectedCountry]);

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-5 text-center">
        Serie Temporal de Magnitud de Terremotos (Mag {">="} 7.0){" "}
        {selectedCountry && `en ${selectedCountry}`}
      </h1>
      <SearchBarPersonalizado
        onSearch={() => {}}
        onCountrySelect={handleCountrySelect}
      />
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default LineChartPersonalizado;
