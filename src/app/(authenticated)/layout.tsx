import Footer from "@/components/Footer";
import MobileBottomNavi from "./_components/MobileBottomNavi";
import MobileHeader from "./_components/MobileHeader";
import SideNavi from "./_components/SideNavi";

export default function CommonLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="h-screen md:flex">
      <MobileHeader className="block md:hidden" />
      <SideNavi current="" />

      <div className="min-h-full w-full px-6 py-8 md:shrink md:overflow-y-scroll md:px-12 ">
        {children}
      </div>

      <Footer className="block bg-background px-6 py-12 pb-32 text-center md:hidden" />
      <MobileBottomNavi current="" />
    </div>
  );
}
