import { pamongEditAction } from "@/actions/pamong-edit-action";
import PamongInputForm from "@/components/pamong-input-form";
import { getPamongById } from "@/lib/pamong";

export default async function EditPamongPage({ params }) {
  const idPamong = params.slugPamongEdit;
  const pamong = (await getPamongById(idPamong)).pamong;

  return (
    <PamongInputForm pamongAction={pamongEditAction} defaultValues={pamong} />
  );
}
