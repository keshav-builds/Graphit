import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function RecordDetailsDialog({
  selectedRow,
  setSelectedRow,
}: {
  selectedRow: any;
  setSelectedRow: (row: any) => void;
}) {
  return (
    <Dialog open={!!selectedRow} onOpenChange={() => setSelectedRow(null)}>
      <DialogContent className="glass-dialog max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl text-foreground">Record Details</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(selectedRow).map(([key, value]) => (
            <div key={key} className="space-y-2">
              <Label className="text-muted-foreground text-sm font-medium">{key}</Label>
              <div className="text-foreground bg-accent/20 p-3 rounded-lg border border-border">
                {typeof value === "number" ? value.toLocaleString() : String(value)}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
