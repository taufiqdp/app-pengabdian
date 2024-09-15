import ListKegiatan from "@/components/list-kegiatan";

export default async function KegiatanPage() {
  return (
    <>
      <h1 className="text-2xl font-bold pb-4">Data Kegiatan</h1>
      <div className="flex flex-col bg-white rounded-lg shadow-md p-6 ">
        <ListKegiatan />
      </div>
    </>
  );
}
