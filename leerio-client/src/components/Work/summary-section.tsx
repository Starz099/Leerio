import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { useState } from "react";

const SummarySection = () => {
  const [summary, setSummary] = useState<string>("");
  const pathname = usePathname();

  const pathParts = pathname.split("/");
  const username = pathParts[1];
  const projectId = pathParts[3];
  const handleSummarize = async () => {
    const response: { response: string } = await (
      await fetch(
        `http://localhost:8000/summary?username=${username}&projectId=${projectId}`,
        {
          method: "POST",
        },
      )
    ).json();

    setSummary(response.response);
  };

  if (summary !== "") {
    return (
      <div className="p-4">
        <h2 className="mb-4 text-2xl font-bold">Project Summary</h2>
        <p className="whitespace-pre-wrap">{summary}</p>
      </div>
    );
  }
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Button className="cursor-pointer" onClick={() => handleSummarize()}>
        {" "}
        Summarise{" "}
      </Button>
    </div>
  );
};

export default SummarySection;
