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
import Image from "next/image";
import logoPm from "@/assets/logo-pm.jpg";

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
        className={`fixed flex flex-col top-0 left-0 h-full w-64 bg-lblue text-white shadow-2xl py-5 transform transition-transform duration-300 ease-in-out z-50 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 overflow-y-auto`}
      >
        <div className="flex px-5 border-b-lblue h-28 shadow-md">
          <Link
            href="/dashboard"
            className="flex flex-row items-center gap-2 pb-4"
          >
            <Image
              src={logoPm}
              alt="Logo"
              width={64}
              height={64}
              className="rounded-full border-2 border-white shadow-lg mr-2"
            />
            <h1 className="text-2xl font-bold uppercase">Lapor Semanu</h1>
          </Link>
          <button
            onClick={toggleSidebar}
            className="absolute top-4 right-4 md:hidden"
          >
            <X size={24} />
          </button>
        </div>
        <div className="px-5 flex flex-col h-full">
          <nav className="mt-6">
            <ul className="space-y-2">
              {menuItems.map((item, index) => (
                <li key={index}>
                  {item.subItems ? (
                    <button
                      onClick={() => toggleSubmenu(index)}
                      className="flex items-center justify-between w-full p-2 rounded text-gray-200 hover:text-white transition-colors duration-200"
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
                      className="flex items-center w-full py-2 rounded"
                    >
                      <div className="flex items-center font-semibold text-lg space-x-2 pb-2">
                        {/* <item.icon size={20} /> */}
                        <span>{item.text}</span>
                      </div>
                    </Link>
                  )}
                  {openSubmenu === index && (
                    <ul className="px-2 py-2 mt-2 rounded-lg space-y-2 bg-neutral-100 text-gray-900 text-sm">
                      {item.subItems.map((subItem, subIndex) => (
                        <li key={subIndex}>
                          <Link
                            href={`${item.link}/${subItem
                              .toLowerCase()
                              .replace(" ", "-")}`}
                            className="block py-2 px-4 rounded hover:bg-neutral-300 transition-colors duration-200"
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
            <hr className="border-t border-blue-100 my-5" />
          </div>
        </div>
      </div>

      <main className="flex flex-col md:ml-64 p-6 flex: 1;">{children}</main>
    </div>
  );
}
