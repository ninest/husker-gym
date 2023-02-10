"use client";

import { useTheme } from "@/hooks/settings";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

// This component is a client component for global use effect/other actions
// that cannot run on the server
export const ClientProvider = () => {
  const { theme } = useTheme();
  const pathname = usePathname();
  
  // Seems like safari does not want you to set the website tint to pure white
  const statusBarColorMap = { light: "#efefef", dark: "#000000" };
  useEffect(() => {
    document.documentElement.className = theme;
    (document.getElementsByTagName("meta") as any)["theme-color"].content =
      statusBarColorMap[theme];
  }, []);

  // Goat counter
  useEffect(() => {
    if (
      process.env.NODE_ENV === "production" &&
      typeof window !== "undefined" &&
      "goatcounter" in window
    ) {
      // @ts-ignore
      window.goatcounter.count({
        path: pathname,
      });
    }
  }, [pathname]);

  return <></>;
};
