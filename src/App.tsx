import { Contact } from "./components/Contact";
import { Experience } from "./components/Experience";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Intro } from "./components/Intro";
import { Projects } from "./components/Projects";

export default function App() {
  return (
    <div className="page" id="top">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Intro />
        <Experience />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
