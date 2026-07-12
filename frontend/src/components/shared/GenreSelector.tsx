"use client";

import Link from "next/link";
import { Clapperboard, icons } from "lucide-react";

interface Category {
  id: string;
  name: string;
  iconName: string;
}

interface GenreSelectorProps {
  categories: Category[];
}

export function GenreSelector({ categories }: GenreSelectorProps) {
  return (
    <section>
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-white">ประเภท</h2>
        <p className="mt-1 text-sm text-cv-text-dim">ค้นหาหนังตามอารมณ์ สไตล์ และบรรยากาศ</p>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {categories.map((category) => {
          const GenreIcon = (icons as any)[category.iconName] || Clapperboard;
          return (
            <Link key={category.id} href={`/browse?genre=${category.name}`} className="group rounded-[28px] border border-white/10 bg-cv-card/80 p-5 text-center transition hover:-translate-y-1 hover:border-cv-accent/40 hover:shadow-[0_18px_50px_rgba(59,130,246,0.18)]">
              <div className="mx-auto mb-3 grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br from-cv-primary/20 to-cv-accent/10 text-white shadow-lg shadow-cv-primary/10">
                <GenreIcon className="h-7 w-7" />
              </div>
              <div className="font-semibold text-white">{category.name}</div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
