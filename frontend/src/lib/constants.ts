// ═══════════════════════════════════════════════════════════════
// CineVault — App Constants
// ═══════════════════════════════════════════════════════════════

export const APP_NAME = "SERIX888";
export const APP_TAGLINE = "ประสบการณ์ภาพยนตร์พรีเมียมสำหรับคนไทย";
export const APP_DESCRIPTION = "ค้นหา เช่า และรับชมหนัง ซีรีส์คุณภาพสูงในสไตล์แพลตฟอร์มไทยแลนด์";

export const PREVIEW_DURATION = 30; // 30 seconds

export const NAV_LINKS = [
  { label: "หน้าหลัก", href: "/" },
  { label: "หนัง", href: "/browse?type=movie" },
  { label: "ซีรีส์", href: "/browse?type=series" },
  { label: "หมวดหมู่", href: "/browse" },
  { label: "ไลบรารีของฉัน", href: "/profile" },
] as const;

export const SUBSCRIPTION_PLANS = [
  {
    id: "basic",
    name: "พื้นฐาน",
    price: 4.99,
    period: "ต่อเดือน",
    features: [
      "สตรีมคุณภาพ 720p",
      "ดูได้บนอุปกรณ์ 1 เครื่อง",
      "เช่าได้ 5 เรื่อง/เดือน",
      "ซับไตเติลมาตรฐาน",
    ],
    isPopular: false,
    color: "#06B6D4",
  },
  {
    id: "premium",
    name: "พรีเมียม",
    price: 9.99,
    period: "ต่อเดือน",
    features: [
      "สตรีมคุณภาพ 1080p",
      "ดูได้บนอุปกรณ์ 3 เครื่อง",
      "เช่าได้ 15 เรื่อง/เดือน",
      "ซับไตเติลทุกภาษา",
      "เข้าถึงคอนเทนต์ใหม่ก่อนใคร",
      "ดาวน์โหลดออฟไลน์ได้",
    ],
    isPopular: true,
    color: "#4F46E5",
  },
  {
    id: "ultra",
    name: "อัลตร้า",
    price: 14.99,
    period: "ต่อเดือน",
    features: [
      "สตรีม 4K HDR",
      "ดูได้บนอุปกรณ์ 5 เครื่อง",
      "เช่าได้ไม่จำกัด",
      "ซับไตเติลทุกภาษา",
      "เข้าถึงพรีเมียร์และคอนเทนต์พิเศษ",
      "ดาวน์โหลดออฟไลน์ได้",
      "เบื้องหลังพิเศษเฉพาะสมาชิก",
      "ไม่มีโฆษณาตลอดเวลา",
    ],
    isPopular: false,
    color: "#7C3AED",
  },
] as const;

export const QUALITY_OPTIONS = ["720p", "1080p", "4K HDR"] as const;

export const COUNTRIES = [
  "ทุกประเทศ",
  "United States",
  "United Kingdom",
  "South Korea",
  "Japan",
  "France",
  "India",
  "Thailand",
  "Spain",
  "Germany",
] as const;

export const YEAR_RANGE: [number, number] = [2000, 2026];
