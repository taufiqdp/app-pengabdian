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
import { ArrowUpDown } from "lucide-react";
import Link from "next/link";

export default function TableKegiatan({ dataKegiatan }) {
  const [sortOrder, setSortOrder] = useState("asc");

  const sortedData = [...dataKegiatan].sort((a, b) => {
    const dateA = new Date(a.tanggal);
    const dateB = new Date(b.tanggal);
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
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
          {sortedData.map((kegiatan, index) => (
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
    </>
  );
}
