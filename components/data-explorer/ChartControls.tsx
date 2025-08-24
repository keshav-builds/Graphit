import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart3,
  LineChartIcon,
  PieChartIcon,
  ScatterChartIcon as ScatterIcon,
  TrendingUp,
} from "lucide-react";
import { Label } from "@/components/ui/label";

export default function ChartControls({
  chartType,
  setChartType,
  xAxis,
  yAxis,
  columns,
  getColumnType,
  setXAxis,
  setYAxis,
}: {
  chartType: string;
  setChartType: (val: string) => void;
  xAxis: string;
  yAxis: string;
  columns: string[];
  getColumnType: (col: string) => string;
  setXAxis: (val: string) => void;
  setYAxis: (val: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="space-y-2">
        <Label className="text-orange-500 text-lg font-bold animate-pulse drop-shadow-lg tracking-wide rounded px-2 py-1">
          Chart Type
        </Label>
        <Select value={chartType} onValueChange={setChartType}>
          <SelectTrigger className="glass-input">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-card border-border text-foreground">
            <SelectItem value="bar">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-indigo-500" />
                Bar Chart
              </div>
            </SelectItem>
            <SelectItem value="line">
              <div className="flex items-center gap-2">
                <LineChartIcon className="h-4 w-4 text-emerald-500" />
                Line Chart
              </div>
            </SelectItem>
            <SelectItem value="area">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-amber-500" />
                Area Chart
              </div>
            </SelectItem>
            <SelectItem value="pie">
              <div className="flex items-center gap-2">
                <PieChartIcon className="h-4 w-4 text-pink-500" />
                Pie Chart
              </div>
            </SelectItem>
            <SelectItem value="scatter">
              <div className="flex items-center gap-2">
                <ScatterIcon className="h-4 w-4 text-purple-500" />
                Scatter Plot
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-foreground font-medium">X-Axis</Label>
        <Select value={xAxis} onValueChange={setXAxis}>
          <SelectTrigger className="glass-input">
            <SelectValue placeholder="Select X-axis" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border text-foreground max-h-60 overflow-y-auto">
            {columns.map((col) => (
              <SelectItem key={col} value={col}>
                <div className="flex items-center justify-between w-full">
                  <span className="truncate">{col}</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    ({getColumnType(col)})
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-foreground font-medium">Y-Axis</Label>
        <Select value={yAxis} onValueChange={setYAxis}>
          <SelectTrigger className="glass-input">
            <SelectValue placeholder="Select Y-axis" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border text-foreground max-h-60 overflow-y-auto">
            {columns.map((col) => (
              <SelectItem key={col} value={col}>
                <div className="flex items-center justify-between w-full">
                  <span className="truncate">{col}</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    ({getColumnType(col)})
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
