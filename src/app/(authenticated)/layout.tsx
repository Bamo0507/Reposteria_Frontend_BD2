"use client";

import { ReactNode } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { Toolbar } from "@/components/shared/toolbar";

type AuthenticatedLayoutProps = {
  children: ReactNode;
};

export default function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {

   return (
        <SidebarProvider>
            <div className="flex w-full min-h-screen">
            <AppSidebar className="peer" />

            <SidebarInset
                className="
                flex-1
                md:peer-data-[variant=inset]:rounded-none
                md:peer-data-[variant=inset]:shadow-none
                md:peer-data-[variant=inset]:m-0
                "
            >
                <Toolbar />
                <main className="flex-1 grid place-items-center min-h-0 mx-2 md:mx-4 lg:mx-8 my-4">
                  {children}
                </main>
            </SidebarInset>
            </div>
        </SidebarProvider>
    );
}