'use client'

import { AppSidebar } from "@/components/admin/app-sidebar"
import { ChartAreaInteractive } from "@/components/admin/chart-area-interactive"
import { DataTable } from "@/components/admin/data-table"
import { SectionCards } from "@/components/admin/section-cards"
import { SiteHeader } from "@/components/admin/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

import data from "@/app/admin/data.json"

export default function Page() {
  return (
    <>
      <SectionCards />
      <div className="px-4 lg:px-6">
          <ChartAreaInteractive />
      </div>
    </>
  )
}
