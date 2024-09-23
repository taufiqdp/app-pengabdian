import { getKegiatanToday } from "@/lib/kegiatan";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Calendar, Users, Briefcase, User } from "lucide-react";
import { getAllPamong } from "@/lib/pamong";
import getAllUser from "@/lib/user";
import Link from "next/link";
import { getUpcomingAgenda } from "@/lib/agenda";

export default async function CountCards() {
  const dataKegiatan = await getKegiatanToday();
  const dataPamong = await getAllPamong();
  const dataUser = await getAllUser();
  const upcomingAgenda = await getUpcomingAgenda();

  return (
    <>
      <Link href="/kegiatan/list-kegiatan" className="z-0">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Kegiatan Hari Ini
            </CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {!dataKegiatan.kegiatan ? 0 : dataKegiatan.kegiatan.length}
            </div>
          </CardContent>
        </Card>
      </Link>
      <Link href="/agenda/kalender">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Agenda Mendatang
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {upcomingAgenda.agenda.length}
            </div>
          </CardContent>
        </Card>
      </Link>
      <Link href="/user/list-user">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total User</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {!dataUser.user ? 0 : dataUser.user.length}
            </div>
          </CardContent>
        </Card>
      </Link>
      <Link href="/pamong/list-pamong">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pamong</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {!dataPamong.pamong ? 0 : dataPamong.pamong.length}
            </div>
          </CardContent>
        </Card>
      </Link>
    </>
  );
}
