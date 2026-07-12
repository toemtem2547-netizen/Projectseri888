import { auth } from "@/auth";
import PricingClient from "./PricingClient";

export const metadata = {
  title: "สมัคร VIP - CineVault",
  description: "สมัครแพ็กเกจ VIP เพื่อรับชมภาพยนตร์และซีรีส์ทุกเรื่องบน CineVault แบบไม่มีข้อจำกัด",
};

export default async function PricingPage() {
  const session = await auth();
  const isLoggedIn = !!session?.user?.id;

  return <PricingClient isLoggedIn={isLoggedIn} />;
}
