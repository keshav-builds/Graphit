import React from "react";
import { Button } from "@/components/ui/button";
import { FileText, BarChart4, TrendingUp,Database } from "lucide-react";

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

export default function DatasetSelector({
  currentDataset,
  loadDataset,
  isLoading,
}: {
  currentDataset: string;
  loadDataset: (filePath: string, datasetName: string) => void;
  isLoading: boolean;
}) {
  return (
    <div className="space-y-4">
      <label className="text-foreground font-medium flex items-center gap-2">
        <Database className="h-4 w-4 text-muted-foreground text-orange-600" />
        Sample Datasets
      </label>
      <div className="grid grid-cols-1 gap-3">
        {SAMPLE_DATASETS.map((dataset) => {
          const IconComponent = dataset.icon;
          return (
            <Button
              key={dataset.name}
              variant={currentDataset === dataset.name ? "default" : "ghost"}
              className={`justify-start text-left h-auto p-4 ${
                currentDataset === dataset.name
                  ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 shadow-lg"
                  : "hover:bg-accent/50 hover:shadow-md border border-gray-500/20 dark:border-gray-300/20"
              }`}
              onClick={() => loadDataset(dataset.filePath, dataset.name)}
              disabled={isLoading}
            >
              <div className="flex items-start gap-3">
                <IconComponent className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <div className="font-medium truncate">{dataset.name}</div>
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
  );
}
