import { Hero } from "./components/Hero";
import { Services } from "./components/Services";
import { Destinations } from "./components/Destinations";

export default function Home() {
  return (
    <main>
      <Hero />
      <Services />
      <Destinations />
    </main>
  );
}
