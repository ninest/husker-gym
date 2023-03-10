"use client";
import { MenuButton } from "@/components/MenuButton";
import { utcToEst } from "@/date/utils";
import { useTheme } from "@/hooks/settings";
import { format } from "date-fns";

import {
  FaEllipsisH,
  FaGithub,
  FaHeart,
  FaMailBulk,
  FaMoon,
  FaPaw,
  FaSun,
} from "react-icons/fa";

export const Navbar = () => {
  const { setTheme } = useTheme();
  const dateDisplay = format(utcToEst(new Date()), "EEEE, MMMM d");

  return (
    <header className="px-5 pt-3">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-bold text-xl">Husker Gym</div>
          <div className="-mt-1 font-bold text-gray-500">{dateDisplay}</div>
        </div>

        <MenuButton
          items={[
            {
              title: "About",
              href: "/about",
            },
            {
              title: "Feedback",
              href: "https://husker.vercel.app/contribute?name=Husker+Gym",
            },
            {
              icon: FaMailBulk,
              title: "Mailing list",
              href: "http://eepurl.com/imB7zE",
            },
            "separator",
            {
              icon: FaMoon,
              title: "Dark theme",
              action: () => setTheme("dark"),
            },
            {
              icon: FaSun,
              title: "Light theme",
              action: () => setTheme("light"),
            },
            "separator",
            {
              icon: FaPaw,
              title: "Husker",
              href: "https://husker.vercel.app",
            },
            {
              icon: FaHeart,
              title: "Support",
              href: "https://husker.vercel.app/support",
            },
            "separator",
            {
              icon: FaGithub,
              title: "GitHub",
              href: "https://github.com/husker-nu/husker-gym",
            },
          ]}
        >
          <div className="bg-gray-100 text-gray-600 p-1 rounded-full dark:bg-gray-900 text-gray-400">
            <FaEllipsisH />
          </div>
        </MenuButton>
      </div>
    </header>
  );
};
