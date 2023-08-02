import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (session?.user == null) {
    redirect("/login");
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      {children}
    </main>
  );
}
