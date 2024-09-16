"use client";
import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import AgendaInputDialog from "./agenda-input-dialog";
import { useFormState } from "react-dom";
import { redirect } from "next/navigation";

const DAYS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

export function BigCalendar({ agendaAction, agendaData }) {
  console.log(agendaData);

  const [state, formAction] = useFormState(agendaAction, {});
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({});
  // const [selectedDate, setSelectedDate] = useState(null);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Array(35).fill(null); // Change to 35 days
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

  useEffect(() => {
    if (state?.closeModal) {
      setIsModalOpen(false);
      redirect("/agenda/kalender");
    }
  }, [state]);

  const handleDateClick = (date) => {
    if (date) {
      setNewEvent({ start: date, end: date });
      setIsModalOpen(true);
    }
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
                      ? "bg-lblue text-white rounded-full w-6 h-6 flex items-center justify-center"
                      : ""
                  }`}
                >
                  {date.getDate()}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

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
