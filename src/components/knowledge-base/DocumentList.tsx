"use client";

import React, { useState, useEffect } from "react";

import {
  useCompanyAppSelector,
  useCompanyAppDispatch,
} from "@/hooks/company/useCompanyAuth";
import {
  listDocuments,
  deleteDocument,
} from "@/store/company/slices/knowledgeBaseSlice";
import { Icons, IOSContentLoader } from "@/components/ui";
import IOSLoader from "@/components/ui/IOSLoader";
import type { DocumentListProps } from "@/interfaces/KnowledgeBase.interface";
import type { Document } from "@/types/knowledgeBase";

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getStatusColor = (status: Document["embeddings_status"]) => {
  switch (status) {
    case "completed":
      return "bg-green-100 dark:bg-emerald-500/15 text-green-700 dark:text-emerald-300";
    case "pending":
      return "bg-yellow-100 dark:bg-amber-500/15 text-yellow-700 dark:text-amber-300";
    case "failed":
      return "bg-rose-100 dark:bg-rose-500/15 text-rose-700 dark:text-rose-300";
    default:
      return "bg-neutral-100 dark:bg-white/[0.04] text-slate-700 dark:text-slate-300";
  }
};

const getFileTypeIcon = (contentType: string) => {
  if (contentType.includes("pdf"))
    return <Icons.FileText className="h-5 w-5 text-rose-600 dark:text-rose-400" />;
  if (contentType.includes("word") || contentType.includes("document"))
    return <Icons.FileText className="h-5 w-5 text-primary-600 dark:text-primary-400" />;
  if (contentType.includes("text"))
    return <Icons.Document className="h-5 w-5 text-green-600" />;
  return <Icons.Document className="h-5 w-5 text-slate-600 dark:text-slate-400" />;
};

