import type { ReactNode } from "react";

// Separate layout for login page that doesn't require auth
export default function LoginLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}

