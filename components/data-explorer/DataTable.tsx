import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Info } from "lucide-react";

export default function DataTable({
  filteredData,
  columns,
  handleSort,
  sortColumn,
  sortDirection,
  setSelectedRow,
  searchTerm,
  isLoading,
  data,
}: {
  filteredData: any[];
  columns: string[];
  handleSort: (col: string) => void;
  sortColumn: string;
  sortDirection: "asc" | "desc";
  setSelectedRow: (row: any) => void;
  searchTerm: string;
  isLoading: boolean;
  data: any[];
}) {
  return (
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
                <TableCell key={col} className="text-muted-foreground p-3">
                  <div className="truncate max-w-32" title={String(row[col])}>
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
          <Info className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
          <p className="text-lg font-medium">No results found</p>
          <p className="text-sm">
            No data matches "{searchTerm}". Try a different search term or load
            a new dataset.
          </p>
        </div>
      )}
      {data.length === 0 && !isLoading && (
        <div className="text-center py-12 text-muted-foreground">
          <Info className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
          <p className="text-lg font-medium">No data loaded</p>
          <p className="text-sm">
            Please upload a file or select a sample dataset to get started.
          </p>
        </div>
      )}
    </div>
  );
}
