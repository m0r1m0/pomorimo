export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      {children}
    </main>
  );
}
