"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import type { IconType } from "react-icons";

interface MenuButtonProps {
  children: JSX.Element;
  items: { action?: () => void; title: string; icon?: IconType }[];
}
export const MenuButton = ({ children, items }: MenuButtonProps) => {
  return (
    <div className="relative inline-block">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger className="focus:outline-none">
          {children}
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="end"
            className="mt-1 rounded-lg bg-gray-100 w-52 p-2 border dark:bg-gray-900 dark:border-gray-800"
          >
            {items.map((item, index) => {
              const Icon = item.icon;
              return (
                <DropdownMenu.Item
                  key={index}
                  onClick={() => {
                    if (item.action) item.action();
                  }}
                  className="flex items-center px-2 py-1 text-gray-700 focus:outline-none hover:bg-gray-200 rounded-md dark:hover:bg-gray-800"
                >
                  <div className="w-6 text-gray-500 text-sm ">
                    {Icon && <Icon className="text-current" />}
                  </div>
                  <div className="dark:text-gray-400">{item.title}</div>
                </DropdownMenu.Item>
              );
            })}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
};
