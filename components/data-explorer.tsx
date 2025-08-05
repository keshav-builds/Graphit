"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ColourfulText from "@/components/ui/colourful-text";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  AreaChart,
  Area,
} from "recharts";
import {
  Upload,
  Download,
  Search,
  BarChart3,
  LineChartIcon,
  PieChartIcon,
  ScatterChartIcon as ScatterIcon,
  TrendingUp,
  Database,
  Sparkles,
  Eye,
  Settings,
  Zap,
  Target,
  Activity,
  Info,
  FileText,
  BarChart4,
} from "lucide-react";

const CHART_COLORS = [
  "#6366F1", // Indigo
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#8B5CF6", // Violet
  "#06B6D4", // Cyan
  "#84CC16", // Lime
  "#F97316", // Orange
  "#EC4899", // Pink
  "#14B8A6", // Teal
];

// Sample datasets embedded directly
const BOLLYWOOD_MOVIES = [
  {
    title: "Dangal",
    genre: "Drama",
    rating: 8.4,
    year: 2016,
    director: "Nitesh Tiwari",
    budget_cr: 70,
    collection_cr: 2023,
    language: "Hindi",
  },
  {
    title: "3 Idiots",
    genre: "Comedy",
    rating: 8.4,
    year: 2009,
    director: "Rajkumar Hirani",
    budget_cr: 55,
    collection_cr: 402,
    language: "Hindi",
  },
  {
    title: "Baahubali 2",
    genre: "Action",
    rating: 8.2,
    year: 2017,
    director: "S.S. Rajamouli",
    budget_cr: 250,
    collection_cr: 1800,
    language: "Telugu",
  },
  {
    title: "Lagaan",
    genre: "Drama",
    rating: 8.1,
    year: 2001,
    director: "Ashutosh Gowariker",
    budget_cr: 25,
    collection_cr: 65,
    language: "Hindi",
  },
  {
    title: "Zindagi Na Milegi Dobara",
    genre: "Adventure",
    rating: 8.2,
    year: 2011,
    director: "Zoya Akhtar",
    budget_cr: 65,
    collection_cr: 153,
    language: "Hindi",
  },
  {
    title: "Queen",
    genre: "Comedy",
    rating: 8.2,
    year: 2013,
    director: "Vikas Bahl",
    budget_cr: 11,
    collection_cr: 61,
    language: "Hindi",
  },
  {
    title: "Tumhari Sulu",
    genre: "Comedy",
    rating: 7.1,
    year: 2017,
    director: "Suresh Triveni",
    budget_cr: 20,
    collection_cr: 52,
    language: "Hindi",
  },
  {
    title: "Pink",
    genre: "Drama",
    rating: 8.1,
    year: 2016,
    director: "Aniruddha Roy Chowdhury",
    budget_cr: 30,
    collection_cr: 65,
    language: "Hindi",
  },
  {
    title: "Andhadhun",
    genre: "Thriller",
    rating: 8.2,
    year: 2018,
    director: "Sriram Raghavan",
    budget_cr: 32,
    collection_cr: 110,
    language: "Hindi",
  },
  {
    title: "Gully Boy",
    genre: "Drama",
    rating: 7.9,
    year: 2019,
    director: "Zoya Akhtar",
    budget_cr: 65,
    collection_cr: 238,
    language: "Hindi",
  },
];

