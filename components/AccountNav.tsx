"use client";

import { Notebook, Settings, CreditCard, Info, Calendar } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AccountNav() {
  const pathname = usePathname();

  const menuDashboard = [
    { name: "Information", icon: Info, path: "/account/information" },
    { name: "Réservation", icon: Calendar, path: "/account/reservation" },
    { name: "Paramètre", icon: Settings, path: "/account/settings" },
  ];

  return (
    <nav className="flex w-full gap-2 md:h-full md:w-16 md:flex-col lg:w-40">
      {menuDashboard.map((link, index) => {
        {
          const isActive = pathname.startsWith(link.path);
          return (
            <Link href={link.path}>
              <div
                className={`lg:pd-3 hover:text.white flex cursor-pointer items-center justify-center gap-2 rounded-md p-2 text-sm font-bold hover:bg-slate-500 hover:bg-opacity-50 lg:justify-start ${
                  isActive && "bg-slate-500 text-white"
                }`}
              >
                <link.icon className="w-4" />
                <span className="hidden lg:block">{link.name}</span>
              </div>
            </Link>
          );
        }
      })}
    </nav>
  );
}
