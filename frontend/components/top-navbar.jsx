"use client";

import { Menu } from "lucide-react";
import dummyProfile from "@/assets/dummy-profile.png";
import Image from "next/image";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LogoutDropDown from "./logout-dropdown";

export default function TopNavbar({ toggleSidebar }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14">
          <div className="flex">
            <button
              onClick={toggleSidebar}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
            >
              <Menu size={24} />
            </button>
          </div>
          <div className="flex items-center">
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
              <DropdownMenuTrigger asChild>
                <button className="focus:outline-none">
                  <Image
                    className="h-8 w-8 rounded-full"
                    src={dummyProfile}
                    alt="Profile"
                  />
                </button>
              </DropdownMenuTrigger>
              <LogoutDropDown />
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
