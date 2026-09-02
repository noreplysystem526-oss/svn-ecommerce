"use client"

import type {
  ColumnDef,
} from "@tanstack/react-table"

import type { ResourceConfig,ResourceData } from "@/lib/resources/types"
import {
  features,
  type DataTableFeatures,
} from "@/components/admin/resource-table/data-table-features"

export function createColumns<
  TData extends ResourceData
>(
  config: ResourceConfig
): ColumnDef< DataTableFeatures, TData>[] {
  return config.fields.map((field) => ({
    accessorKey: field.name,

    header: field.label,

    cell: ({ row }) => {
      const value = row.getValue(field.name)

      if (value === null || value === undefined) {
        return "-"
      }

      switch (field.type) {
        case "number":
          return typeof value === "number"
            ? value.toLocaleString("vi-VN")
            : String(value)

        case "boolean":
          return value ? "Yes" : "No"

        default:
          return String(value)
      }
    },
  }))
}