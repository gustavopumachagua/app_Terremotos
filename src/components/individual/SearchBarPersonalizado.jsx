import React, { useState, useEffect } from "react";
import Papa from "papaparse";

const SearchBarPersonalizado = ({ onSearch, onCountrySelect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("public/data.csv");
        const text = await response.text();
        const parsedData = Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
        });

        const uniqueCountries = Array.from(
          new Set(parsedData.data.map((item) => item.Country))
        );
        setCountries(uniqueCountries);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    const filteredSuggestions = countries.filter((country) =>
      country.toLowerCase().startsWith(value.toLowerCase())
    );

    setSuggestions(value.trim() !== "" ? filteredSuggestions : []);
  };

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    onSearch(suggestion);
    onCountrySelect(suggestion);
    setSuggestions([]);
  };

  return (
    <div className="flex items-center flex-wrap">
      <input
        type="text"
        placeholder="Buscar país..."
        value={searchTerm}
        onChange={handleInputChange}
        className="border py-2 px-3 rounded-l w-full lg:w-64 outline-none focus:border-blue-500 mb-2 lg:mb-0"
      />
      <button
        onClick={handleSearch}
        className="bg-blue-500 text-white py-2 px-4 rounded-r hover:bg-blue-700 focus:outline-none">
        Buscar
      </button>

      {suggestions.length > 0 && (
        <ul className="mt-1 p-2 border border-gray-300 absolute bg-white w-full lg:w-64">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="cursor-pointer hover:bg-gray-100 px-3 py-2">
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBarPersonalizado;
