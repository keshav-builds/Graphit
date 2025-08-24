"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Papa from "papaparse";
import { toast } from "sonner";

import html2canvas from "html2canvas";
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
  Eye,
  Settings,
  Zap,
  Target,
  Activity,
  Info,
  FileText,
  BarChart4,
} from "lucide-react";

// ---- Datasets ----

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

const SAMPLE_DATASETS = [
  {
    name: "Bollywood Movies",
    filePath: "/datasets/bollywood_movies.json",
    description: "ratings, box office, and budget data",
    icon: FileText, 
  },
  {
    name: "Indian Cities",
    filePath: "/datasets/indian_cities.json",
    description: "population, GDP, and area statistics",
    icon: BarChart4,
  },
  {
    name: "Indian Companies",
    filePath: "/datasets/indian_companies.json",
    description: "revenue and employee data",
    icon: TrendingUp,
  },
];

// ---- Glass Loader Animation ----

function GlassOverlay({ show, text }) {
  return show ? (
    <div
      style={{
        position: "fixed",
        zIndex: 1000,
        left: 0,
        top: 0,
        width: "100vw",
        height: "100vh",
        backdropFilter: "blur(16px)",
        background: "rgba(41,45,62,0.3)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <div className="rounded-2xl px-8 py-8 bg-white/40 dark:bg-[#232536]/60 glass-card flex flex-col items-center">
        <div className="animate-spin rounded-full border-t-4 border-b-4 border-indigo-500 h-16 w-16 mb-4"></div>
        <span className="font-bold text-2xl text-indigo-900 dark:text-white drop-shadow">
          {text || "Processing data..."}
        </span>
        <div className="text-muted-foreground text-sm mt-2">
          Please wait while your data is being processed.
        </div>
      </div>
    </div>
  ) : null;
}

// ---- DataExplorer (main) ----

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
  const [showOverlay, setShowOverlay] = useState(false);
  const [reportUrl, setReportUrl] = useState(null);

  const chartContainerRef = useRef();

  // --- Load Sample Data ---

  const loadSampleData = (sampleData, datasetName) => {
    setIsLoading(true);
    setTimeout(() => {
      // Simulate small loading time
      setData(sampleData);
      setFilteredData(sampleData);
      setCurrentDataset(datasetName);

      if (sampleData.length > 0) {
        const cols = Object.keys(sampleData[0]);
        setColumns(cols);

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
      setIsLoading(false);
    }, 300);
  };
  //  loadDataset function
  const loadDataset = (filePath, datasetName) => {
    setIsLoading(true);
    fetch(filePath)
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        loadSampleData(data, datasetName);
        setIsLoading(false);
      })
      .catch((error) => {
        toast.error(`Failed to load ${datasetName}`);
        setIsLoading(false);
        console.error("Dataset loading error:", error);
      });
  };

  useEffect(() => {
    loadDataset("/datasets/indian_cities.json", "Indian Cities");
    // eslint-disable-next-line
  }, []);

  // --- Filtering / Sorting ---

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

  // --- Chart Data Memoization (Pie Chart limited) ---

  const chartData = useMemo(() => {
    if (!xAxis || !yAxis || filteredData.length === 0) return [];

    if (chartType === "pie") {
      // Compute frequency
      const counts = {};
      filteredData.forEach((row) => {
        const key = String(row[xAxis]);
        counts[key] = (counts[key] || 0) + 1;
      });
      let entries = Object.entries(counts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);

      if (entries.length > 10) {
        // Top 10 plus "Others"
        const topEntries = entries.slice(0, 10);
        const othersSum = entries.slice(10).reduce((a, b) => a + b.value, 0);
        topEntries.push({ name: "Others", value: othersSum });
        return topEntries;
      }
      return entries;
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

    // For bar, line, area
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

  // --- File Upload ---

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setShowOverlay(true);

    const finishUpload = () => {
      setTimeout(() => {
        setShowOverlay(false);
      }, 800); // Minimum display
    };

    if (file.type === "application/json") {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const parsedData = JSON.parse(e.target?.result);
          if (!Array.isArray(parsedData) || parsedData.length > 1000) {
            setShowOverlay(false);
            toast.error(
              "Max 1,000 rows are supported for now. We are working on supporting more!",
              {
                description:
                  "Your file was not imported. Please upload a smaller CSV/JSON.",
                duration: 6000,
              }
            );
            return;
          }
          loadSampleData(parsedData, file.name);
          finishUpload();
        } catch {
          setShowOverlay(false);
          toast.error("Error reading JSON file.");
        }
      };
      reader.readAsText(file);
    } else if (file.type === "text/csv" || file.name.endsWith(".csv")) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
          const cleaned = results.data.map((row) => {
            const cleanedRow = {};
            Object.entries(row).forEach(([k, v]) => {
              if (k && k.trim() !== "") {
                cleanedRow[k.trim()] = v === "" ? "" : isNaN(v) ? v : Number(v);
              }
            });
            return cleanedRow;
          });

          if (cleaned.length > 1000) {
            setShowOverlay(false);

            toast.error(
              "Max 1000 rows are supported for now. We are working on supporting more!"
            );
            return;
          }
          loadSampleData(cleaned, file.name);
          finishUpload();
        },
        error: function () {
          setShowOverlay(false);
          toast.error("Error parsing CSV file.");
        },
      });
    } else {
      setShowOverlay(false);
      alert("Unsupported file type. Please upload a JSON or CSV file.");
    }
  };

  // --- Analysis, Stats, and Utility helpers ---

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

  // ---- Report Sharing (Generate Screenshot) ----

  const handleGenerateReport = async () => {
    if (!chartContainerRef.current) return;
    const canvas = await html2canvas(chartContainerRef.current, {
      backgroundColor: null,
    });
    const dataUrl = canvas.toDataURL("image/png");
    setReportUrl(dataUrl);
  };

  // ---- Override "No data" states to keep from blank visualization ---

  const hasRealData =
    Array.isArray(filteredData) &&
    filteredData.length > 0 &&
    columns.length > 0;

  // --- Chart Rendering ---

  const renderChart = () => {
    if (!hasRealData || !xAxis || !yAxis) {
      // Safeguard so chart never blank for sample datasets
      return (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
          <Database className="h-16 w-16 mb-4 text-muted-foreground/50" />
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
          <BarChart {...chartProps}>
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
          <LineChart {...chartProps}>
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
          <AreaChart {...chartProps}>
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
        );
      default:
        return null;
    }
  };

  // ---- Main return (UI) ----

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <GlassOverlay show={showOverlay} text="Processing data..." />
      <div className="max-w-7xl mx-auto space-y-6">
        {/* ...HEADER */}
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
              <CardTitle className="text-2xl text-foreground flex items-center gap-2">
                <Settings className="h-5 w-5 md:h-6 md:w-6 text-indigo-500 " />
                Control Panel
              </CardTitle>
              <Badge className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white ">
                {filteredData.length} records
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* {data sample} */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="space-y-4">
                <Label className="text-foreground font-medium flex items-center gap-2 ">
                  <Database className="h-4 w-4 text-muted-foreground text-orange-600" />
                  Sample Datasets
                </Label>
                <div className="grid grid-cols-1 gap-3">
                  {SAMPLE_DATASETS.map((dataset) => {
                    const IconComponent = dataset.icon;
                    return (
                      <Button
                        key={dataset.name}
                        variant={
                          currentDataset === dataset.name ? "default" : "ghost"
                        }
                        className={`justify-start text-left h-auto p-4 ${
                          currentDataset === dataset.name
                            ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 shadow-lg"
                            : "hover:bg-accent/50 hover:shadow-md border border-gray-500/20 dark:border-gray-300/20"
                        }`}
                        onClick={() =>
                          loadDataset(dataset.filePath, dataset.name)
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

              {/* ...Search & Upload... */}
              <div className="space-y-4">
                <div className="space-y-3">
                  <Label className="text-foreground text-xl font-medium flex items-center gap-2  ">
                    <Search className="h-5 w-5 text-purple-600" />
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

                <div className="space-y-3 ">
                  <Label
                    htmlFor="file-upload"
                    className="text-foreground text-xl font-medium  flex items-center gap-2  mt-10"
                  >
                    <Upload className="h-6 w-6 mr-1 text-3xl font-bold animate-bounce text-purple-600 " />
                    Upload Your Data
                  </Label>
                  <style jsx global>{`
                    input[type="file"] {
                      color: black; /* Light mode */
                      cursor: pointer;
                    }
                    .dark input[type="file"] {
                      color: #e0e0e0; /* Dark mode */
                      cursor: pointer;
                    }
                    input[type="file"]::-webkit-file-upload-button {
                      color: white;
                      cursor: pointer;
                    }
                  `}</style>
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".csv,.json"
                    onChange={handleFileUpload}
                    className="glass-input cursor-pointer file:bg-gradient-to-r from-indigo-500 to-purple-600 text-white file:text-white file:border-none file:rounded-md file:hover:bg-indigo-600 file:transition-colors file:px-4 file:py-2"
                  />
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>• Supported formats: CSV, JSON</p>
                    <p>• Max rows: 1,000</p>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
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
                <Label className="text-foreground font-medium">
                  Download Report
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-full glass-input flex items-center gap-2 bg-transparent border border-gray-500/30 dark:border-gray-300/30"
                        onClick={async () => {
                          await handleGenerateReport();
                          if (reportUrl) {
                            // Automatically trigger download when ready
                            const a = document.createElement("a");
                            a.href = reportUrl;
                            a.download = "chart-report.png";
                            a.click();
                          }
                        }}
                      >
                        <Download className="h-4 w-4 mr-1 animate-pulse" />
                        Download Report
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-card text-foreground border-border">
                      <p>
                        Download a PNG image of your current chart for sharing
                        or records.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ...STATS CARDS, MAIN CONTENT  */}

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
              <div className="h-80 md:h-96" ref={chartContainerRef}>
                <ResponsiveContainer width="100%" height="100%">
                  {renderChart()}
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardHeader>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-emerald-500" />
                  <CardTitle className="text-lg md:text-2xl text-foreground">
                    Data Table
                  </CardTitle>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Info className="h-4 w-4" />
                  <span>Click on a row to view more details</span>
                </div>
                {searchTerm && (
                  <Badge className="md:self-start mt-2 md:mt-0">
                    {searchTerm}
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="h-80 md:h-96 overflow-auto">
                <Table>
                  <TableHeader className="sticky top-0 bg-card/90 backdrop-blur-md z-10">
                    <TableRow className="border-b border-border">
                      {columns.slice(0, 4).map((col) => (
                        <TableHead
                          key={col}
                          className="text-foreground cursor-pointer hover:underline transition-colors p-3 font-medium"
                          onClick={() => handleSort(col)}
                          title="Click to sort by this column"
                          aria-sort={
                            sortColumn === col
                              ? sortDirection === "asc"
                                ? "ascending"
                                : "descending"
                              : "none"
                          }
                        >
                          <div className="flex items-center gap-1 select-none">
                            <span className="truncate">
                              {col.charAt(0).toUpperCase() + col.slice(1)}
                            </span>
                            {sortColumn === col ? (
                              <span className="text-xs text-purple-600">
                                {sortDirection === "asc" ? "▲" : "▼"}
                              </span>
                            ) : (
                              <span className="text-sm text-muted-foreground text-purple-600 ">
                                ⇅
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
