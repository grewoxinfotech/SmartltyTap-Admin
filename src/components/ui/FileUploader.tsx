"use client";

import { useState, useRef } from "react";
import { Upload, X, FileText, Image as ImageIcon, Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploaderProps {
  label: string;
  accept?: string;
  onUpload: (file: File) => Promise<{ url: string; originalName?: string }>;
  maxSize?: number; // in MB
  type?: "image" | "pdf";
}

export const FileUploader = ({ 
  label, 
  accept = "image/*", 
  onUpload, 
  maxSize = 5,
  type = "image"
}: FileUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (maxSize && file.size > maxSize * 1024 * 1024) {
      alert(`File is too large. Maximum size is ${maxSize}MB.`);
      return;
    }

    setIsUploading(true);
    setStatus("idle");
    setFileName(file.name);

    try {
      await onUpload(file);
      setStatus("success");
      setTimeout(() => {
        setStatus("idle");
        setFileName(null);
      }, 3000);
    } catch (error) {
      console.error("Upload failed", error);
      setStatus("error");
    } finally {
      setIsUploading(false);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="w-full">
      <div 
        className={cn(
          "relative group border-2 border-dashed rounded-2xl p-6 transition-all duration-300 flex flex-col items-center justify-center text-center",
          isDragging ? "border-indigo-500 bg-indigo-50/50" : "border-slate-200 hover:border-indigo-300 hover:bg-slate-50/50",
          status === "success" && "border-emerald-400 bg-emerald-50/30",
          status === "error" && "border-rose-400 bg-rose-50/30"
        )}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          className="hidden" 
          accept={accept}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />

        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110",
          status === "success" ? "bg-emerald-100 text-emerald-600" :
          status === "error" ? "bg-rose-100 text-rose-600" :
          "bg-indigo-100 text-indigo-600"
        )}>
          {isUploading ? <Loader2 className="w-6 h-6 animate-spin" /> : 
           status === "success" ? <CheckCircle2 className="w-6 h-6" /> :
           status === "error" ? <X className="w-6 h-6" /> :
           type === "image" ? <ImageIcon className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
        </div>

        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-900">
            {isUploading ? "Uploading..." : 
             status === "success" ? "Upload Successful" :
             status === "error" ? "Upload Failed" : label}
          </p>
          <p className="text-xs text-slate-500">
            {fileName ? fileName : `Drag and drop or click to upload (Max ${maxSize}MB)`}
          </p>
        </div>

        {status === "success" && (
          <div className="absolute top-2 right-2 text-emerald-500">
            <CheckCircle2 className="w-5 h-5 fill-emerald-50" />
          </div>
        )}
      </div>
    </div>
  );
};
