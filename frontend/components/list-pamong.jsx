import { getAllPamong } from "@/lib/pamong";
import TabelPamong from "./table-pamong";

export default async function ListPamong() {
  const data = await getAllPamong();
  return (
    <>
      {!data.pamong ? (
        <div>Data Kosong</div>
      ) : (
        <TabelPamong dataPamong={data.pamong} />
      )}
    </>
  );
}
