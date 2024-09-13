import { CalendarIcon, MapPinIcon, UserIcon } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import Image from "next/image";
import { getKegiatanById } from "@/lib/kegiatan";

import imageKegiatan from "@/assets/dummy-kegiatan.png";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function KegiatanDetailComponent({ idKegiatan }) {
  const dataKegiatan = (await getKegiatanById(idKegiatan)).kegiatan;

  if (!dataKegiatan) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-background rounded-md shadow-md">
      <div className="relative h-[40vh] md:h-[40vh] lg:h-[50vh]">
        <Image
          src={imageKegiatan}
          alt={dataKegiatan.nama_kegiatan}
          layout="fill"
          objectFit="cover"
          priority
          className="rounded-t-md"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
  );
}
