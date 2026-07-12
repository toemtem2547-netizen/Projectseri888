import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { Bell } from "lucide-react";
import { NotificationItem } from "./NotificationItem";

export default async function AdminNotificationsPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id, type: "ADMIN" },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <main className="p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cv-primary to-cv-secondary flex items-center justify-center shadow-lg">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold font-heading text-white">การแจ้งเตือนของระบบ</h1>
              <p className="text-cv-text-dim text-sm mt-1">ดูรายการแจ้งเตือนทั้งหมดของคุณ</p>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="flex flex-col divide-y divide-white/5">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-cv-text-dim">ยังไม่มีการแจ้งเตือนใหม่</div>
            ) : (
              notifications.map((notification) => (
                <NotificationItem key={notification.id} notification={notification} />
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
