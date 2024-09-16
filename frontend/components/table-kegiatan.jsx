"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, ArrowUpDown } from "lucide-react";
import Link from "next/link";

export default function TableKegiatan({ dataKegiatan }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("asc");
  const itemsPerPage = 10;

  const sortedData = [...dataKegiatan].sort((a, b) => {
    const dateA = new Date(a.tanggal);
    const dateB = new Date(b.tanggal);
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentActivities = sortedData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    setCurrentPage(1);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/6">
              <button
                onClick={toggleSortOrder}
                className="h-8 w-full flex flex-row items-center justify-between"
              >
                <p>Tanggal</p>
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </button>
            </TableHead>
            <TableHead className="w-2/6">Nama Kegiatan</TableHead>
            <TableHead className="w-1/4">Tempat</TableHead>
            <TableHead className="w-1/4">Nama Pamong</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentActivities.map((kegiatan, index) => (
            <TableRow key={index}>
              <TableCell>{kegiatan.tanggal}</TableCell>
              <TableCell>
                <Link
                  href={`/kegiatan/${kegiatan.id}`}
                  className="hover:underline"
                >
                  {kegiatan.nama_kegiatan}
                </Link>
              </TableCell>
              <TableCell>{kegiatan.tempat}</TableCell>
              <TableCell>
                <Link
                  href={`/pamong/${kegiatan.pamong_id}`}
                  className="hover:underline"
                >
                  {kegiatan.nama_pamong}
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-between items-center">
        <div className="text-gray-700 font-light">
          Menampilkan {indexOfFirstItem + 1} sampai{" "}
          {Math.min(indexOfLastItem, sortedData.length)} dari{" "}
          {sortedData.length} kegiatan
        </div>
        <div className="flex items-center justify-end space-x-2 min-w-36">
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="bg-lblue text-white hover:bg-blue-500"
          >
            <ArrowLeft />
          </Button>
          <Button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="bg-lblue text-white hover:bg-blue-500"
          >
            <ArrowRight />
          </Button>
        </div>
      </div>
    </>
  );
}
