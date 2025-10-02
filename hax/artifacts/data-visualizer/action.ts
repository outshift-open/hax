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

import { useCopilotAction } from "@copilotkit/react-core";
import { ArtifactTab } from "./types";
import { DATA_VISUALIZER_DESCRIPTION } from "./description";

interface UseDataVisualizerActionProps {
  addOrUpdateArtifact: (
    type: "data_visualizer",
    data: Extract<ArtifactTab, { type: "data_visualizer" }>["data"]
  ) => void;
}

export const useDataVisualizerAction = ({
  addOrUpdateArtifact,
}: UseDataVisualizerActionProps) => {
  useCopilotAction({
    name: "create_chart",
    description: DATA_VISUALIZER_DESCRIPTION,
    parameters: [
      {
        name: "type",
        type: "string",
        description:
          "Chart type. See 'ChartType' or 'keyof ChartTypeRegistry' in https://github.com/chartjs/Chart.js/blob/b5ee134/src/types/index.d.ts",
        required: true,
      },
      {
        name: "dataJson",
        type: "string",
        description:
          "JSON string containing a ChartData type object, representing the data for the chart display. Use the chart type to determine the correct data structure. See ChartData in https://github.com/chartjs/Chart.js/blob/b5ee134/src/types/index.d.ts",
        required: true,
      },
      {
        name: "optionsJson",
        type: "string",
        description:
          "JSON string containing a ChartOptions type object, representing the options for the chart display. Use the chart type to determine the correct data structure. See ChartOptions in https://github.com/chartjs/Chart.js/blob/b5ee134/src/types/index.d.ts. Set the proper axis values and labels to optimize the chart display. ",
        required: true,
      },
    ],
    handler: async (args) => {
      const { type, dataJson, optionsJson } = args;
      const parsedData = JSON.parse(dataJson);
      const parsedOptions = JSON.parse(optionsJson);

      addOrUpdateArtifact("data_visualizer", {
        type,
        data: parsedData,
        options: parsedOptions,
      });

      return `Created a "${type}" chart`;
    },
  });
};
