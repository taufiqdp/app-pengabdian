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

export default function TabelPamong({ dataPamong }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPamong = dataPamong.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(dataPamong.length / itemsPerPage);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/12">ID</TableHead>
            <TableHead className="w-2/12">Nama</TableHead>
            <TableHead className="w-2/12">NIK</TableHead>
            <TableHead className="w-2/12">Pekerjaan</TableHead>
            <TableHead className="w-2/12">Jabatan</TableHead>
            <TableHead className="w-2/12">Masa Jabatan</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentPamong.map((pamong) => (
            <TableRow key={pamong.id}>
              <TableCell>{pamong.id}</TableCell>
              <TableCell className="hover:underline">
                <Link href={`/pamong/${pamong.id}`}>{pamong.nama}</Link>
              </TableCell>
              <TableCell>{pamong.nik}</TableCell>
              <TableCell>{pamong.pekerjaan}</TableCell>
              <TableCell>{pamong.jabatan}</TableCell>
              <TableCell>
                {pamong.masa_jabatan_mulai}-{pamong.masa_jabatan_selesai}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-between items-center mt-4">
        <div className="text-gray-700 font-light">
          Menampilkan {indexOfFirstItem + 1} sampai{" "}
          {Math.min(indexOfLastItem, dataPamong.length)} dari{" "}
          {dataPamong.length} pamong
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
