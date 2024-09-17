import { Textarea } from "./ui/textarea";
import FormButton from "./form-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

export default function AgendaInputDialog({
  newEvent,
  isModalOpen,
  setIsModalOpen,
  formAction,
}) {
  const formatDate = (date) => {
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .split("T")[0];
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Agenda Baru</DialogTitle>
        </DialogHeader>
        <DialogDescription> </DialogDescription>
        <form action={formAction} className="space-y-4">
          <div>
            <Label htmlFor="eventTitle">Nama Agenda</Label>
            <Input id="eventTitle" required name="eventTitle" />
          </div>
          <div>
            <Label htmlFor="eventStart">Mulai</Label>
            <Input
              id="eventStart"
              type="date"
              name="eventStart"
              defaultValue={newEvent.start ? formatDate(newEvent.start) : ""}
              required
            />
          </div>
          <div>
            <Label htmlFor="eventEnd">Selesai</Label>
            <Input
              id="eventEnd"
              type="date"
              name="eventEnd"
              defaultValue={newEvent.start ? formatDate(newEvent.start) : ""}
              required
            />
          </div>
          <div>
            <Label htmlFor="eventPlace">Tempat</Label>
            <Input id="eventPlace" name="eventPlace" />
          </div>
          <div>
            <Label htmlFor="eventDescription">Deskripsi</Label>
            <Textarea id="eventDescription" name="eventDescription" rows={3} />
          </div>
          <DialogFooter>
            <FormButton title="Simpan" />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
