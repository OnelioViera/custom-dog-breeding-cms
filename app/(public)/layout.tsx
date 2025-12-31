import type { ReactNode } from "react";
import { NavbarWrapper } from "@/components/public/navbar-wrapper";

export default function PublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <NavbarWrapper />
      {children}
    </>
  );
}

