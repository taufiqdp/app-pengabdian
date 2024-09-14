import { PamongDetail } from "@/components/pamong-detail";

export default function PamongDetailPage({ params }) {
  const idPamong = params.slugPamong;
  return (
    <>
      <h1 className="text-2xl font-semibold pb-4">Detail Pamong</h1>
      <PamongDetail idPamong={idPamong} />
    </>
  );
}
