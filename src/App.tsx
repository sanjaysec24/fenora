import { useState, useEffect } from "react";
import { ThemeProvider } from "./components/ThemeContext";
import LoadingScreen from "./components/LoadingScreen";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Metrics from "./components/Metrics";
import Services from "./components/Services";
import Ecosystem from "./components/Ecosystem";
import TechMarquee from "./components/TechMarquee";
import Projects from "./components/Projects";
import Process from "./components/Process";
import EngineeringTerminal from "./components/EngineeringTerminal";
import WhyChooseUs from "./components/WhyChooseUs";
import GlobalPresence from "./components/GlobalPresence";
import Testimonials from "./components/Testimonials";
import FAQ from "./components/FAQ";
import CTA from "./components/CTA";
import Footer from "./components/Footer";
import ProjectScoper from "./components/ProjectScoper";
import AdminDashboard from "./components/AdminDashboard";
import ProjectDetail from "./components/ProjectDetail";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isScoperOpen, setIsScoperOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState<string | undefined>(undefined);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleNavigate = (path: string) => {
    window.history.pushState({}, "", path);
    setCurrentPath(path);
    window.scrollTo(0, 0);
  };

  const handleOpenScoper = (serviceId?: string) => {
    setPreselectedService(serviceId);
    setIsScoperOpen(true);
  };

  const handleCloseScoper = () => {
    setIsScoperOpen(false);
    setPreselectedService(undefined);
  };

  const handleViewWork = () => {
    // If not on homepage, navigate back home first then scroll
    if (currentPath !== "/") {
      handleNavigate("/");
      setTimeout(() => {
        const workSection = document.getElementById("work");
        if (workSection) {
          workSection.scrollIntoView({ behavior: "smooth" });
        }
      }, 150);
      return;
    }

    const workSection = document.getElementById("work");
    if (workSection) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = workSection.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} />;
  }

  // Path routing rendering map
  const renderContent = () => {
    if (currentPath === "/admin") {
      return (
        <div className="bg-background min-h-screen">
          <AdminDashboard onNavigate={handleNavigate} />
        </div>
      );
    }

    if (currentPath.startsWith("/projects/")) {
      const slug = currentPath.split("/").pop() || "";
      return (
        <div className="bg-background min-h-screen">
          <Navbar onStartProject={() => handleOpenScoper()} onNavigate={handleNavigate} />
          <ProjectDetail 
            slug={slug} 
            onNavigate={handleNavigate} 
            onStartProject={() => handleOpenScoper()} 
          />
          <Footer />
          <ProjectScoper
            isOpen={isScoperOpen}
            onClose={handleCloseScoper}
            preselectedServiceId={preselectedService}
          />
        </div>
      );
    }

    // Default Landing Page Home
    return (
      <div className="bg-background min-h-screen text-foreground relative font-sans selection:bg-primary selection:text-background transition-colors duration-500 antialiased">
        {/* Background ambient lighting glow */}
        <div className="absolute top-0 inset-x-0 h-[600px] bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none z-0" />

        {/* Global Transparent Sticky Header */}
        <Navbar onStartProject={() => handleOpenScoper()} onNavigate={handleNavigate} />

        {/* Hero Section */}
        <Hero
          onStartProject={() => handleOpenScoper()}
          onViewWork={handleViewWork}
        />

        {/* Trust & Metrics Section */}
        <Metrics />

        {/* Core Services Grid */}
        <Services onSelectService={(serviceId) => handleOpenScoper(serviceId)} />

        {/* Technology Ecosystem Showcase */}
        <Ecosystem />

        {/* Infinite technology scrolling ribbons */}
        <TechMarquee />

        {/* Case Studies & Showcases */}
        <Projects onStartProject={() => handleOpenScoper()} onNavigate={handleNavigate} />

        {/* Development Cycle timeline */}
        <Process />

        {/* Live Engineering Terminal Terminal Typing Simulator */}
        <EngineeringTerminal />

        {/* Bento highlights why FENORA */}
        <WhyChooseUs />

        {/* Global worldwide team reach presence map */}
        <GlobalPresence />

        {/* Partners and client reviews */}
        <Testimonials />

        {/* Accordion FAQs */}
        <FAQ />

        {/* Final Call to Action */}
        <CTA onStartProject={() => handleOpenScoper()} />

        {/* Symmetrical Footing */}
        <Footer />

        {/* Multi-step Project Estimator slide-over */}
        <ProjectScoper
          isOpen={isScoperOpen}
          onClose={handleCloseScoper}
          preselectedServiceId={preselectedService}
        />
      </div>
    );
  };

  return (
    <ThemeProvider>
      {renderContent()}
    </ThemeProvider>
  );
}

