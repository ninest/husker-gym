"use client";
import { MenuButton } from "@/components/MenuButton";
import { useTheme } from "@/hooks/settings";
import { useEffect } from "react";
import { FaEllipsisH, FaMoon, FaSun } from "react-icons/fa";

export const Navbar = () => {
  const { theme, setTheme } = useTheme();
  useEffect(() => {
    console.log(`need to set to ${theme}`);
    
    console.log(document.documentElement.className);
    document.documentElement.className = theme;
    console.log(document.documentElement.className);
  }, []);

  return (
    <header className="px-5 pt-3">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-bold text-xl">Husker Gym</div>
          <div className="-mt-1 font-bold text-gray-500">
            Thursday, February 2
          </div>
        </div>

        <MenuButton
          items={[
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
