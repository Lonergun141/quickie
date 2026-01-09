import {
  Navbar,
  HeroSection,
  AboutSection,
  VideoSection,
  MobileAppSection,
  TestimonialsSection,
  FAQSection,
  FooterSection,
} from "@/components/landing";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <VideoSection />
      <MobileAppSection />
      <TestimonialsSection />
      <FAQSection />
      <FooterSection />
    </div>
  );
}
