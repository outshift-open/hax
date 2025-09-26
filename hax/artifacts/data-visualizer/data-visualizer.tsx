import React from "react";
import {
  Chart,
  Bar,
  Line,
  Pie,
  Doughnut,
  PolarArea,
  Radar,
  Scatter,
  Bubble,
} from "react-chartjs-2";
import { ChartData, ChartType, ChartOptions } from "chart.js";

// Import Chart.js auto to register all components automatically
// This prevents "Canvas is already in use" errors caused by missing component registrations
import "chart.js/auto";

const ChartTypeComponents = {
  chart: Chart,
  bar: Bar,
  line: Line,
  pie: Pie,
  doughnut: Doughnut,
  polarArea: PolarArea,
  radar: Radar,
  scatter: Scatter,
  bubble: Bubble,
};

interface DataVisualizerProps {
  data: ChartData;
  options: ChartOptions;
  type: ChartType;
}

export const HAXDataVisualizer = ({
  data,
  options,
  type,
  ...props
}: DataVisualizerProps) => {
  const ChartComponent = ChartTypeComponents[type] as React.ComponentType<{
    data: ChartData;
    options: ChartOptions;
  }>;

  return <ChartComponent data={data} options={options} {...props} />;
};
