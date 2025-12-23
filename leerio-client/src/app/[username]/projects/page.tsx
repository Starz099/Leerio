import Projects from "@/components/Dashboard/projects";

const page = async ({ params }: { params: { username: string } }) => {
  const { username } = await params;

  return (
    <div>
      <Projects username={username} />
    </div>
  );
};

export default page;
