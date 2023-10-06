import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const dataUrl = "/data.csv";

const TableGlobal = () => {
  const tableRef = useRef(null);
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await fetch(dataUrl);
      const data = await response.text();
      const parsedData = d3.csvParse(data);
      setData(parsedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (data.length === 0 || !tableRef.current) return;

    tableRef.current.innerHTML = "";

    const top10 = data
      .sort((a, b) => parseFloat(b.Mag) - parseFloat(a.Mag))
      .slice(0, 10);

    const table = d3
      .select(tableRef.current)
      .append("table")
      .attr("class", "min-w-full border");

    const headers = ["Magnitud", "Profundidad (Km)", "País", "Lugar", "Fecha"];

    const thead = table.append("thead").attr("class", "bg-gray-800 text-white");
    const tbody = table
      .append("tbody")
      .attr("class", "bg-white divide-y divide-gray-200");

    thead
      .append("tr")
      .selectAll("th")
      .data(headers)
      .enter()
      .append("th")
      .attr("class", "px-6 py-3 text-center font-semibold")
      .text((d) => d);

    const rows = tbody.selectAll("tr").data(top10).enter().append("tr");

    rows.attr("class", (_, i) => (i % 2 === 0 ? "bg-gray-100" : ""));

    rows
      .selectAll("td")
      .data((d) => [d.Mag, d.Depth, d.Country, d.Place, d.Date])
      .enter()
      .append("td")
      .attr("class", "px-6 py-4 whitespace-nowrap")
      .text((d) => d);
  }, [data]);

  return <div ref={tableRef}></div>;
};

export default TableGlobal;
