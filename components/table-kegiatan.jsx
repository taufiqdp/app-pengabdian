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

export default function TableKegiatan({ kegiatan }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentActivities = kegiatan.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(kegiatan.length / itemsPerPage);
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
          {currentActivities.map((activity, index) => (
            <TableRow key={index}>
              <TableCell>{activity.tanggal}</TableCell>
              <TableCell>{activity.nama_kegiatan}</TableCell>
              <TableCell>{activity.tempat}</TableCell>
              <TableCell>{activity.nama_pamong}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-between items-center">
        <div className="text-gray-700 font-light">
          Menampilkan {indexOfFirstItem + 1} sampai{" "}
          {Math.min(indexOfLastItem, kegiatan.length)} dari {kegiatan.length}{" "}
          kegiatan hari ini
        </div>
        <div className="flex items-center justify-end space-x-2 min-w-36">
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ArrowLeft />
          </Button>
          <Button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            <ArrowRight />
          </Button>
        </div>
      </div>
    </>
  );
}
