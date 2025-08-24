"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { toast } from "sonner";
import Papa from "papaparse";
import html2canvas from "html2canvas";
import ColourfulText from "@/components/ui/colourful-text";

import DatasetSelector from "./DatasetSelector";
import SearchAndUpload from "./SearchAndUpload";
import QuickStats from "./QuickStats";
import ChartControls from "./ChartControls";
import ChartRenderer from "./ChartRenderer";
import DataTable from "./DataTable";
import RecordDetailsDialog from "./RecordDetailsDialog";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Database, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function GlassOverlay({ show, text }: { show: boolean; text?: string }) {
  if (!show) return null;
  return (
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
  );
}

export function DataExplorer() {
  const [data, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [chartType, setChartType] = useState("area");
  const [xAxis, setXAxis] = useState("");
  const [yAxis, setYAxis] = useState("");
  const [selectedRow, setSelectedRow] = useState<any | null>(null);
  const [currentDataset, setCurrentDataset] = useState("Indian Cities");
  const [isLoading, setIsLoading] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [reportUrl, setReportUrl] = useState<string | null>(null);

  const chartContainerRef = useRef<HTMLDivElement>(null);

  // Load dataset from JSON or sample
  const loadSampleData = (sampleData: any[], datasetName: string) => {
    setIsLoading(true);
    setTimeout(() => {
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

  const loadDataset = (filePath: string, datasetName: string) => {
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
  }, []);

  // Filter and sort
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

  // Chart data memoization (omitting pie and scatter processing for brevity)
  const chartData = useMemo(() => {
    if (!xAxis || !yAxis || filteredData.length === 0) return [];

    if (chartType === "pie") {
      const counts: Record<string, number> = {};
      filteredData.forEach((row) => {
        const key = String(row[xAxis]);
        counts[key] = (counts[key] || 0) + 1;
      });
      let entries = Object.entries(counts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);

      if (entries.length > 10) {
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
        name: row.title || row.company || row.city || `Item`,
      }));
    }

    const aggregated: Record<string, { sum: number; count: number }> = {};
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

  // Handlers
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setShowOverlay(true);

    const finishUpload = () => {
      setTimeout(() => {
        setShowOverlay(false);
      }, 800);
    };

    if (file.type === "application/json") {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const parsedData = JSON.parse(e.target?.result as string);
          if (!Array.isArray(parsedData) || parsedData.length > 1000) {
            setShowOverlay(false);
            toast.error(
              "Max 1,000 rows are supported for now. Please upload a smaller file."
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
    } else if (
      file.type === "text/csv" ||
      file.name.toLowerCase().endsWith(".csv")
    ) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const cleaned = results.data.map((row: any) => {
            const cleanedRow: any = {};
            Object.entries(row).forEach(([k, v]) => {
              if (k && k.trim() !== "") {
                cleanedRow[k.trim()] = v === "" ? "" : isNaN(v as any) ? v : Number(v);
              }
            });
            return cleanedRow;
          });

          if (cleaned.length > 1000) {
            setShowOverlay(false);
            toast.error("Max 1000 rows are supported for now.");
            return;
          }
          loadSampleData(cleaned, file.name);
          finishUpload();
        },
        error: () => {
          setShowOverlay(false);
          toast.error("Error parsing CSV file.");
        },
      });
    } else {
      setShowOverlay(false);
      alert("Unsupported file type. Please upload a JSON or CSV file.");
    }
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const getColumnType = (column: string): string => {
    if (data.length === 0 || !data[0][column]) return "string";
    return typeof data[0][column];
  };

  const numericColumns = columns.filter(
    (col) => getColumnType(col) === "number"
  );

  // Report generation
  const handleGenerateReport = async () => {
    if (!chartContainerRef.current) return;
    const canvas = await html2canvas(chartContainerRef.current, {
      backgroundColor: null,
    });
    const dataUrl = canvas.toDataURL("image/png");
    setReportUrl(dataUrl);
  };

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <GlassOverlay show={showOverlay} text="Processing data..." />
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4 ">
          <div className="flex items-center justify-center gap-3">
            <div className="rounded-xl shadow-lg">
              <img src="/favicon.png" className="h-10 w-10" alt="Logo" />
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
              Real-time Analytics
            </Badge>
            <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
              Smart Insights
            </Badge>
            <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">
              Interactive Charts
            </Badge>
          </div>
        </div>

        {/* Controls Panel */}
        <Card className="glass-card">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <CardTitle className="text-2xl text-foreground flex items-center gap-2">
                <Database className="h-5 w-5 md:h-6 md:w-6 text-indigo-500 " />
                Control Panel
              </CardTitle>
              <Badge className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white ">
                {filteredData.length} records
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <DatasetSelector
                currentDataset={currentDataset}
                loadDataset={loadDataset}
                isLoading={isLoading}
              />

              <SearchAndUpload
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                handleFileUpload={handleFileUpload}
              />

              <QuickStats
                filteredDataLength={filteredData.length}
                columnsLength={columns.length}
                numericColumnsLength={numericColumns.length}
                currentDataset={currentDataset}
              />
            </div>

            <Separator className="bg-border" />

            <ChartControls
              chartType={chartType}
              setChartType={setChartType}
              xAxis={xAxis}
              yAxis={yAxis}
              columns={columns}
              getColumnType={getColumnType}
              setXAxis={setXAxis}
              setYAxis={setYAxis}
            />

            <div className="space-y-6 mt-4">
              <div>
                <label className="text-foreground font-medium mb-1 inline-block">
                  Download Report
                </label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        className="glass-input flex items-center gap-2 bg-transparent border border-gray-500/30 dark:border-gray-300/30"
                        onClick={async () => {
                          await handleGenerateReport();
                          if (reportUrl) {
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
                      <p>Download a PNG image of your current chart for sharing or records.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content: Chart + Table */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl text-foreground flex items-center gap-2">
                Data Visualization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 md:h-96" ref={chartContainerRef}>
                <ChartRenderer
                  chartType={chartType}
                  chartData={chartData}
                  xAxis={xAxis}
                  yAxis={yAxis}
                />
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
                
                  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 40 40">
<path fill="#8bb7f0" d="M20,38.5C9.799,38.5,1.5,30.201,1.5,20S9.799,1.5,20,1.5S38.5,9.799,38.5,20S30.201,38.5,20,38.5z"></path><path fill="#4e7ab5" d="M20,2c9.925,0,18,8.075,18,18s-8.075,18-18,18S2,29.925,2,20S10.075,2,20,2 M20,1 C9.507,1,1,9.507,1,20s8.507,19,19,19s19-8.507,19-19S30.493,1,20,1L20,1z"></path><path fill="#fff" d="M20 10A2 2 0 1 0 20 14A2 2 0 1 0 20 10Z"></path><g><path fill="#fff" d="M22 28L22 16 17 16 17 17 18 17 18 28 17 28 17 29 23 29 23 28z"></path></g>
</svg>
                  <span>Click on a row to view more details</span>
                </div>
                {searchTerm && (
                  <Badge className="md:self-start mt-2 md:mt-0">{searchTerm}</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <DataTable
                filteredData={filteredData}
                columns={columns}
                handleSort={handleSort}
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                setSelectedRow={setSelectedRow}
                searchTerm={searchTerm}
                isLoading={isLoading}
                data={data}
              />
            </CardContent>
          </Card>
        </div>

        {/* Record Detail Dialog */}
        {selectedRow && (
          <RecordDetailsDialog
            selectedRow={selectedRow}
            setSelectedRow={setSelectedRow}
          />
        )}
      </div>
    </div>
  );
}
