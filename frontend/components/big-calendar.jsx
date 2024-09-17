"use client";
import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import AgendaInputDialog from "./agenda-input-dialog";
import { useFormState } from "react-dom";
import { redirect } from "next/navigation";
import { AgendaDetailDialog } from "./agenda-detail-dialog";

const DAYS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

export function BigCalendar({ agendaAction, agendaData }) {
  const [state, formAction] = useFormState(agendaAction, {});
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({});
  const [isAgendaOpen, setIsAgendaOpen] = useState(false);
  const [clickedAgendaData, setClickedAgendaData] = useState({});

  // const [selectedDate, setSelectedDate] = useState(null);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Array(35).fill(null);
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < lastDate; i++) {
      days[firstDay + i] = new Date(year, month, i + 1);
    }

    for (let i = 0; i < firstDay; i++) {
      const prevMonthDate = new Date(year, month, 0 - i);
      days[firstDay - i - 1] = prevMonthDate;
    }

    for (let i = firstDay + lastDate; i < 35; i++) {
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
      setNewEvent({ start: date, end: date });
      setIsModalOpen(true);
    }
  };

  const handleEventClick = (event) => {
    setIsAgendaOpen(true);
    setClickedAgendaData(event);
  };

  const getEventsForDate = (date) => {
    return agendaData.agenda.filter((event) => {
      const eventStart = new Date(event.tanggal_mulai);
      const eventEnd = new Date(event.tanggal_selesai);
      return date >= eventStart && date <= eventEnd;
    });
  };

  const getEventStatus = (event, date) => {
    const eventStart = new Date(event.tanggal_mulai);
    const eventEnd = new Date(event.tanggal_selesai);
    const isFirstDay = eventStart.toDateString() === date.toDateString();
    const isLastDay = eventEnd.toDateString() === date.toDateString();

    if (isFirstDay && isLastDay) return "single";
    if (isFirstDay) return "start";
    if (isLastDay) return "end";
    return "middle";
  };

  useEffect(() => {
    if (state?.closeModal) {
      setIsModalOpen(false);
      redirect("/agenda/kalender");
    }
  }, [state]);

  return (
    <div className="h-screen p-4 bg-background text-foreground">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">
          {currentDate.toLocaleString("id-ID", {
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
                      ? "bg-lblue text-white rounded-full w-6 h-6 flex items-center justify-center"
                      : "w-6 h-6"
                  }`}
                >
                  {date.getDate()}
                </div>
                <div className="mt-1">
                  {getEventsForDate(date).map((event, eventIndex) => {
                    const status = getEventStatus(event, date);
                    const isPastEvent =
                      new Date(event.tanggal_selesai) < new Date() &&
                      new Date(event.tanggal_selesai).toDateString() !==
                        new Date().toDateString();
                    return (
                      <div // Add a click handler for event clicks
                        key={eventIndex}
                        className={`text-xs p-1 mb-1 truncate ${
                          status === "middle" || status === "end" ? "pl-4" : ""
                        } ${
                          isPastEvent
                            ? "bg-blue-300 hover:bg-blue-400"
                            : "bg-blue-500 hover:bg-blue-600"
                        } text-white`}
                        title={`${event.nama_agenda}\nFrom: ${new Date(
                          event.tanggal_mulai
                        ).toLocaleString()}\nTo: ${new Date(
                          event.tanggal_selesai
                        ).toLocaleString()}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEventClick(event);
                        }}
                      >
                        {status === "single" || status === "start"
                          ? event.nama_agenda
                          : "\u00A0"}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Dialog Detail */}
      <AgendaDetailDialog
        isAgendaOpen={isAgendaOpen}
        setIsAgendaOpen={setIsAgendaOpen}
        agendaData={clickedAgendaData}
      />

      {/* Dialog Input */}
      <AgendaInputDialog
        newEvent={newEvent}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        formAction={formAction}
      />
    </div>
  );
}
