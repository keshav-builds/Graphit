import React from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const CHART_COLORS = [
  "#6366F1",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#06B6D4",
  "#84CC16",
  "#F97316",
  "#EC4899",
  "#14B8A6",
];

export default function ChartRenderer({
  chartType,
  chartData,
  xAxis,
  yAxis,
}: {
  chartType: string;
  chartData: any[];
  xAxis: string;
  yAxis: string;
}) {
  if (!xAxis || !yAxis || chartData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
        <p className="text-lg font-medium">No data or axes selected</p>
        <p className="text-sm text-center max-w-md">
          Please load or filter your data for visualization.
        </p>
      </div>
    );
  }

  const chartProps = {
    data: chartData,
    margin: { top: 20, right: 30, left: 20, bottom: 5 },
  };
  const tooltipContentStyle = {
    backgroundColor: "#fff",
    border: "1px solid #eee",
    borderRadius: "8px",
    color: "#333",
    padding: "12px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  };

  switch (chartType) {
    case "bar":
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey={xAxis} stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <RechartsTooltip contentStyle={tooltipContentStyle} />
            <Legend />
            <Bar dataKey={yAxis} fill={CHART_COLORS[0]} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      );
    case "line":
      return (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey={xAxis} stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <RechartsTooltip contentStyle={tooltipContentStyle} />
            <Legend />
            <Line
              type="monotone"
              dataKey={yAxis}
              stroke={CHART_COLORS[1]}
              strokeWidth={3}
              dot={{ fill: CHART_COLORS[1], strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, stroke: CHART_COLORS[1], strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      );
    case "area":
      return (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey={xAxis} stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <RechartsTooltip contentStyle={tooltipContentStyle} />
            <Legend />
            <Area
              type="monotone"
              dataKey={yAxis}
              stroke={CHART_COLORS[2]}
              fill={`url(#colorArea)`}
              fillOpacity={0.6}
              strokeWidth={2}
            />
            <defs>
              <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={CHART_COLORS[2]}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={CHART_COLORS[2]}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
          </AreaChart>
        </ResponsiveContainer>
      );
    case "pie":
      return (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              dataKey="value"
              nameKey="name"
              label={({ name, percent }: any) =>
                percent > 0.04 ? `${name} ${(percent * 100).toFixed(0)}%` : ""
              }
              labelLine={false}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={CHART_COLORS[index % CHART_COLORS.length]}
                />
              ))}
            </Pie>
            <RechartsTooltip contentStyle={tooltipContentStyle} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      );
    case "scatter":
      return (
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="x"
              type="number"
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            />
            <YAxis
              dataKey="y"
              type="number"
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            />
            <RechartsTooltip
              contentStyle={tooltipContentStyle}
              cursor={{ strokeDasharray: "3 3" }}
            />
            <Scatter name="Data Points" dataKey="y" fill={CHART_COLORS[3]} />
          </ScatterChart>
        </ResponsiveContainer>
      );
    default:
      return null;
  }
}
