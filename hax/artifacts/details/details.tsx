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
  Card,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

interface Stat {
  label: string;
  value: string;
}

interface SubStat {
  label: string;
  value: string;
  sublabel?: string;
  highlight?: boolean;
}

interface DetailsTableColumn {
  label: string;
}

interface DetailsTable {
  columns: DetailsTableColumn[];
  data: string[][];
}

interface HAXDetailsProps {
  title: string;
  description?: string;
  stats?: Stat[];
  subtitle?: string;
  substats?: SubStat[];
  table?: DetailsTable;
}

export const HAXDetails: React.FC<HAXDetailsProps> = ({
  title,
  description,
  stats,
  subtitle,
  substats,
  table,
}) => {
  return (
    <div className="h-full overflow-auto bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="mb-2 text-3xl font-bold text-gray-900">{title}</h2>
        {description && <p className="text-sm text-gray-600">{description}</p>}
      </div>

      {/* Top Stats Grid */}
      {stats && stats.length > 0 && (
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-gray-100 py-4">
              <CardContent className="py-0">
                <CardDescription className="mb-1">{stat.label}</CardDescription>
                <CardTitle className="text-lg font-bold">
                  {stat.value}
                </CardTitle>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Subtitle */}
      {subtitle && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900">{subtitle}</h3>
        </div>
      )}

      {/* Sub Stats */}
      {substats && substats.length > 0 && (
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {substats.map((substat, index) => (
            <Card key={index} className="bg-gray-100">
              <CardContent>
                <CardDescription className="mb-2">
                  {substat.label}
                </CardDescription>
                <CardTitle
                  className={`mb-1 text-2xl ${
                    substat.highlight ? "text-blue-600" : "text-gray-900"
                  }`}
                >
                  {substat.value}
                </CardTitle>
                {substat.sublabel && (
                  <CardDescription>{substat.sublabel}</CardDescription>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Table */}
      {table && (
        <Card className="overflow-hidden py-0">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-gray-100">
                <TableRow>
                  {table.columns.map((column, index) => (
                    <TableHead key={index}>{column.label}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {table.data.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <TableCell key={cellIndex}>{cell}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
