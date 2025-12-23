"use client";
import { Upload } from "lucide-react";

interface UploadFileProps {
  username: string;
}

const UploadFile = ({ username }: UploadFileProps) => {
  const handleUploadClick = () => {
    const el = document.createElement("input");
    el.type = "file";
    el.accept = ".pdf";
    el.click();

    el.onchange = async () => {
      if (el.files && el.files.length > 0) {
        const file = el.files[0];

        if (file) {
          const formData = new FormData();
          formData.append("pdf", file);
          formData.append("username", username as string);
          const res = await fetch("http://localhost:8000/upload", {
            method: "POST",
            body: formData,
          });
          console.log("File uploaded successfully");
          console.log(res);
        }

        console.log("Selected file:", file.name);
      }
    };
  };
  return (
    <div
      className="border-muted-foreground rounded-2xl border-2 px-10 py-4"
      onClick={handleUploadClick}
    >
      <Upload />
    </div>
  );
};

export default UploadFile;
