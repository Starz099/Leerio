"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { UserButton } from "@clerk/nextjs";
import { FileImage, LayoutGrid, PackagePlus, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { ThemeToggleButton } from "@/features/theme/theme-switch";

export function AppSidebar() {
  const pathname = usePathname();
  const path = pathname.split("/").slice(0, 2).join("/");

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader>
        <Link
          className="flex w-full items-center gap-2 text-3xl font-bold group-data-[collapsible=icon]:justify-center"
          href="/"
        >
          <Image
            src="/logo.png"
            alt="Leerio Logo"
            width={36}
            height={36}
            className="size-10"
          />
          <span className="group-data-[collapsible=icon]:hidden">Leerio</span>
        </Link>
      </SidebarHeader>
      {
        <SidebarContent className="mt-4 flex flex-col gap-2">
          {[
            { label: "Dashboard", href: `${path}/dashboard`, icon: LayoutGrid },
            { label: "Projects", href: `${path}/projects`, icon: FileImage },
            { label: "Settings", href: `${path}/settings`, icon: PackagePlus },
            { label: "Profile", href: `${path}`, icon: User },
          ].map((item, index) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={index}
                className={`flex w-full items-center gap-2 text-xl group-data-[collapsible=icon]:justify-center ${isActive ? "bg-muted" : ""}`}
                href={item.href}
              >
                <item.icon className="h-4 w-4" />
                <span className="group-data-[collapsible=icon]:hidden">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </SidebarContent>
      }

      <SidebarFooter>
        <div className="flex w-full items-center justify-end gap-2 group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-start">
          <ThemeToggleButton
            className="rounded-full"
            variant="rectangle"
            start="top-down"
            blur
          />
          <UserButton />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
