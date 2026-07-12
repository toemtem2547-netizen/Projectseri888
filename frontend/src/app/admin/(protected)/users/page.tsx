import { prisma } from "@/lib/db";
import { User, Shield, Ban } from "lucide-react";
import { UserActions } from "./UserActions";
import UserFilter from "./UserFilter";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; role?: string }>;
}) {
  const { search, role } = await searchParams;

  const users = await prisma.user.findMany({
    where: {
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(role && role !== "ALL" ? { role: role } : {}),
    },
    orderBy: { email: "asc" },
  });

  return (
    <main className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-heading text-white">จัดการผู้ใช้งาน</h1>
        </div>

        <UserFilter />

        <div className="glass-card rounded-2xl overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 text-cv-text-dim text-sm uppercase tracking-wider">
                  <th className="p-4 font-medium">อีเมล</th>
                  <th className="p-4 font-medium">ชื่อ</th>
                  <th className="p-4 font-medium">บทบาท</th>
                  <th className="p-4 font-medium text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cv-primary/30 to-cv-secondary/30 flex items-center justify-center text-cv-text-dim">
                          <User className="w-5 h-5" />
                        </div>
                        <span className="font-semibold text-white">{user.email}</span>
                      </div>
                    </td>
                    <td className="p-4 text-cv-text-dim">{user.name || "-"}</td>
                    <td className="p-4">
                      {user.role === "ADMIN" && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-cv-accent/10 text-cv-accent text-xs rounded-full border border-cv-accent/20">
                          <Shield className="w-3 h-3" /> แอดมิน
                        </span>
                      )}
                      {user.role === "USER" && (
                        <span className="px-3 py-1 bg-white/5 text-cv-text-dim text-xs rounded-full border border-white/10">
                          ผู้ใช้งาน
                        </span>
                      )}
                      {user.role === "BANNED" && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-500/10 text-red-500 text-xs rounded-full border border-red-500/20">
                          <Ban className="w-3 h-3" /> ระงับบัญชี
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <UserActions userId={user.id} currentRole={user.role} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden flex flex-col divide-y divide-white/5">
            {users.map((user) => (
              <div key={user.id} className="p-4 flex flex-col gap-3 hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cv-primary/30 to-cv-secondary/30 flex items-center justify-center text-cv-text-dim flex-shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate text-sm">{user.email}</h3>
                    <p className="text-xs text-cv-text-dim truncate mt-0.5">{user.name || "-"}</p>
                  </div>
                  <div className="flex-shrink-0">
                    {user.role === "ADMIN" && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-cv-accent/10 text-cv-accent text-[10px] rounded-full border border-cv-accent/20">
                        <Shield className="w-3 h-3" /> แอดมิน
                      </span>
                    )}
                    {user.role === "USER" && (
                      <span className="px-2 py-0.5 bg-white/5 text-cv-text-dim text-[10px] rounded-full border border-white/10">
                        ผู้ใช้งาน
                      </span>
                    )}
                    {user.role === "BANNED" && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-500/10 text-red-500 text-[10px] rounded-full border border-red-500/20">
                        <Ban className="w-3 h-3" /> ระงับบัญชี
                      </span>
                    )}
                  </div>
                </div>
                <div className="pt-2 border-t border-white/5 flex justify-end">
                  <UserActions userId={user.id} currentRole={user.role} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
