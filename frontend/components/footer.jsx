export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="flex items-center justify-center bg-gray-100 text-gray-600 md:pl-64 pl-0 pb-4 pt-6">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-center items-center">
          <div className="md:mb-0 flex items-center">
            <p>
              &copy; {currentYear} Tim Pengabdian Informatika F{" "}
              <a href="https://www.uty.ac.id" className="hover:underline">
                UTY
              </a>{" "}
              21
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
