import Link from "next/link";
import { Film, Globe, Share2, Star } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

export default function Footer({ siteName, logoUrl }: { siteName?: string | null, logoUrl?: string | null }) {
  const footerLinks = [
    {
      title: "ค้นหา",
      links: [
        { label: "หนัง" , href: "/browse" },
        { label: "ซีรีส์", href: "/browse?type=series" },
        { label: "ผลงานใหม่", href: "/browse?sort=newest" },
        { label: "มาแรง", href: "/browse?sort=trending" },
        { label: "คอลเลกชัน", href: "/browse?view=collections" },
      ],
    },
    {
      title: "บัญชี",
      links: [
        { label: "โปรไฟล์ของฉัน", href: "/profile" },
        { label: "ประวัติการรับชม", href: "/profile?tab=history" },
        { label: "รายการโปรด", href: "/profile?tab=favorites" },
        { label: "สมาชิก", href: "/checkout" },
        { label: "การตั้งค่า", href: "/profile?tab=settings" },
      ],
    },
    {
      title: "บริษัท",
      links: [
        { label: "เกี่ยวกับเรา", href: "#" },
        { label: "ร่วมงานกับเรา", href: "#" },
        { label: "ข่าวสาร", href: "#" },
        { label: "ติดต่อ", href: "#" },
        { label: "พันธมิตร", href: "#" },
      ],
    },
    {
      title: "กฎหมาย",
      links: [
        { label: "ข้อกำหนดการใช้งาน", href: "#" },
        { label: "นโยบายความเป็นส่วนตัว", href: "#" },
        { label: "คุกกี้", href: "#" },
        { label: "กฎหมายลิขสิทธิ์", href: "#" },
      ],
    },
  ];

  return (
    <footer className="relative mt-auto">
      {/* Gradient Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-cv-primary/40 to-transparent" />

      <div className="bg-cv-surface/50 backdrop-blur-sm">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-4 group">
                <div className="relative">
                  <img src="/logo.png" alt={APP_NAME} className="h-10 w-auto object-contain rounded-lg drop-shadow-md transition-all group-hover:scale-105" />
                </div>
                <span className="text-xl font-black font-number text-white uppercase tracking-tight">
                  {siteName || APP_NAME}
                </span>
              </Link>
              <p className="text-sm text-cv-text-dim leading-relaxed mb-6">
                เพียงหนึ่งเดียวสำหรับคนไทยที่รักหนังพรีเมียม ดู เช่า และสะสมคอลเลกชันภาพยนตร์คุณภาพสูง
              </p>
              <div className="flex items-center gap-3">
                {[Globe, Share2, Star].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-9 h-9 rounded-lg bg-white/5 hover:bg-cv-primary/20 flex items-center justify-center text-cv-text-dim hover:text-cv-primary transition-all"
                    aria-label="Social link"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Link Columns */}
            {footerLinks.map((section) => (
              <div key={section.title}>
                <h4 className="text-sm font-semibold text-white mb-4 font-[family-name:var(--font-heading)]">
                  {section.title}
                </h4>
                <ul className="space-y-2.5">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-cv-text-dim hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-cv-text-dim">
              © 2025 {siteName || APP_NAME}. สงวนลิขสิทธิ์
            </p>
            <p className="text-xs text-cv-text-dim">
              สร้างสรรค์เพื่อประสบการณ์ภาพยนตร์ที่เหนือระดับ
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
