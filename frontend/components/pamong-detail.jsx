import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getKegiatanByPamongId } from "@/lib/kegiatan";
import { getPamongById } from "@/lib/pamong";
import {
  CalendarIcon,
  MapPinIcon,
  BookOpenIcon,
  BriefcaseIcon,
  DropletIcon,
  UserIcon,
  PencilIcon,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import TableKegiatan from "./table-kegiatan";
import DeleteDialog from "./delete-dialog";

export async function PamongDetail({ idPamong }) {
  const dataPamong = (await getPamongById(idPamong)).pamong;
  const dataKegiatanPamong = (await getKegiatanByPamongId(idPamong)).kegiatan;

  if (!dataPamong) {
    return notFound();
  }

  return (
    <div className="container mx-auto">
      <div className="flex justify-end items-center mb-8">
        <div className="space-x-2">
          <Link href={`/pamong/edit/${idPamong}`}>
            <Button variant="outline">
              <PencilIcon className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </Link>

          <DeleteDialog idPamong={idPamong} />
        </div>
      </div>
      <div className="bg-card rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
          <Avatar className="w-32 h-32">
            <AvatarImage src={dataPamong.gambar} alt={dataPamong.nama} />
            <AvatarFallback>{dataPamong.nama}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold">{dataPamong.nama}</h2>
            <p className="text-muted-foreground text-lg">
              {dataPamong.jabatan}
            </p>
            <Badge variant="outline" className="mt-2">
              Masa Jabatan: {dataPamong.masa_jabatan_mulai} -{" "}
              {dataPamong.masa_jabatan_selesai}
            </Badge>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <InfoItem
            icon={<UserIcon className="w-5 h-5" />}
            label="NIK"
            value={dataPamong.nik}
          />
          <InfoItem
            icon={<UserIcon className="w-5 h-5" />}
            label="NIP"
            value={dataPamong.nip}
          />
          <InfoItem
            icon={<MapPinIcon className="w-5 h-5" />}
            label="Tempat Lahir"
            value={dataPamong.tempat_lahir}
          />
          <InfoItem
            icon={<CalendarIcon className="w-5 h-5" />}
            label="Tanggal Lahir"
            value={dataPamong.tanggal_lahir}
          />
          <InfoItem
            icon={<MapPinIcon className="w-5 h-5" />}
            label="Alamat"
            value={dataPamong.alamat}
          />
          <InfoItem
            icon={<BriefcaseIcon className="w-5 h-5" />}
            label="Pekerjaan"
            value={dataPamong.pekerjaan}
          />
          <InfoItem
            icon={<DropletIcon className="w-5 h-5" />}
            label="Golongan Darah"
            value={dataPamong.gol_darah}
          />
          <InfoItem
            icon={<UserIcon className="w-5 h-5" />}
            label="Jenis Kelamin"
            value={dataPamong.jenis_kelamin === "L" ? "Laki-laki" : "Perempuan"}
          />
          <InfoItem
            icon={<UserIcon className="w-5 h-5" />}
            label="Status Kawin"
            value={dataPamong.status_kawin}
          />
          <InfoItem
            icon={<UserIcon className="w-5 h-5" />}
            label="Agama"
            value={dataPamong.agama}
          />
          <InfoItem
            icon={<BookOpenIcon className="w-5 h-5" />}
            label="Pendidikan Terakhir"
            value={dataPamong.pendidikan_terakhir}
          />
        </div>
        <div className="pt-20 flex flex-col gap-4">
          <h1 className="text-2xl font-bold">
            Data Kegiatan {dataPamong.nama}
          </h1>
          {!dataKegiatanPamong ? (
            <div>Kegiatan Kosong</div>
          ) : (
            <TableKegiatan dataKegiatan={dataKegiatanPamong} />
          )}
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <div className="bg-muted rounded-full p-2">{icon}</div>
      <div>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}
