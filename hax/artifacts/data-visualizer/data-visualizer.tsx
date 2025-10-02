/*
 * Copyright 2025 Cisco Systems, Inc. and its affiliates
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

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
