import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { prisma } from "@/lib/db";
import { Bell } from "lucide-react";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // If not logged in or not admin, redirect to login
  if (!session || session.user?.role !== "ADMIN") {
    redirect("/admin/login");
  }

  const unreadCount = await prisma.notification.count({
    where: { userId: session.user.id, isRead: false, type: "ADMIN" }
  });

  let setting = null;
  try {
    setting = await prisma.systemSetting.findUnique({ where: { id: "1" } });
  } catch(e) {}

  return (
    <div className="flex min-h-screen bg-cv-deep text-white">
      <AdminSidebar siteName={setting?.siteName} logoUrl={setting?.logoUrl} />
      <div className="flex-1 md:pl-64 pt-16 md:pt-0 w-full min-w-0 flex flex-col">
        <div className="relative w-full flex-1 flex flex-col">
          {/* Desktop Top Right Actions */}
          <div className="hidden md:flex absolute top-8 left-0 right-0 z-50 pointer-events-none px-4 md:px-8">
            <div className="max-w-7xl mx-auto w-full flex justify-end">
              <Link 
                href="/admin/notifications" 
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl btn-gradient text-white font-medium hover:scale-105 transition-transform relative group shadow-lg pointer-events-auto"
              >
                <Bell className="w-5 h-5" />
                <span>การแจ้งเตือน</span>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 border-2 border-cv-deep rounded-full shadow-[0_0_10px_rgba(250,204,21,0.6)] flex items-center justify-center text-[8px] font-bold text-black">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
