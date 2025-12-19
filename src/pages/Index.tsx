import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturedRewards from "@/components/FeaturedRewards";
import HowItWorks from "@/components/HowItWorks";
import WinnerBoard from "@/components/WinnerBoard";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Shareat Lucky Draw - Win Amazing Prizes Every Month!</title>
        <meta 
          name="description" 
          content="Enter unique codes from Shareat snack packs to win exciting prizes like iPhones, PS5, and more. Join the monthly lucky draw today!" 
        />
        <meta property="og:title" content="Shareat Lucky Draw - Win Amazing Prizes" />
        <meta property="og:description" content="Find unique codes in Shareat snack packs and enter for a chance to win incredible prizes every month!" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <HeroSection />
          <FeaturedRewards />
          <HowItWorks />
          <WinnerBoard />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
