import { Menu } from "lucide-react";
import dummyProfile from "@/assets/dummy-profile.png";
import Image from "next/image";

export default function TopNavbar({ toggleSidebar }) {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <button
              onClick={toggleSidebar}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
            >
              <Menu size={24} />
            </button>
          </div>
          <div className="flex items-center">
            <Image
              className="h-8 w-8 rounded-full"
              src={dummyProfile}
              alt="Profile"
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
