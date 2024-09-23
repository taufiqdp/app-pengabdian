"use client";

import { useState, useEffect } from "react";
import {
  getKegiatanThisMonth,
  getKegiatanByDate,
  exportKegiatanByDate,
} from "@/lib/kegiatan";
import TableKegiatan from "./table-kegiatan";
import { Download, Ellipsis } from "lucide-react";

export default function ListKegiatan() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dataKegiatan, setDataKegiatan] = useState([]);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      const data = await getKegiatanThisMonth();
      setDataKegiatan(data.kegiatan);
      setStartDate(data.startDate);
      setEndDate(data.endDate);
    };
    fetchInitialData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = await getKegiatanByDate(startDate, endDate);
    setDataKegiatan(data.kegiatan);
  };

  const handleDownload = async () => {
    setIsDownloading(true);

    const { file_url } = await exportKegiatanByDate(startDate, endDate);
    const link = document.createElement("a");
    link.href = file_url;
    link.target = "_blank";
    link.download = `kegiatan_${startDate}_to_${endDate}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setIsDownloading(false);
  };

  return (
    <>
      <form
        className="flex flex-col sm:flex-row gap-4 mb-6"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col flex-1">
          <label
            htmlFor="tanggalMulai"
            className="mb-2 text-sm font-medium text-gray-700"
          >
            Tanggal Mulai:
          </label>
          <input
            type="date"
            id="tanggalMulai"
            name="start"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-lblue focus:border-lbring-lblue"
          />
        </div>
        <div className="flex flex-col flex-1">
          <label
            htmlFor="tanggalAkhir"
            className="mb-2 text-sm font-medium text-gray-700"
          >
            Tanggal Akhir:
          </label>
          <input
            type="date"
            id="tanggalAkhir"
            name="end"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex items-end gap-2 bottom-0">
          <button
            type="submit"
            className="bg-lblue text-white px-2 py-2 h-11 w-16 rounded-md hover:bg-blue-500"
          >
            Filter
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className={`
              ${isDownloading ? "opacity-50 cursor-not-allowed" : ""}
              border-2 hover:bg-lblue hover:text-white px-2 py-2 h-11 w-11 rounded-md  flex items-center justify-center`}
            title="Download Excel"
          >
            {isDownloading ? <Ellipsis size={20} /> : <Download size={20} />}
          </button>
        </div>
      </form>

      <div className="overflow-x-auto mt-2">
        {!dataKegiatan ? (
          <div>Data Kosong</div>
        ) : (
          <TableKegiatan dataKegiatan={dataKegiatan} />
        )}
      </div>
    </>
  );
}
