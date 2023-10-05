import React from "react";
import BarChartGlobal from "./components/global/BarChartGlobal";
import D3BarChartGlobal from "./components/global/D3BarChartGlobal";
import HistogramGlobal from "./components/global/HistogramGlobal";
import ScatterPlotGlobal from "./components/global/ScatterPlotGlobal";
import TableGlobal from "./components/global/TableGlobal";
import TablePersonalizado from "./components/individual/TablePersonalizado";
import LineChartGlobal from "./components/global/LineChartGlobal";
import D3LineChartGlobal from "./components/global/D3LineChartGlobal";
import ScatterPlotPersonalizado from "./components/individual/ScatterPlotPersonalizado";
import HistogramPersonalizado from "./components/individual/HistogramPersonalizado";
import LineChartPersonalizado from "./components/individual/LineChartPersonalizado";
import LineChart from "./components/individual/LineChart";
import BarChartRace from "./components/individual/BarChartRace";

const App = () => {
  return (
    <div className="text-center ">
      <div className="container mx-auto my-5">
        <h1 className="text-3xl font-bold mb-3">Top 10 De Los Terremotos</h1>
        <TableGlobal className="w-screen h-screen " />
      </div>
      <div className="container mx-auto my-5">
        <h1 className="text-3xl font-bold mb-3">
          Gráfico de dispersión de Profundidad y Magnitud
        </h1>
        <ScatterPlotGlobal className="w-screen h-screen " />
      </div>
      <div className="container mx-auto my-5">
        <h1 className="text-3xl font-bold mb-3">
          Histograma de Magnitudes de Terremotos
        </h1>
        <HistogramGlobal className="w-screen h-screen " />
      </div>
      <div className="container mx-auto my-5">
        <h1 className="text-3xl font-bold mb-3">
          Gráfico de Barras de Cantidad de Terremotos por Región
        </h1>
        <BarChartGlobal className="w-screen h-screen " />
      </div>
      <div className="container mx-auto my-5">
        <h1 className="text-3xl font-bold mb-3">
          Gráfico de Barras de Cantidad de Terremotos por País (Top 20)
        </h1>
        <D3BarChartGlobal className="w-screen h-screen " />
      </div>
      <div className="container mx-auto my-5">
        <h1 className="text-3xl font-bold mb-3">
          Gráfico de Serie Temporal Por Años
        </h1>
        <LineChartGlobal className="w-screen h-screen " />
      </div>
      <div className="container mx-auto my-5">
        <h1 className="text-3xl font-bold mb-3">
          Serie Temporal de Magnitud de Terremotos (Mag {">="} 8.0)
        </h1>
        <D3LineChartGlobal className="w-screen h-screen " />
      </div>

      <div className="container mx-auto my-5">
        <TablePersonalizado className="w-screen h-screen " />
      </div>
      <div className="container mx-auto my-5">
        <ScatterPlotPersonalizado className="w-screen h-screen " />
      </div>
      <div className="container mx-auto my-5">
        <HistogramPersonalizado className="w-screen h-screen " />
      </div>
      <div className="container mx-auto my-5">
        <LineChart className="w-screen h-screen " />
      </div>
      <div className="container mx-auto my-5">
        <LineChartPersonalizado className="w-screen h-screen " />
      </div>
      <div className="container mx-auto my-5">
        <BarChartRace className="w-screen h-screen " />
      </div>
    </div>
  );
};

export default App;
