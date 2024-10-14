import AccountNav from "@/components/AccountNav";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="mx-auto h-screen min-h-[calc(100vh-325px)] w-full max-w-[1200px] p-2 max-md:min-h-[calc(100vh-305px)] md:flex md:items-center md:gap-4">
      <AccountNav />
      <div className="h-full w-full">{children}</div>
    </main>
  );
}
