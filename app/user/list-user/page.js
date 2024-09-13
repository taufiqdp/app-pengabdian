import ListUser from "@/components/list-user";

export default function ListUserPage() {
  return (
    <>
      <h1 className="text-2xl font-semibold pb-4">Data User</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <ListUser />
      </div>
    </>
  );
}
