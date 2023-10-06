import React from "react";

const BarChartRace = () => {
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-3">Bar Chart Race</h1>
      <video className="w-full max-w-screen-xl h-auto" controls>
        <source src="/public/bar_chart_race.mp4" type="video/mp4" />
        Magnitudes Acumuladas por País por Año
      </video>
    </div>
  );
};

export default BarChartRace;
