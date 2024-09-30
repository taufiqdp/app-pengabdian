"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUpDown } from "lucide-react";
import Link from "next/link";

export default function TableKegiatan({ dataKegiatan }) {
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedValue, setSelectedValue] = useState("Semua");

  const listNamaKegiatan = useMemo(() => {
    const uniqueKegiatan = new Set(
      dataKegiatan.map((kegiatan) => kegiatan.nama_kegiatan)
    );
    return ["Semua", ...Array.from(uniqueKegiatan)];
  }, [dataKegiatan]);

  const sortedData = useMemo(() => {
    const filteredData =
      selectedValue === "Semua"
        ? dataKegiatan
        : dataKegiatan.filter(
            (kegiatan) => kegiatan.nama_kegiatan === selectedValue
          );

    return filteredData.sort((a, b) => {
      const dateA = new Date(a.tanggal);
      const dateB = new Date(b.tanggal);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
  }, [dataKegiatan, selectedValue, sortOrder]);

  const toggleSortOrder = useCallback(() => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  }, []);

  const handleSelectChange = useCallback((value) => {
    setSelectedValue(value);
  }, []);

  return (
    <>
      <Select onValueChange={handleSelectChange} defaultValue="Semua">
        <SelectTrigger className="lg:w-[400px] sm:w-[300px] w-[200px]">
          <SelectValue placeholder="Pilih kegiatan" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Nama Kegiatan</SelectLabel>
            {listNamaKegiatan.map((kegiatan) => (
              <SelectItem key={kegiatan} value={kegiatan}>
                {kegiatan}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
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
          {sortedData.map((kegiatan) => (
            <TableRow key={kegiatan.id}>
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
