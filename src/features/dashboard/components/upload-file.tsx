"use client";
import { Upload } from "lucide-react";
import { useRef, useState } from "react";
import apiClient from "@/lib/http";

interface UploadFileProps {
  username: string;
}

const UploadFile = ({ username }: UploadFileProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file.name.endsWith(".pdf")) {
      alert("Please upload a PDF file");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("pdf", file);
      formData.append("username", username);

      const res = await apiClient.post("/upload", formData);

      if (res.status === 200) {
        console.log("File uploaded successfully");
        // Trigger a refresh of recent projects if needed
        window.dispatchEvent(new Event("fileUploaded"));
      } else {
        console.error("Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div
      className={`rounded-lg border-2 border-dashed px-6 py-16 transition-all ${
        isDragging
          ? "border-primary bg-primary/5"
          : "border-border/50 hover:border-border"
      } ${isUploading ? "pointer-events-none opacity-50" : "cursor-pointer"}`}
      onClick={handleUploadClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileInputChange}
        className="hidden"
      />

      <div className="flex flex-col items-center gap-4">
        <div className="bg-primary/10 rounded-full p-3">
          <Upload className="text-primary size-6" />
        </div>
        <div className="text-center">
          <p className="text-foreground text-base font-semibold">
            Upload your PDF
          </p>
          <p className="text-muted-foreground mt-1 text-sm">
            Drag and drop your file here, or click to browse
          </p>
        </div>
        <p className="text-muted-foreground text-xs">
          Supports PDF files up to 10MB
        </p>
      </div>
    </div>
  );
};

export default UploadFile;
