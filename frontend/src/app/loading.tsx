export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex min-h-screen flex-col items-center justify-center bg-cv-deep backdrop-blur-md">
      <div className="relative flex h-24 w-24 items-center justify-center">
        {/* Outer spinning ring */}
        <div className="absolute inset-0 animate-[spin_3s_linear_infinite] rounded-full border-4 border-cv-primary/20 border-t-cv-primary"></div>
        {/* Inner spinning ring */}
        <div className="absolute inset-2 animate-[spin_2s_linear_infinite_reverse] rounded-full border-4 border-cv-accent/20 border-t-cv-accent"></div>
        {/* Center logo or pulse */}
        <div className="h-8 w-8 animate-pulse rounded-full bg-gradient-to-tr from-cv-primary to-cv-secondary"></div>
      </div>
      <p className="mt-6 animate-pulse font-heading text-lg font-medium tracking-widest text-cv-text-dim">
        กำลังโหลดข้อมูล...
      </p>
    </div>
  );
}
