"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function TableKegiatan({ dataKegiatan }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentActivities = dataKegiatan.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(dataKegiatan.length / itemsPerPage);
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/6">Tanggal</TableHead>
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
          {Math.min(indexOfLastItem, dataKegiatan.length)} dari{" "}
          {dataKegiatan.length} kegiatan
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
