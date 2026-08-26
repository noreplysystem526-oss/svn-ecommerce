import { AppSidebar } from "@/components/admin/app-sidebar"
import { DataTable } from "@/components/admin/data-table"
import { SiteHeader } from "@/components/admin/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

export default function AdminLayout({ 
    children,
}: Readonly<{children: React.ReactNode; }>) {
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
            <AppSidebar variant="inset" />
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
            
        </div>
    )
}

