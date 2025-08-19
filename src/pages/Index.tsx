
import Hero from '../components/Hero';
import Header from '../components/Header';
import AboutSection from '../components/AboutSection';
import PlatformSection from '../components/PlatformSection';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <AboutSection />
      <PlatformSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
