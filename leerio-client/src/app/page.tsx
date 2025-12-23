import { Container } from "@/components/container";
import Navbar from "@/components/Landing/Navbar/navbar";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";

const Home = async () => {
  const user = await currentUser();
  return (
    <Container>
      <Navbar />
      <Link href={`/${user?.username}/dashboard`}>Go to Dashboard</Link>
    </Container>
  );
};

export default Home;
