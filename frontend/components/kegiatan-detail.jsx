import { CalendarIcon, MapPinIcon, UserIcon } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import Image from "next/image";
import { getKegiatanById } from "@/lib/kegiatan";

import Link from "next/link";
import { notFound } from "next/navigation";

export async function KegiatanDetailComponent({ idKegiatan }) {
  const dataKegiatan = (await getKegiatanById(idKegiatan)).kegiatan;

  if (!dataKegiatan) {
    return notFound();
  }

  return (
    <div className="bg-background rounded-md shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {dataKegiatan.gambar ? (
          <div className="relative h-[40vh] md:h-[40vh] w-[40hv]">
            <Image
              src={dataKegiatan.gambar}
              alt={dataKegiatan.nama_kegiatan}
              fill
              priority
              className="h-full w-full object-cover rounded-md"
            />
          </div>
        ) : (
          <div className="relative h-[40vh] md:h-[40vh] w-[40hv] bg-gray-200 rounded-md">
            <p className="text-center text-gray-500 py-10">
              Gambar tidak tersedia.
            </p>
          </div>
        )}

        <div>
          <div className="flex flex-wrap gap-6 mb-8">
            <div className="flex items-center text-muted-foreground">
              <CalendarIcon className="w-5 h-5 mr-2" />
              <span>
                {format(new Date(dataKegiatan.tanggal), "EEEE, d MMMM yyyy", {
                  locale: id,
                })}
              </span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <MapPinIcon className="w-5 h-5 mr-2" />
              <span>{dataKegiatan.tempat}</span>
            </div>
            <Link
              href={`/pamong/${dataKegiatan.pamong_id}`}
              className="flex items-center text-muted-foreground hover:text-black hover:underline"
            >
              <UserIcon className="w-5 h-5 mr-2" />
              <span>{dataKegiatan.nama_pamong}</span>
            </Link>
          </div>

          <h2 className="text-2xl font-semibold mb-4">
            {dataKegiatan.nama_kegiatan}
          </h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-muted-foreground whitespace-pre-wrap">
              {dataKegiatan.deskripsi}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
