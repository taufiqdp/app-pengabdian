import { getKegiatanToday } from "@/lib/kegiatan";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Calendar, Users, Briefcase, User } from "lucide-react";
import { getAllPamong } from "@/lib/pamong";
import getAllUser from "@/lib/user";

export default async function CountCards() {
  const dataKegiatan = await getKegiatanToday();
  const dataPamong = await getAllPamong();
  const dataUser = await getAllUser();

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Kegiatan Hari Ini
          </CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {!dataKegiatan.kegiatan ? 0 : dataKegiatan.kegiatan.length}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Agenda Hari Ini</CardTitle>
          <Briefcase className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">5</div>
        </CardContent>
      </Card>
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
    </>
  );
}
