"use client";

import React, { useState, useRef, useCallback } from "react";

import Button from "@/components/ui/Button";
import { Icons } from "@/components/ui";
import type { FileUploadProps } from "@/interfaces/KnowledgeBase.interface";

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const FileUpload: React.FC<FileUploadProps> = ({
  onUpload,
  loading = false,
  className = "",
  accept = ".txt,.pdf,.doc,.docx,.md",
  maxSize = 10 * 1024 * 1024, // 10MB default
  multiple = false,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxSize) {
      return `File "${file.name}" is too large. Maximum size is ${formatFileSize(maxSize)}.`;
    }

    // Check file type if accept is specified
    if (accept) {
      const allowedTypes = accept.split(",").map((type) => type.trim());
      const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
      const isValidType = allowedTypes.some((type) => {
        if (type.startsWith(".")) {
          return type.toLowerCase() === fileExtension;
        }
        return file.type.includes(type);
      });

      if (!isValidType) {
        return `File "${file.name}" has an invalid type. Allowed types: ${accept}`;
      }
    }

    return null;
  };

  const handleFiles = useCallback(
    (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      const newErrors: string[] = [];
      const validFiles: File[] = [];

      fileArray.forEach((file) => {
        const error = validateFile(file);
        if (error) {
          newErrors.push(error);
        } else {
          validFiles.push(file);
        }
      });

      setErrors(newErrors);

      if (validFiles.length > 0) {
        if (multiple) {
          setSelectedFiles((prev) => [...prev, ...validFiles]);
        } else {
          setSelectedFiles(validFiles.slice(0, 1));
        }
      }
    },
    [maxSize, accept, multiple],
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles],
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        handleFiles(e.target.files);
      }
    },
    [handleFiles],
  );

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = () => {
    if (selectedFiles.length > 0) {
      selectedFiles.forEach((file) => {
        onUpload(file);
      });
      setSelectedFiles([]);
      setErrors([]);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div
        className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 group/drop ${
          dragActive
            ? "border-teal-400 dark:border-teal-500/50 bg-teal-50/50 dark:bg-teal-500/[0.06]"
            : "border-slate-300/60 dark:border-white/[0.10] hover:border-slate-400 dark:hover:border-white/[0.15] hover:bg-slate-50/40 dark:hover:bg-white/[0.02]"
        } ${loading ? "opacity-60 pointer-events-none" : "cursor-pointer"}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="relative space-y-4">
          <div className="flex justify-center">
            <div className={`p-4 rounded-xl transition-all duration-300 ${
              dragActive
                ? "bg-teal-100/60 dark:bg-teal-500/15 ring-1 ring-inset ring-teal-200 dark:ring-teal-500/25"
                : "bg-slate-100 dark:bg-white/[0.04] group-hover/drop:bg-slate-200 dark:group-hover/drop:bg-white/[0.06]"
            }`}>
              <Icons.CloudUpload
                className={`h-12 w-12 transition-all duration-300 ${
                  dragActive ? "text-teal-600 dark:text-teal-300 scale-110" : "text-slate-400 dark:text-slate-500 group-hover/drop:text-slate-500 dark:group-hover/drop:text-slate-400"
                }`}
              />
            </div>
          </div>

          <div>
            <p className="text-lg font-bold text-slate-900 dark:text-white">
              Drop files here to upload
            </p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              or{" "}
              <button
                type="button"
                onClick={openFileDialog}
                className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-semibold transition-colors underline underline-offset-2"
                disabled={loading}
              >
                browse your files
              </button>
            </p>
          </div>

          <div className="pt-3 text-xs text-slate-500 dark:text-slate-400 space-y-1">
            <p>
              Formats: <span className="font-semibold text-slate-700 dark:text-slate-300">{accept}</span>
            </p>
            <p>
              Max size: <span className="font-semibold text-slate-700 dark:text-slate-300">{formatFileSize(maxSize)}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileSelect}
        className="hidden"
        disabled={loading}
      />

      {errors.length > 0 && (
        <div className="space-y-3">
          {errors.map((error, index) => (
            <div
              key={index}
              className="p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-200/80 dark:border-rose-500/20 rounded-xl flex items-start space-x-3"
            >
              <Icons.AlertCircle className="h-5 w-5 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-rose-700 dark:text-rose-300 leading-relaxed">{error}</p>
            </div>
          ))}
        </div>
      )}

      {selectedFiles.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-teal-50 dark:bg-teal-500/10 ring-1 ring-inset ring-teal-200 dark:ring-teal-500/20 rounded-lg">
                <Icons.Document className="h-5 w-5 text-teal-600 dark:text-teal-400" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {selectedFiles.length}{" "}
                {selectedFiles.length === 1 ? "file" : "files"} selected
              </h4>
            </div>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-white/[0.04] border border-slate-200/60 dark:border-white/[0.06] px-3 py-1 rounded-full">
              {selectedFiles.reduce((sum, f) => sum + f.size, 0) > 0 &&
                formatFileSize(selectedFiles.reduce((sum, f) => sum + f.size, 0))}
            </span>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-2">
            {selectedFiles.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between p-3.5 bg-slate-50/60 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/[0.06] rounded-xl hover:bg-slate-100/60 dark:hover:bg-white/[0.04] hover:border-slate-300/60 dark:hover:border-white/[0.10] transition-all duration-200 group/file"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="p-2 bg-white dark:bg-white/[0.04] rounded-lg ring-1 ring-inset ring-slate-200/60 dark:ring-white/[0.06]">
                    <Icons.Document className="h-4 w-4 text-slate-500 dark:text-slate-300" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="p-2 text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-all duration-200 flex-shrink-0 ml-2 group-hover/file:opacity-100 opacity-75"
                  disabled={loading}
                  aria-label="Remove file"
                >
                  <Icons.Close className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-200/40 dark:border-white/[0.06]">
            <Button
              onClick={handleUpload}
              loading={loading}
              disabled={selectedFiles.length === 0 || loading}
            >
              Upload {selectedFiles.length}{" "}
              {selectedFiles.length === 1 ? "File" : "Files"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
