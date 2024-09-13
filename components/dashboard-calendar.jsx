"use client";
import { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Setup the localizer for react-big-calendar
const localizer = momentLocalizer(moment);

export function DashboardCalendar() {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectSlot = ({ start, end }) => {
    setNewEvent({ start, end });
    setIsModalOpen(true);
  };

  const handleEventSubmit = (e) => {
    e.preventDefault();
    if (newEvent.title) {
      setEvents([
        ...events,
        {
          ...newEvent,
          id: Date.now(),
        },
      ]);
      setNewEvent({});
      setIsModalOpen(false);
    }
  };

  return (
    <div className="h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard Calendar</h1>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "calc(100% - 80px)" }}
        selectable
        onSelectSlot={handleSelectSlot}
      />
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEventSubmit} className="space-y-4">
            <div>
              <Label htmlFor="eventTitle">Event Title</Label>
              <Input
                id="eventTitle"
                value={newEvent.title || ""}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, title: e.target.value })
                }
                placeholder="Enter event title"
              />
            </div>
            <div>
              <Label>Start Date</Label>
              <Input
                type="text"
                value={
                  newEvent.start
                    ? moment(newEvent.start).format("MMMM D, YYYY h:mm A")
                    : ""
                }
                readOnly
              />
            </div>
            <div>
              <Label>End Date</Label>
              <Input
                type="text"
                value={
                  newEvent.end
                    ? moment(newEvent.end).format("MMMM D, YYYY h:mm A")
                    : ""
                }
                readOnly
              />
            </div>
            <Button type="submit">Add Event</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
