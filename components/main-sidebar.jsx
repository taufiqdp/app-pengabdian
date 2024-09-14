"use client";

import { useState } from "react";
import {
  X,
  Home,
  Users,
  Calendar,
  UserPlus,
  List,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import TopNavbar from "./top-navbar";
import Link from "next/link";

export default function MainSidebar({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleSubmenu = (index) => {
    setOpenSubmenu(openSubmenu === index ? null : index);
  };

  const menuItems = [
    {
      icon: Home,
      text: "Dasboard",
      link: "/dashboard",
    },
    {
      icon: List,
      text: "Kegiatan",
      link: "/kegiatan",
      subItems: ["List Kegiatan"],
    },
    {
      icon: Users,
      text: "Pamong",
      link: "/pamong",
      subItems: ["List Pamong", "Tambah Pamong"],
    },
    {
      icon: UserPlus,
      text: "User",
      link: "/user",
      subItems: ["List User"],
    },
    {
      icon: Calendar,
      text: "Agenda",
      link: "/agenda",
      subItems: ["Kalender"],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <TopNavbar toggleSidebar={toggleSidebar} />

      <div
        className={`fixed flex flex-col top-0 left-0 h-full w-64 bg-gray-800 text-white p-5 transform transition-transform duration-300 ease-in-out z-50 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 overflow-y-auto`}
      >
        <button
          onClick={toggleSidebar}
          className="absolute top-4 right-4 md:hidden"
        >
          <X size={24} />
        </button>

        <div className="flex flex-row items-center gap-2">
          <h1 className="text-2xl uppercase">Semanu</h1>
        </div>
        <nav>
          <hr className="border-t border-gray-700 my-5" />

          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                {item.subItems ? (
                  <button
                    onClick={() => toggleSubmenu(index)}
                    className="flex items-center justify-between w-full p-2 rounded hover:bg-gray-700 transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-2">
                      <item.icon size={20} />
                      <span>{item.text}</span>
                    </div>
                    {openSubmenu === index ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                  </button>
                ) : (
                  <Link
                    href={item.link}
                    className="flex items-center w-full p-2 rounded hover:bg-gray-700 transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-2">
                      <item.icon size={20} />
                      <span>{item.text}</span>
                    </div>
                  </Link>
                )}
                {openSubmenu === index && (
                  <ul className="ml-6 mt-2 space-y-2">
                    {item.subItems.map((subItem, subIndex) => (
                      <li key={subIndex}>
                        <Link
                          href={`${item.link}/${subItem
                            .toLowerCase()
                            .replace(" ", "-")}`}
                          className="block p-2 rounded hover:bg-gray-700 transition-colors duration-200"
                        >
                          {subItem}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-auto">
          <hr className="border-t border-gray-700 my-5" />
        </div>
      </div>

      <main className="md:ml-64 p-6">{children}</main>
    </div>
  );
}
