"use client";

import { useState, useEffect } from "react";
import { getKegiatanThisMonth, getKegiatanByDate } from "@/lib/kegiatan";
import TableKegiatan from "./table-kegiatan";

export default function ListKegiatan() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dataKegiatan, setDataKegiatan] = useState([]);

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
            className="px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
        <div className="flex items-end bottom-0">
          <button
            type="submit"
            className="bg-gray-800 text-white px-2 py-2 h-11 w-16 rounded-md hover:bg-gray-700"
          >
            Filter
          </button>
        </div>
      </form>

      <div className="overflow-x-auto">
        {!dataKegiatan ? (
          <div>Data Kosong</div>
        ) : (
          <TableKegiatan dataKegiatan={dataKegiatan} />
        )}
      </div>
    </>
  );
}
