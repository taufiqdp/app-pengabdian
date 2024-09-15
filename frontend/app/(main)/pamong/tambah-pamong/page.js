import { pamongInputAction } from "@/actions/pamong-input-action";
import PamongInputForm from "@/components/pamong-input-form";

export default function TambahPamongPage() {
  return <PamongInputForm pamongAction={pamongInputAction} />;
}
