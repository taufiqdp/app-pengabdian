import { BigCalendar } from "@/components/big-calendar";

export default function KalenderPage() {
  return (
    <>
      <h1 className="text-2xl font-bold pb-4">Kalender</h1>
      <div className="bg-white p-6 rounded-md shadow-md">
        <BigCalendar />
      </div>
    </>
  );
}
