import ListPamong from "@/components/list-pamong";

export default function ListPamongPage() {
  return (
    <>
      <h1 className="text-2xl font-semibold pb-4">Data Pamong</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <ListPamong />
      </div>
    </>
  );
}
