"use client";

import { usePathname } from "next/navigation";

const Page = () => {
  const path = usePathname();
  const username = path.split("/")[1];
  return <div className="text-2xl font-semibold">Username: {username}</div>;
};

export default Page;
