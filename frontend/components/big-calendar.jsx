"use client";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const DAYS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

export function BigCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Array(35).fill(null); // Change to 35 days
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < lastDate; i++) {
      days[firstDay + i] = new Date(year, month, i + 1);
    }

    // Fill in days from previous month
    for (let i = 0; i < firstDay; i++) {
      const prevMonthDate = new Date(year, month, 0 - i);
      days[firstDay - i - 1] = prevMonthDate;
    }

    // Fill in days from next month
    for (let i = firstDay + lastDate; i < 35; i++) {
      // Change to 35 days
      const nextMonthDate = new Date(
        year,
        month + 1,
        i - (firstDay + lastDate) + 1
      );
      days[i] = nextMonthDate;
    }

    return days;
  };

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const handleDateClick = (date) => {
    if (date) {
      setSelectedDate(date);
      setNewEvent({ start: date, end: date });
      setIsModalOpen(true);
    }
  };

  const handleEventSubmit = (e) => {
    e.preventDefault();
    if (newEvent.title && newEvent.start && newEvent.end) {
      setEvents([
        ...events,
        {
          ...newEvent,
          id: Date.now(),
        },
      ]);
      setIsModalOpen(false);
      setNewEvent({});
    }
  };

  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  const getEventsForDate = (date) => {
    return events.filter(
      (event) =>
        date >= new Date(event.start.setHours(0, 0, 0, 0)) &&
        date <= new Date(event.end.setHours(0, 0, 0, 0))
    );
  };

  return (
    <div className="h-screen p-4 bg-background text-foreground">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">
          {currentDate.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </h2>
        <div>
          <Button
            onClick={handlePrevMonth}
            variant="outline"
            size="icon"
            className="mr-2"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button onClick={handleNextMonth} variant="outline" size="icon">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-7">
        {DAYS.map((day) => (
          <div key={day} className="text-center font-bold p-2 border-b">
            {day}
          </div>
        ))}
        {getDaysInMonth(currentDate).map((date, index) => (
          <div
            key={index}
            className={`border p-1 h-24 overflow-hidden ${
              date ? "cursor-pointer hover:bg-gray-100" : ""
            } ${
              date && date.getMonth() !== currentDate.getMonth()
                ? "bg-gray-50"
                : ""
            }`}
            onClick={() => handleDateClick(date)}
          >
            {date && (
              <>
                <div
                  className={`text-sm ${
                    date.getMonth() !== currentDate.getMonth()
                      ? "text-gray-400"
                      : ""
                  } ${
                    date.toDateString() === new Date().toDateString()
                      ? "bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      : ""
                  }`}
                >
                  {date.getDate()}
                </div>
                <div className="overflow-y-auto max-h-[calc(100%-1.5rem)]">
                  {getEventsForDate(date).map((event) => (
                    <div
                      key={event.id}
                      className="text-xs bg-blue-200 p-1 mb-1 rounded truncate"
                    >
                      {event.title}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Agenda Baru</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEventSubmit} className="space-y-4">
            <div>
              <Label htmlFor="eventTitle">Nama Agenda</Label>
              <Input
                id="eventTitle"
                value={newEvent.title || ""}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, title: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="eventStart">Mulai</Label>
              <Input
                id="eventStart"
                type="date"
                value={newEvent.start ? formatDate(newEvent.start) : ""}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, start: new Date(e.target.value) })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="eventEnd">Selesai</Label>
              <Input
                id="eventEnd"
                type="date"
                value={newEvent.end ? formatDate(newEvent.end) : ""}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, end: new Date(e.target.value) })
                }
                required
              />
            </div>
            <DialogFooter>
              <Button type="submit">Tambah Agenda</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
