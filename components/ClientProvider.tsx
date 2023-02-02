"use client";

import { useTheme } from "@/hooks/settings";
import { useEffect } from "react";
// This component is a client component for global use effect/other actions
// that cannot run on the server

export const ClientProvider = () => {
  const { theme } = useTheme();
  useEffect(() => {
    document.documentElement.className = theme;
  }, []);

  return <></>;
};
