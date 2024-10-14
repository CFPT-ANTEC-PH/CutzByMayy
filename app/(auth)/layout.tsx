export default async function authLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-[calc(100vh-325px)] w-full items-center justify-center max-md:min-h-[calc(100vh-305px)]">
      {children}
    </div>
  );
}
