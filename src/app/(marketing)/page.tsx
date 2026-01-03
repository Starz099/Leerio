import Navbar from "@/features/marketing/components/navbar/navbar";
import Hero from "@/features/marketing/components/hero";
import Mockup from "@/features/marketing/components/mockup";
import HowItWorks from "@/features/marketing/components/how-it-works";
import UseCases from "@/features/marketing/components/use-cases";
import PrivacyControl from "@/features/marketing/components/privacy-control";
import { Container } from "@/shared/components/container";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import CTA from "@/features/marketing/components/cta";
import Footer from "@/features/marketing/components/footer";
import FAQ from "@/features/marketing/components/faq";

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
