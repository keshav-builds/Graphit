import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Search } from "lucide-react";

export default function SearchAndUpload({
  searchTerm,
  setSearchTerm,
  handleFileUpload,
}: {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <Label className="text-foreground text-xl font-medium flex items-center gap-2">
          <Search className="h-5 w-5 text-purple-600" />
          Search & Filter
        </Label>
        <Input
          placeholder="Search across all columns..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="glass-input"
        />
      </div>
      <div className="space-y-3">
        <Label
          htmlFor="file-upload"
          className="text-foreground text-xl font-medium flex items-center gap-2 mt-10"
        >
          <Upload className="h-6 w-6 mr-1 text-3xl font-bold animate-bounce text-purple-600" />
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
  );
}
