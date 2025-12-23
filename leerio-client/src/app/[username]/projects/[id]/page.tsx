import { Card } from "@/components/ui/card";
import Workbench from "@/components/Work/workbench";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return (
    <div className="flex">
      project {id}
      <Card className="m-4 flex size-80 items-center justify-center p-4 text-2xl">
        <p>pdf-preview</p>
      </Card>
      <Card className="m-4 size-80 p-4">
        <Workbench />
      </Card>
    </div>
  );
};

export default page;
