import BottomNavbar from "@/components/layout/BottomNavbar";
import Hero from "@/components/design/hero";
import Explore from "@/components/design/Explore";
import BookingModal from "@/components/ui/BookingModal";
import GallerySection from "@/components/design/GallerySection";
import FAQSection from "@/components/design/FAQSection";
import ContactSection from "@/components/design/ContactSection";

export default function Page() {
  return (
    <main className="relative min-h-screen bg-white">
      <BottomNavbar />
      <Hero />
      <Explore />
      <BookingModal />
      <GallerySection />
      <FAQSection />
      <ContactSection />
    </main>
  );
}