const DocumentList: React.FC<DocumentListProps> = ({ className = "" }) => {
  const dispatch = useCompanyAppDispatch();
  const { documents, loading, error } = useCompanyAppSelector(
    (state) => state.knowledgeBase,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [docsPerPage, setDocsPerPage] = useState(10);
  const [deletingDocId, setDeletingDocId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(listDocuments());
  }, [dispatch]);

  const handleDelete = async (docId: string) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      setDeletingDocId(docId);
      try {
        await dispatch(deleteDocument(docId));
      } finally {
        setDeletingDocId(null);
      }
    }
  };

  const filteredDocuments = documents;

  // Calculate pagination
  const totalPages = Math.ceil(filteredDocuments.length / docsPerPage);
  const indexOfLastDoc = currentPage * docsPerPage;
  const indexOfFirstDoc = indexOfLastDoc - docsPerPage;
  const currentDocuments = filteredDocuments.slice(
    indexOfFirstDoc,
    indexOfLastDoc,
  );

  // Reset to first page when docs per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [docsPerPage]);

  // Generate pagination pages array
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (loading && documents.length === 0) {
    return (
      <div className={className}>
        <IOSContentLoader isLoading={true} message="Loading documents..." />
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      {error && (
        <div className="mb-6 p-4 bg-gradient-to-r from-rose-50 to-rose-100/50 dark:from-rose-500/10 dark:to-rose-500/5 border border-rose-200/80 dark:border-rose-500/20 rounded-xl shadow-md dark:shadow-none backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 p-1">
                <Icons.AlertCircle className="h-5 w-5 text-rose-600 dark:text-rose-400" />
              </div>
              <p className="text-sm font-medium text-rose-800 dark:text-rose-300">
                {typeof error === "string"
                  ? error
                  : "An error occurred while loading documents."}
              </p>
            </div>
            <button
              onClick={() => {}}
              className="text-rose-400 hover:text-rose-600 dark:text-rose-400/70 dark:hover:text-rose-300 transition-colors p-1"
              aria-label="Dismiss"
            >
              <Icons.Close className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Pagination Size Selector */}
      {filteredDocuments.length > 0 && (
        <div className="flex justify-end mb-4">
          <div className="flex items-center gap-2 px-3 py-2.5 border border-slate-200/80 dark:border-white/[0.06] bg-white/50 dark:bg-white/[0.02] backdrop-blur-sm rounded-lg">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 whitespace-nowrap">
              Show:
            </span>
            <select
              value={docsPerPage}
              onChange={(e) => setDocsPerPage(Number(e.target.value))}
              className="border-0 bg-transparent text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-0 cursor-pointer"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
            </select>
          </div>
        </div>
      )}

      {filteredDocuments.length === 0 ? (
        <div className="py-24">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-teal-500/10 rounded-full blur-xl" />
                <div className="relative inline-flex items-center justify-center h-24 w-24 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 dark:from-white/[0.06] dark:to-white/[0.02] ring-1 ring-inset ring-slate-200/60 dark:ring-white/[0.06] shadow-md dark:shadow-none">
                  <Icons.Document className="h-12 w-12 text-slate-300 dark:text-white/30" />
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Your knowledge base is empty
              </h3>
              <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                Upload documents or add text content to get started
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] shadow-lg dark:shadow-none">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200/60 dark:divide-white/[0.06]">
              <thead className="bg-slate-50/60 dark:bg-white/[0.02] border-b border-slate-200/60 dark:border-white/[0.06]">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider"
                  >
                    Document
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider"
                  >
                    Type
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider"
                  >
                    Size
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider"
                  >
                    Created
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-right text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-white/[0.02] divide-y divide-slate-200/60 dark:divide-white/[0.06]">
                {currentDocuments.map((document, index) => (
                  <tr
                    key={document.doc_id}
                    className="hover:bg-slate-50/80 dark:hover:bg-white/[0.04] transition-colors duration-150 group"
                    style={{
                      animation: `fadeIn 0.3s ease-out ${index * 0.05}s both`
                    }}
                  >
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 p-2.5 bg-slate-100/60 dark:bg-white/[0.04] rounded-lg group-hover:bg-teal-50 dark:group-hover:bg-teal-500/10 transition-colors">
                          {getFileTypeIcon(document.content_type)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white truncate max-w-xs group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors">
                            {document.filename}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-slate-600 dark:text-slate-400">
                      {document.content_type.split("/")[1]?.toUpperCase() ||
                        "FILE"}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-slate-600 dark:text-slate-400">
                      {formatFileSize(document.file_size)}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold gap-2 ${getStatusColor(document.embeddings_status)}`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            document.embeddings_status === "completed"
                              ? "bg-teal-600 animate-pulse"
                              : document.embeddings_status === "pending"
                                ? "bg-amber-600 animate-pulse"
                                : "bg-rose-600"
                          }`}
                        />
                        {document.embeddings_status.charAt(0).toUpperCase() +
                          document.embeddings_status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-slate-600 dark:text-slate-400">
                      {formatDate(document.created_at)}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-right text-sm">
                      <button
                        onClick={() => handleDelete(document.doc_id)}
                        disabled={deletingDocId === document.doc_id}
                        className="inline-flex items-center justify-center p-2 text-slate-400 hover:text-rose-600 dark:text-rose-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-full transition-all duration-200 group/btn"
                        aria-label="Delete document"
                      >
                        {deletingDocId === document.doc_id ? (
                          <IOSLoader size="sm" color="dark" />
                        ) : (
                          <Icons.Trash className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Animation keyframes */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      {/* Pagination */}
      {filteredDocuments.length > 0 && totalPages > 1 && (
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-6 px-6 py-6 bg-slate-50/50 dark:bg-white/[0.02] rounded-xl border border-slate-200/40 dark:border-white/[0.06]">
          <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Showing <span className="font-bold text-slate-900 dark:text-white">{indexOfFirstDoc + 1}</span> to{" "}
            <span className="font-bold text-slate-900 dark:text-white">
              {Math.min(indexOfLastDoc, filteredDocuments.length)}
            </span>{" "}
            of <span className="font-bold text-slate-900 dark:text-white">{filteredDocuments.length}</span> documents
          </div>

          <nav className="flex items-center space-x-1 bg-white/60 dark:bg-white/[0.02] rounded-lg p-1 border border-slate-200/50 dark:border-white/[0.06]">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-full transition-all duration-200 ${
                currentPage === 1
                  ? "text-slate-300 dark:text-slate-600 cursor-not-allowed"
                  : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.04]"
              }`}
            >
              <Icons.ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            <div className="flex items-center space-x-0.5">
              {getPageNumbers().map((page, index) =>
                page === "..." ? (
                  <span
                    key={`ellipsis-${index}`}
                    className="px-2.5 py-2 text-xs text-slate-400 dark:text-slate-500 font-bold"
                  >
                    ⋯
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page as number)}
                    className={`inline-flex items-center px-3 py-2 text-xs font-bold rounded-full transition-all duration-200 ${
                      currentPage === page
                        ? "bg-slate-900 dark:bg-teal-500/20 dark:border dark:border-teal-500/30 text-white dark:text-teal-100 shadow-sm dark:shadow-none"
                        : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.04]"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}
            </div>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-full transition-all duration-200 ${
                currentPage === totalPages
                  ? "text-slate-300 dark:text-slate-600 cursor-not-allowed"
                  : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.04]"
              }`}
            >
              <span className="hidden sm:inline">Next</span>
              <Icons.ArrowLeft className="h-4 w-4 rotate-180" />
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default DocumentList;
