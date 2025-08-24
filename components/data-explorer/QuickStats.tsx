import React from "react";
import { Badge } from "@/components/ui/badge";
import { Activity } from "lucide-react";

export default function QuickStats({
  filteredDataLength,
  columnsLength,
  numericColumnsLength,
  currentDataset,
}: {
  filteredDataLength: number;
  columnsLength: number;
  numericColumnsLength: number;
  currentDataset: string;
}) {
  return (
    <div className="space-y-4">
      <label className="text-foreground font-medium flex items-center gap-2">
        <Activity className="h-4 w-4 text-muted-foreground" />
        Quick Stats
      </label>
      {filteredDataLength > 0 && (
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
                <span className="text-muted-foreground">Records:</span>
                <span className="font-medium text-foreground">
                  {filteredDataLength}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Columns:</span>
                <span className="font-medium text-foreground">{columnsLength}</span>
              </div>
              {numericColumnsLength > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Numeric:</span>
                  <span className="font-medium text-emerald-600">
                    {numericColumnsLength}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
