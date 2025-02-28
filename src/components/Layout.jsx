import Header from "./Header";
import Hero from "./Hero";
import Gallery from "./Gallery";
import About from "./About";
import Contact from "./Contact";

export default function Layout() {
  return (
    <div className="bg-black text-white">
      <Header />
      <Hero />
      <Gallery />
      <About />
      <Contact />
    </div>
  );
}
