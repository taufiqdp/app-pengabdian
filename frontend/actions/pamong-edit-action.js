"use server";

import editPamong from "@/lib/pamong";
import { redirect } from "next/navigation";

export async function pamongEditAction(prevState, formData) {
  const idPamong = formData.get("id");

  const pamongData = {
    jenis_kelamin: formData.get("jenis_kelamin"),
    gol_darah: formData.get("gol_darah"),
    tempat_lahir: formData.get("tempat_lahir"),
    pekerjaan: formData.get("pekerjaan"),
    nama: formData.get("nama"),
    tanggal_lahir: formData.get("tanggal_lahir"),
    alamat: formData.get("alamat"),
    jabatan: formData.get("jabatan"),
    agama: formData.get("agama"),
    nik: formData.get("nik"),
    pendidikan_terakhir: formData.get("pendidikan_terakhir"),
    nip: formData.get("nip"),
    status_kawin: formData.get("status_kawin"),
    masa_jabatan_mulai: parseInt(formData.get("masa_jabatan_mulai"), 10),
    masa_jabatan_selesai: parseInt(formData.get("masa_jabatan_selesai"), 10),
  };

  const newFormData = new FormData();
  newFormData.append("pamong", JSON.stringify(pamongData));

  const file = formData.get("file");
  if (file && file.size > 0) {
    newFormData.append("file", file);
  }

  await editPamong(newFormData, idPamong);
  redirect(`/pamong/${idPamong}`);
}
