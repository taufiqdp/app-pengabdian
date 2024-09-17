import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { deleteAgendaById } from "@/lib/agenda";

export function AgendaDetailDialog({
  isAgendaOpen,
  setIsAgendaOpen,
  agendaData,
}) {
  const formatDateRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const formatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    if (start.toDateString() === end.toDateString()) {
      return start.toLocaleDateString("id-ID", formatOptions);
    } else {
      const startFormatted = start.toLocaleDateString("id-ID", formatOptions);
      const endFormatted = end.toLocaleDateString("id-ID", formatOptions);
      return `${startFormatted} - ${endFormatted}`;
    }
  };

  const handleDeleteAgenda = async () => {
    await deleteAgendaById(agendaData.id);
    setIsAgendaOpen(false);
  };

  return (
    <Dialog open={isAgendaOpen} onOpenChange={setIsAgendaOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{agendaData.nama_agenda}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <Calendar className="h-5 w-5 text-gray-500" />
            <p>
              {formatDateRange(
                agendaData.tanggal_mulai,
                agendaData.tanggal_selesai
              )}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <MapPin className="h-5 w-5 text-gray-500" />
            <p>{agendaData.tempat}</p>
          </div>
          <div className="border-t pt-4">
            <h4 className="font-semibold mb-2">Deskripsi</h4>
            <p className="text-sm text-gray-600">{agendaData.deskripsi}</p>
          </div>
        </div>
        <div className="flex justify-end">
          <Button variant="destructive" onClick={handleDeleteAgenda}>
            Hapus Agenda
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
