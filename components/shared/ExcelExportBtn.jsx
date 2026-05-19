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
      className={`group inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold text-sm px-5 py-3 rounded-lg hover:from-blue-400 hover:to-indigo-500 active:scale-[0.97] transition-all duration-300 shadow-lg shadow-blue-500/20 whitespace-nowrap ${className}`}
    >
      <svg
        className="w-4 h-4 text-white group-hover:-translate-y-0.5 transition-transform"
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
      <span>Export to Excel</span>
    </button>
  );
}
