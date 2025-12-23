import Navbar from "@/components/Landing/Navbar/navbar";
import Hero from "@/components/Landing/hero";
import Mockup from "@/components/Landing/mockup";
import HowItWorks from "@/components/Landing/how-it-works";
import UseCases from "@/components/Landing/use-cases";
import PrivacyControl from "@/components/Landing/privacy-control";
import { Container } from "@/components/container";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import CTA from "@/components/Landing/cta";
import Footer from "@/components/Landing/footer";
import FAQ from "@/components/Landing/faq";

const Home = async () => {
  const user = await currentUser();

  // If user is signed in, redirect to dashboard
  if (user?.username) {
    redirect(`/${user.username}/dashboard`);
  }

  return (
    <Container>
      <Navbar />
      <Hero />
      <Mockup />
      <HowItWorks />
      <UseCases />
      <PrivacyControl />
      <FAQ />
      <CTA />
      <Footer />
    </Container>
  );
};

export default Home;
