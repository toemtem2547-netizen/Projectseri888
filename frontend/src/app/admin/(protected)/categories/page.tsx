import { prisma } from "@/lib/db";
import { FolderOpen } from "lucide-react";
import CategoryForm from "./CategoryForm";
import CategoryList from "./CategoryList";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <main className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cv-primary to-cv-secondary flex items-center justify-center shadow-lg">
            <FolderOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold font-heading text-white">จัดการหมวดหมู่</h1>
            <p className="text-cv-text-dim text-sm mt-1">เพิ่ม ลบ หรือแก้ไขหมวดหมู่ภาพยนตร์ที่จะแสดงในหน้าแรก</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <CategoryForm />
          </div>
          <div className="lg:col-span-2">
            <CategoryList initialCategories={categories} />
          </div>
        </div>
      </div>
    </main>
  );
}
