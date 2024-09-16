"use server";

import { inputAgenda } from "@/lib/agenda";

export async function agedaInputAction(prevState, formData) {
  const agendaData = {
    nama_agenda: formData.get("eventTitle"),
    tanggal_mulai: formData.get("eventStart"),
    tanggal_selesai: formData.get("eventEnd"),
    tempat: formData.get("eventPlace"),
    deskripsi: formData.get("eventDescription"),
  };

  await inputAgenda(agendaData);
  return { ...prevState, closeModal: true };
}
