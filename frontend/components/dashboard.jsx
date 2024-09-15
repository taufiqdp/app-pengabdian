import Link from "next/link";
import CountCards from "./count-cards";
import TableKegiatan from "./table-kegiatan";
import { Input } from "./ui/input";
import { DownloadIcon } from "lucide-react";
import { getKegiatanToday } from "@/lib/kegiatan";

export async function Dashboard() {
  const data = await getKegiatanToday();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <CountCards />
      </div>

      <div className="space-y-6 shadow-md bg-white p-4 rounded-lg">
        <div className="flex justify-between">
          <Input placeholder="Cari kegiatan..." className="sm:max-w-sm w-64" />
          <Link
            href="#"
            className="flex gap-2 items-center border px-2 rounded-lg shadow-sm hover:bg-lblue hover:text-white"
          >
            <DownloadIcon size={18} />

            <p>Unduh Laporan</p>
          </Link>
        </div>
        {data.kegiatan ? (
          <TableKegiatan dataKegiatan={data.kegiatan} />
        ) : (
          <div>Data Kosong</div>
        )}
      </div>
    </div>
  );
}
