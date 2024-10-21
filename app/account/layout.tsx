"use client";
import { stat } from "fs";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "unauthenticated") {
    router.back();
  }
  if (status == "authenticated") {
    return <div className="">{children}</div>;
  }
}
