"use client";
import { stat } from "fs";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status == "loading") {
    return <div></div>;
  }

  if (status === "unauthenticated" || session?.user.role !== "ADMIN") {
    router.back();
  }
  if (status == "authenticated" && session?.user.role === "ADMIN") {
    return (
      <div className="flex min-h-[calc(100vh-325px)] items-center justify-center max-md:min-h-[calc(100vh-305px)]">
        {children}
      </div>
    );
  }
}
