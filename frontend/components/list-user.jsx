import getAllUser from "@/lib/user";
import TabelUser from "./table-user";

export default async function ListUser() {
  const dataUser = await getAllUser();
  return (
    <>
      {!dataUser.user ? (
        <div>Data Kosong</div>
      ) : (
        <TabelUser dataUser={dataUser.user} />
      )}
    </>
  );
}
