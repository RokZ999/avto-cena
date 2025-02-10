"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";

const ModeToggleLogo: React.FC = () => {
  const { systemTheme, resolvedTheme } = useTheme();
  const [imgSrc, setImgSrc] = useState<string>("");
  const logoSources: { [key: string]: string } = {
    light: "/avto-cena-logo-dark.png",
    dark: "/avto-cena-logo-light.png",
  };

  useEffect(() => {
    const currentTheme = resolvedTheme || systemTheme || "light";
    setImgSrc(logoSources[currentTheme]);
  }, [systemTheme, resolvedTheme]);

  return imgSrc ? (
    <img
      src={imgSrc}
      className="object-contain h-20 w-20"
      alt="AvtoCena Logo"
    />
  ) : null;
};

export default ModeToggleLogo;
