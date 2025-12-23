import UploadFile from "@/components/Dashboard/upload-file";

const page = async ({ params }: { params: { username: string } }) => {
  const { username } = await params;
  return (
    <div>
      dashboard
      <UploadFile username={username} />
    </div>
  );
};

export default page;
