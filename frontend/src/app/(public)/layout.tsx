import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  
  let dbUser = null;
  if (session?.user?.id) {
    try {
      dbUser = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { name: true, image: true, email: true, role: true }
      });
    } catch(e) {}
  }

  const headerSession = session ? {
    ...session,
    user: {
      ...session.user,
      ...(dbUser || {})
    }
  } : null;

  let setting = null;
  try {
    setting = await prisma.systemSetting.findUnique({ where: { id: "1" } });
  } catch(e) {}

  return (
    <>
      <Header session={headerSession} siteName={setting?.siteName} logoUrl={setting?.logoUrl} />
      <main className="flex-1">{children}</main>
      <Footer siteName={setting?.siteName} logoUrl={setting?.logoUrl} />
    </>
  );
}
