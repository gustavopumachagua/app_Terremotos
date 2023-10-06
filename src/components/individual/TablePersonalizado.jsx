import React, { useState, useEffect } from "react";
import * as d3 from "d3";
import SearchBarPersonalizado from "./SearchBarPersonalizado";

const TablePersonalizado = () => {
  const [data, setData] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("public/data.csv");
        const text = await response.text();
        const parsedData = d3.csvParse(text);

        const selectedCountryData = parsedData.filter(
          (item) => item.Country === selectedCountry
        );

        const top10SelectedCountry = selectedCountryData
          .sort((a, b) => parseFloat(b.Mag) - parseFloat(a.Mag))
          .slice(0, 10);

        top10SelectedCountry.forEach((item) => {
          if (item.Mag < 7) item.Rango = "<7";
          else if (item.Mag < 8) item.Rango = "7-8";
          else if (item.Mag < 9) item.Rango = "8-9";
          else item.Rango = "9-10";
        });

        setData(top10SelectedCountry);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [selectedCountry]);

  return (
    <div className="container mx-auto my-5">
      <h1 className="text-3xl font-bold mb-5 text-center">
        Top 10 Terremotos {selectedCountry && `en ${selectedCountry}`}
      </h1>
      <SearchBarPersonalizado
        onSearch={() => {}}
        onCountrySelect={handleCountrySelect}
      />
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-2 px-4">Rango</th>
              <th className="py-2 px-4">Magnitud</th>
              <th className="py-2 px-4">Profundidad</th>
              <th className="py-2 px-4">Lugar</th>
              <th className="py-2 px-4">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-gray-100" : ""}>
                <td className="py-2 px-4">{item.Rango}</td>
                <td className="py-2 px-4">{item.Mag}</td>
                <td className="py-2 px-4">{item.Depth}</td>
                <td className="py-2 px-4">{item.Place}</td>
                <td className="py-2 px-4">{item.Date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TablePersonalizado;
