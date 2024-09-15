import { KegiatanDetailComponent } from "@/components/kegiatan-detail";

export default function KegiatanDetailPage({ params }) {
  const idKegiatan = params.slugKegiatan;

  return (
    <div>
      <h1 className="text-2xl font-semibold pb-4">Detail Kegiatan</h1>
      <KegiatanDetailComponent idKegiatan={idKegiatan} />
    </div>
  );
}