const INDIAN_CITIES = [
  {
    city: "Mumbai",
    state: "Maharashtra",
    population: 20411000,
    area_km2: 603,
    gdp_billion: 310,
    region: "West",
  },
  {
    city: "Delhi",
    state: "Delhi",
    population: 32900000,
    area_km2: 1484,
    gdp_billion: 294,
    region: "North",
  },
  {
    city: "Bengaluru",
    state: "Karnataka",
    population: 13200000,
    area_km2: 741,
    gdp_billion: 110,
    region: "South",
  },
  {
    city: "Hyderabad",
    state: "Telangana",
    population: 10500000,
    area_km2: 650,
    gdp_billion: 74,
    region: "South",
  },
  {
    city: "Chennai",
    state: "Tamil Nadu",
    population: 11500000,
    area_km2: 1189,
    gdp_billion: 78,
    region: "South",
  },
  {
    city: "Kolkata",
    state: "West Bengal",
    population: 15700000,
    area_km2: 1886,
    gdp_billion: 60,
    region: "East",
  },
  {
    city: "Pune",
    state: "Maharashtra",
    population: 7400000,
    area_km2: 729,
    gdp_billion: 69,
    region: "West",
  },
  {
    city: "Ahmedabad",
    state: "Gujarat",
    population: 8400000,
    area_km2: 505,
    gdp_billion: 68,
    region: "West",
  },
];

const INDIAN_COMPANIES = [
  {
    company: "Reliance Industries",
    sector: "Oil & Gas",
    revenue_cr: 870000,
    employees: 236000,
    founded: 1973,
    headquarters: "Mumbai",
  },
  {
    company: "Tata Consultancy Services",
    sector: "IT Services",
    revenue_cr: 254000,
    employees: 528000,
    founded: 1968,
    headquarters: "Mumbai",
  },
  {
    company: "Infosys",
    sector: "IT Services",
    revenue_cr: 168000,
    employees: 314000,
    founded: 1981,
    headquarters: "Bengaluru",
  },
  {
    company: "HDFC Bank",
    sector: "Banking",
    revenue_cr: 179000,
    employees: 177000,
    founded: 1994,
    headquarters: "Mumbai",
  },
  {
    company: "Wipro",
    sector: "IT Services",
    revenue_cr: 105000,
    employees: 250000,
    founded: 1945,
    headquarters: "Bengaluru",
  },
  {
    company: "HCL Technologies",
    sector: "IT Services",
    revenue_cr: 120000,
    employees: 210000,
    founded: 1976,
    headquarters: "Noida",
  },
];

const SAMPLE_DATASETS = [
  {
    name: "Bollywood Movies",
    data: BOLLYWOOD_MOVIES,
    description: "ratings, box office, and budget data",
    icon: FileText,
  },
  {
    name: "Indian Cities",
    data: INDIAN_CITIES,
    description: "population, GDP, and area statistics",
    icon: BarChart4,
  },
  {
    name: "Indian Companies",
    data: INDIAN_COMPANIES,
    description: "revenue and employee data",
    icon: TrendingUp,
  },
];

