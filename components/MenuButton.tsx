"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import type { IconType } from "react-icons";

interface MenuButtonProps {
  children: JSX.Element;
  items: { action?: () => {}; title: string; icon?: IconType }[];
}
export const MenuButton = ({ children, items }: MenuButtonProps) => {
  return (
    <div className="relative inline-block">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>{children}</DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="end"
            className="mt-1 rounded-lg bg-gray-100 w-52 p-2 border"
          >
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <DropdownMenu.Item
                  onClick={() => {
                    if (item.action) item.action();
                  }}
                  className="flex items-center px-2 py-1 text-gray-700 focus:outline-none hover:bg-gray-200 rounded-md"
                >
                  <div className="w-6 text-gray-500 text-sm">
                    {Icon && <Icon className="text-current" />}
                  </div>
                  <div>{item.title}</div>
                </DropdownMenu.Item>
              );
            })}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
};
