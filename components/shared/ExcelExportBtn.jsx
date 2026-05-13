"use client";

import * as XLSX from "xlsx";

export default function ExcelExportBtn({ data, fileName, className = "" }) {
  const exportToExcel = () => {
    // 1. Convert the JSON array to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);

    // 2. Create a new workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Candidates");

    // 3. Trigger the download
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  return (
    <button
      onClick={exportToExcel}
      className={`flex items-center justify-center space-x-2 bg-white text-zinc-950 font-bold text-sm px-6 py-3.5 rounded-xl hover:bg-zinc-200 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.1)] whitespace-nowrap ${className}`}
    >
      <svg
        className="w-5 h-5 text-zinc-900"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.5"
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
        ></path>
      </svg>
      <span>Download as Excel</span>
    </button>
  );
}
