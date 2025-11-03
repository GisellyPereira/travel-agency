import { Hero } from "./components/Hero";
import { Logos } from "./components/Logos";
import { Services } from "./components/Services";
import { Features } from "./components/Features";
import { Destinations } from "./components/Destinations";
import { Comparison } from "./components/Comparison";
import { Steps } from "./components/Steps";
import { Stories } from "./components/Stories";
import { Integrations } from "./components/Integrations";
import { Testimonials } from "./components/Testimonials";
import { FAQ } from "./components/FAQ";
import { CTA } from "./components/CTA";
import { Footer } from "./components/Footer";

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      <Hero />
      <Logos />
      <Services />
      <Features />
      <Destinations />
      <Comparison />
      <Steps />
      <Stories />
      <Integrations />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}