export function DataExplorer() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [chartType, setChartType] = useState("area");
  const [xAxis, setXAxis] = useState("");
  const [yAxis, setYAxis] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [currentDataset, setCurrentDataset] = useState("Indian Cities");
  const [isLoading, setIsLoading] = useState(false);

  const loadSampleData = (sampleData, datasetName) => {
    setIsLoading(true);
    try {
      setData(sampleData);
      setFilteredData(sampleData);
      setCurrentDataset(datasetName);

      if (sampleData.length > 0) {
        const cols = Object.keys(sampleData[0]);
        setColumns(cols);

        // Smart axis selection
        const numericCols = cols.filter(
          (col) => typeof sampleData[0][col] === "number"
        );
        const stringCols = cols.filter(
          (col) => typeof sampleData[0][col] === "string"
        );

        setXAxis(stringCols[0] || cols[0]);
        setYAxis(numericCols[0] || cols[1]);
      } else {
        setColumns([]);
        setXAxis("");
        setYAxis("");
      }
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSampleData(INDIAN_CITIES, "Indian Cities");
  }, []);

  useEffect(() => {
    let result = [...data];

    if (searchTerm) {
      result = result.filter((row) =>
        Object.values(row).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    if (sortColumn) {
      result.sort((a, b) => {
        const aVal = a[sortColumn];
        const bVal = b[sortColumn];

        if (typeof aVal === "number" && typeof bVal === "number") {
          return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
        }

        const aStr = String(aVal).toLowerCase();
        const bStr = String(bVal).toLowerCase();
        return sortDirection === "asc"
          ? aStr.localeCompare(bStr)
          : bStr.localeCompare(aStr);
      });
    }

    setFilteredData(result);
  }, [data, searchTerm, sortColumn, sortDirection]);

  const chartData = useMemo(() => {
    if (!xAxis || !yAxis || filteredData.length === 0) return [];

    if (chartType === "pie") {
      const counts = {};
      filteredData.forEach((row) => {
        const key = String(row[xAxis]);
        counts[key] = (counts[key] || 0) + 1;
      });
      return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }

    if (chartType === "scatter") {
      return filteredData.map((row) => ({
        x: Number(row[xAxis]) || 0,
        y: Number(row[yAxis]) || 0,
        name:
          row.title ||
          row.company ||
          row.city ||
          `Item ${filteredData.indexOf(row) + 1}`,
      }));
    }

    // For bar, line, area charts - aggregate data
    const aggregated = {};
    filteredData.forEach((row) => {
      const xVal = String(row[xAxis]);
      const yVal = Number(row[yAxis]) || 0;

      if (!aggregated[xVal]) {
        aggregated[xVal] = { sum: 0, count: 0 };
      }
      aggregated[xVal].sum += yVal;
      aggregated[xVal].count += 1;
    });

    return Object.entries(aggregated).map(([name, { sum, count }]) => ({
      [xAxis]: name,
      [yAxis]: sum / count,
      total: sum,
    }));
  }, [filteredData, xAxis, yAxis, chartType]);

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target.result;
        let parsedData = [];

        if (file.type === "application/json") {
          parsedData = JSON.parse(content);
        } else if (file.type === "text/csv") {
          const lines = content.split("\n").filter((line) => line.trim());
          const headers = lines[0].split(",").map((h) => h.trim());
          parsedData = lines.slice(1).map((line) => {
            const values = line.split(",").map((v) => v.trim());
            const row = {};
            headers.forEach((header, index) => {
              const val = values[index];
              row[header] = isNaN(val) ? val : Number(val);
            });
            return row;
          });
        }

        setData(parsedData);
        setFilteredData(parsedData);
        setColumns(Object.keys(parsedData[0] || {}));
        setCurrentDataset(file.name);

        // Auto-select axes
        if (parsedData.length > 0) {
          const cols = Object.keys(parsedData[0]);
          const numericCols = cols.filter(
            (col) => typeof parsedData[0][col] === "number"
          );
          const stringCols = cols.filter(
            (col) => typeof parsedData[0][col] === "string"
          );

          setXAxis(stringCols[0] || cols[0]);
          setYAxis(numericCols[0] || cols[1]);
        } else {
          setColumns([]);
          setXAxis("");
          setYAxis("");
        }
      } catch (error) {
        alert("Error parsing file. Please check the format.");
      }
    };
    reader.readAsText(file);
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const getColumnType = (column) => {
    if (data.length === 0 || !data[0][column]) return "string";
    return typeof data[0][column];
  };

  const numericColumns = columns.filter(
    (col) => getColumnType(col) === "number"
  );

  const stats = useMemo(() => {
    if (filteredData.length === 0) return {};

    const result = {};
    numericColumns.forEach((col) => {
      const values = filteredData
        .map((row) => Number(row[col]))
        .filter((val) => !isNaN(val));
      if (values.length > 0) {
        result[col] = {
          min: Math.min(...values),
          max: Math.max(...values),
          avg: values.reduce((a, b) => a + b, 0) / values.length,
          count: values.length,
        };
      }
    });
    return result;
  }, [filteredData, columns]);

  // Data insights for the new section
  const dataInsights = useMemo(() => {
    if (filteredData.length === 0) return null;

    const insights = {
      totalRecords: filteredData.length,
      uniqueValues: {},
      topValues: {},
      dataQuality: {
        complete: 0,
        missing: 0,
      },
    };

    // Calculate unique values and top values for categorical columns
    columns.forEach((col) => {
      const values = filteredData
        .map((row) => row[col])
        .filter((val) => val !== null && val !== undefined && val !== "");
      const uniqueVals = [...new Set(values)];
      insights.uniqueValues[col] = uniqueVals.length;

      if (getColumnType(col) === "string" && uniqueVals.length <= 10) {
        const counts = {};
        values.forEach((val) => {
          counts[val] = (counts[val] || 0) + 1;
        });
        insights.topValues[col] = Object.entries(counts)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .map(([value, count]) => ({ value, count }));
      }

      // Data quality
      const completeValues = values.length;
      const totalValues = filteredData.length;
      insights.dataQuality.complete += completeValues;
      insights.dataQuality.missing += totalValues - completeValues;
    });

    return insights;
  }, [filteredData, columns]);

  const renderChart = () => {
    if (chartData.length === 0 || !xAxis || !yAxis) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
          <Database className="h-16 w-16 mb-4 text-muted-foreground/50" />
          <p className="text-lg font-medium">No data or axes selected</p>
          <p className="text-sm text-center max-w-md">
            Please upload data or select X and Y axes in the Control Panel to
            generate visualizations.
          </p>
        </div>
      );
    }

    const commonProps = {
      data: chartData,
      margin: { top: 20, right: 30, left: 20, bottom: 5 },
    };

    const tooltipContentStyle = {
      backgroundColor: "#fff", // White background
      border: "1px solid #eee",
      borderRadius: "8px",
      color: "#333", // Dark, visible text
      padding: "12px",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    };

    switch (chartType) {
      case "bar":
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey={xAxis}
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            />
            <RechartsTooltip contentStyle={tooltipContentStyle} />
            <Legend />
            <Bar dataKey={yAxis} fill={CHART_COLORS[0]} radius={[4, 4, 0, 0]} />
          </BarChart>
        );

      case "line":
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey={xAxis}
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            />
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
        );

      case "area":
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey={xAxis}
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            />
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
        );

      case "pie":
        return (
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
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
        );

      case "scatter":
        return (
          <ScatterChart {...commonProps}>
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
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4 ">
          <div className="flex items-center justify-center gap-3">
            <div className=" rounded-xl shadow-lg">
              <img src="/favicon.png" className="h-10 w-10" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent ">
              <ColourfulText text="Graphit" />
            </h1>
          </div>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Advanced Interactive Data Visualization Platform
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Badge className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
              <Zap className="h-3 w-3 mr-1" />
              Real-time Analytics
            </Badge>
            <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
              <Target className="h-3 w-3 mr-1" />
              Smart Insights
            </Badge>
            <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">
              <Activity className="h-3 w-3 mr-1" />
              Interactive Charts
            </Badge>
          </div>
        </div>

        {/* Controls Panel */}
        <Card className="glass-card">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <CardTitle className="text-2xl  text-foreground flex items-center gap-2 ">
                <Settings className="h-5 w-5 md:h-6 md:w-6 text-indigo-500 " />
                Control Panel
              </CardTitle>
              <Badge className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white ">
                {filteredData.length} records
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Data Loading & Search */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="space-y-4">
                <Label className="text-foreground font-medium flex items-center gap-2 ">
                  <Database className="h-4 w-4 text-muted-foreground  text-orange-600" />
                  Sample Datasets
                </Label>
                <div className="grid grid-cols-1 gap-3">
                  {SAMPLE_DATASETS.map((dataset) => {
                    const IconComponent = dataset.icon;
                    return (
                      <Button
                        key={dataset.name}
                        variant={
                          currentDataset === dataset.name
                            ? "default"
                            : "outline"
                        }
                        className={`justify-start text-left h-auto p-4 transition-all duration-200 ${
                          currentDataset === dataset.name
                            ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 shadow-lg"
                            : "hover:bg-accent/50 hover:shadow-md"
                        }`}
                        onClick={() =>
                          loadSampleData(dataset.data, dataset.name)
                        }
                        disabled={isLoading}
                      >
                        <div className="flex items-start gap-3">
                          <IconComponent className="h-5 w-5 mt-0.5 flex-shrink-0" />
                          <div className="min-w-0">
                            <div className="font-medium truncate">
                              {dataset.name}
                            </div>
                            <div className="text-xs opacity-70 line-clamp-2">
                              {dataset.description}
                            </div>
                          </div>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-3">
                  <Label className="text-foreground text-xl font-medium flex items-center gap-2  ">
                    <Search className="h-5 w-5 text-muted-foreground text-purple-600" />
                    Search & Filter
                  </Label>
                  <Input
                    placeholder="Search across all columns..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="glass-input"
                  />
                  {searchTerm && (
                    <div className="text-sm text-muted-foreground bg-accent/20 p-2 rounded-md">
                      Found{" "}
                      <span className="font-medium text-foreground">
                        {filteredData.length}
                      </span>{" "}
                      results for "
                      <span className="font-medium text-foreground">
                        {searchTerm}
                      </span>
                      "
                    </div>
                  )}
                </div>
                {/* {upload data box} */}
                <div className="space-y-3 ">
                  <Label
                    htmlFor="file-upload"
                    className="text-foreground text-xl font-medium  flex items-center gap-2  mt-10"
                  >
                    <Upload className="h-6 w-6 mr-1 text-3xl font-bold animate-bounce text-purple-600" />
                     Upload Your Data
                  </Label>
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".csv,.json"
                    onChange={handleFileUpload}
                    className="glass-input file:bg-gradient-to-r from-indigo-500 to-purple-600 text-white file:text-white file:border-none file:rounded-md file:hover:bg-indigo-600 file:transition-colors file:px-4 file:py-2"
                  />
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>• Supported formats: CSV, JSON</p>
                    <p>• Max file size: 10MB</p>
                  </div>
                </div>
              </div>

              {/* Quick Stats Panel */}
              <div className="space-y-4">
                <Label className="text-foreground font-medium flex items-center gap-2">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  Quick Stats
                </Label>
                {filteredData.length > 0 && (
                  <div className="space-y-3">
                    <div className="bg-gradient-to-r from-indigo-500/10 to-purple-600/10 p-3 rounded-lg border border-border/50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">
                          Active Dataset
                        </span>
                        <Badge className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 text-xs">
                          {currentDataset}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Records:
                          </span>
                          <span className="font-medium text-foreground">
                            {filteredData.length}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Columns:
                          </span>
                          <span className="font-medium text-foreground">
                            {columns.length}
                          </span>
                        </div>
                        {numericColumns.length > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Numeric:
                            </span>
                            <span className="font-medium text-emerald-600">
                              {numericColumns.length}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {searchTerm && (
                      <div className="bg-gradient-to-r from-amber-500/10 to-orange-600/10 p-3 rounded-lg border border-border/50">
                        <div className="text-sm font-medium text-foreground mb-1">
                          Search Results
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Showing {filteredData.length} of {data.length} records
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <Separator className="bg-border" />

            {/* Chart Controls */}
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

              <div className="space-y-2">
                <Label className="text-foreground font-medium">Export</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full glass-input bg-transparent"
                        onClick={() => {
                          const csvContent = [
                            columns.join(","),
                            ...filteredData.map((row) =>
                              columns.map((col) => row[col]).join(",")
                            ),
                          ].join("\n");
                          const blob = new Blob([csvContent], {
                            type: "text/csv",
                          });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = "filtered-data.csv";
                          a.click();
                        }}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        CSV
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-card text-foreground border-border">
                      <p>Export filtered data as CSV</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        {Object.keys(stats).length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(stats)
              .slice(0, 4)
              .map(([col, stat], index) => (
                <Card
                  key={col}
                  className="glass-card hover:shadow-lg transition-shadow duration-200"
                >
                  <CardContent className="p-4">
                    <div
                      className="text-muted-foreground text-sm font-medium truncate"
                      title={col}
                    >
                      {col}
                    </div>
                    <div className="text-xl md:text-2xl font-bold text-foreground mt-1">
                      {stat.avg.toLocaleString(undefined, {
                        maximumFractionDigits: 1,
                      })}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Range: {stat.min.toLocaleString()} -{" "}
                      {stat.max.toLocaleString()}
                    </div>
                    <div
                      className="w-full h-1 rounded-full mt-2"
                      style={{
                        backgroundColor:
                          CHART_COLORS[index % CHART_COLORS.length] + "20",
                      }}
                    >
                      <div
                        className="h-1 rounded-full transition-all duration-500"
                        style={{
                          backgroundColor:
                            CHART_COLORS[index % CHART_COLORS.length],
                          width: `${Math.min(
                            (stat.avg / stat.max) * 100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Chart */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl text-foreground flex items-center gap-2">
                <Eye className="h-5 w-5 md:h-6 md:w-6 text-indigo-500" />
                Data Visualization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 md:h-96">
                <ResponsiveContainer width="100%" height="100%">
                  {renderChart()}
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Data Table */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg md:text-2xl text-foreground flex items-center gap-2">
                <Database className="h-5 w-5 text-emerald-500" />
                Data Table
                {searchTerm && (
                  <Badge
                    variant="secondary"
                    className="ml-2 bg-accent text-accent-foreground"
                  >
                    {filteredData.length} results
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-80 md:h-96 overflow-auto">
                <Table>
                  <TableHeader className="sticky top-0 bg-card/90 backdrop-blur-md z-10">
                    <TableRow className="border-b border-border">
                      {columns.slice(0, 4).map((col) => (
                        <TableHead
                          key={col}
                          className="text-foreground cursor-pointer hover:text-indigo-500 transition-colors p-3 font-medium"
                          onClick={() => handleSort(col)}
                        >
                          <div className="flex items-center gap-1">
                            <span className="truncate" title={col}>
                              {col}
                            </span>
                            {sortColumn === col && (
                              <span className="text-xs">
                                {sortDirection === "asc" ? "↑" : "↓"}
                              </span>
                            )}
                          </div>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((row, index) => (
                      <TableRow
                        key={index}
                        className="border-b border-border/30 hover:bg-accent/20 transition-colors cursor-pointer"
                        onClick={() => setSelectedRow(row)}
                      >
                        {columns.slice(0, 4).map((col) => (
                          <TableCell
                            key={col}
                            className="text-muted-foreground p-3"
                          >
                            <div
                              className="truncate max-w-32"
                              title={String(row[col])}
                            >
                              {typeof row[col] === "number"
                                ? row[col].toLocaleString()
                                : String(row[col])}
                            </div>
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {filteredData.length === 0 && searchTerm && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                    <p className="text-lg font-medium">No results found</p>
                    <p className="text-sm">
                      No data matches "{searchTerm}". Try a different search
                      term or load a new dataset.
                    </p>
                  </div>
                )}
                {data.length === 0 && !isLoading && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Info className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                    <p className="text-lg font-medium">No data loaded</p>
                    <p className="text-sm">
                      Please upload a file or select a sample dataset to get
                      started.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Row Detail Dialog */}
        {selectedRow && (
          <Dialog
            open={!!selectedRow}
            onOpenChange={() => setSelectedRow(null)}
          >
            <DialogContent className="glass-dialog max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl text-foreground">
                  Record Details
                </DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(selectedRow).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <Label className="text-muted-foreground text-sm font-medium">
                      {key}
                    </Label>
                    <div className="text-foreground bg-accent/20 p-3 rounded-lg border border-border">
                      {typeof value === "number"
                        ? value.toLocaleString()
                        : String(value)}
                    </div>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
