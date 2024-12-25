import React from "react";

const YearSelector = ({ selectedYear, onYearChange }) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  return (
    <div className="flex space-x-2 bg-white rounded-lg shadow-md p-2">
      {years.map((year) => (
        <button
          key={year}
          onClick={() => onYearChange(year.toString())}
          className={`px-4 py-2 rounded-md transition-colors ${
            selectedYear === year.toString()
              ? "bg-f1-red text-white"
              : "hover:bg-gray-100"
          }`}
        >
          {year}
        </button>
      ))}
    </div>
  );
};

export default YearSelector;
