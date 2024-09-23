import CountCards from "./count-cards";
import TableKegiatan from "./table-kegiatan";
import { Input } from "./ui/input";
import { getKegiatanToday } from "@/lib/kegiatan";

export async function Dashboard() {
  const data = await getKegiatanToday();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <CountCards />
      </div>

      <div className="space-y-6 shadow-md bg-white p-4 rounded-lg">
        <div className="font-medium">Kegiatan Hari Ini</div>
        <div className="flex justify-between">
          <Input placeholder="Cari kegiatan..." className="sm:max-w-sm w-64" />
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
