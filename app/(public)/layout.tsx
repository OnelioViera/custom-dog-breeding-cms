import type { ReactNode } from "react";
import { NavbarWrapper } from "@/components/public/navbar-wrapper";
import { ThemeProvider } from "@/components/public/theme-provider";
import { ButtonPresetProvider } from "@/components/public/button-preset-provider";

// Force dynamic rendering to ensure theme updates are reflected
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function PublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <ThemeProvider />
      <ButtonPresetProvider />
      <NavbarWrapper />
      {children}
    </>
  );
}

