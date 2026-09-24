import type { ReactNode } from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AppSidebar } from "@/components/admin/app-sidebar"
import { SiteHeader } from "@/components/admin/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Toaster } from 'sonner';

export default async function AdminLayout({ 
    children,
}: {
    children: ReactNode
}) {

const supabase = await createClient()
const { 
    data: {user},
 } = await supabase.auth.getUser()

 if(!user){
    redirect("/login")
 }

 const NavUser = {
    name: user.email ?? "",
    email: user.email ?? "",
    avatar: "/avatars/shadcn.jpg"
 }

    return(
        <div>
            <SidebarProvider
            style={
                {
                "--sidebar-width": "calc(var(--spacing) * 72)",
                "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
            >
            <AppSidebar variant="inset" user={NavUser} />
            <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="">
                        {children}
                    </div>
                </div>
                </div>
            </SidebarInset>
            </SidebarProvider>
            <Toaster />
        </div>
    )
}

