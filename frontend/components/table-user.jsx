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
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function TabelUser({ dataUser }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = dataUser.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(dataUser.length / itemsPerPage);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/12">ID</TableHead>
            <TableHead className="w-3/12">Nama</TableHead>
            <TableHead className="w-3/12">Username</TableHead>
            <TableHead className="w-5/12">Email</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>
                <Link
                  href={`/pamong/${user.id_pamong}`}
                  className="hover:underline"
                >
                  {user.nama_pamong}
                </Link>
              </TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.email}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-between items-center mt-4">
        <div className="text-gray-700 font-light">
          Menampilkan {indexOfFirstItem + 1} sampai{" "}
          {Math.min(indexOfLastItem, dataUser.length)} dari {dataUser.length}{" "}
          pengguna
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
