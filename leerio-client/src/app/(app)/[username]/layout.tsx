import { AppSidebar } from "@/features/navigation/app-sidebar";
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
      <main className="flex-1 overflow-auto">
        <div className="border-border/50 bg-background/95 sticky top-0 flex items-center gap-2 border-b px-6 py-3 backdrop-blur-sm md:px-8">
          <SidebarTrigger />
        </div>
        <div className="flex justify-center">
          <div className="min-h-175 w-full max-w-6xl p-6 md:p-8">
            {children}
          </div>
        </div>
      </main>
    </SidebarProvider>
  );
};

export default Layout;
