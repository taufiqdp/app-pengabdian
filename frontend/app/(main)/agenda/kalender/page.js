import { agedaInputAction } from "@/actions/agenda-input-action";
import { BigCalendar } from "@/components/big-calendar";
import { getAgendaThisMonth } from "@/lib/agenda";

export default async function KalenderPage() {
  const agendaData = await getAgendaThisMonth();

  return (
    <>
      <h1 className="text-2xl font-bold pb-4">Kalender</h1>
      <div className="bg-white p-6 rounded-md shadow-md">
        <BigCalendar agendaAction={agedaInputAction} agendaData={agendaData} />
      </div>
    </>
  );
}
