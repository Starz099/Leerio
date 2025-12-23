import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { auth, currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import type { ReactNode } from "react";

type UsernameLayoutProps = {
  children: ReactNode;
  params: Promise<{ username: string }>;
};

const Layout = async ({ children, params }: UsernameLayoutProps) => {
  const { username } = await params;
  const { isAuthenticated } = await auth();

  if (!isAuthenticated) {
    return <div>Sign in to view this page</div>;
  }

  const user = await currentUser();
  if (user?.username !== username) {
    return (
      <div>
        view your own profile. Go to:
        <Link
          href={`/${user?.username}/dashboard`}
          className="text-blue-600 underline"
        >
          your dashboard
        </Link>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
};

export default Layout;
