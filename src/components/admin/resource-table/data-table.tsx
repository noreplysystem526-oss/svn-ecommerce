"use client"

import * as React from "react"

import {
  useTable,
  type ColumnDef,
  type ColumnFiltersState,
  type RowData,
  type SortingState,
  type ColumnVisibilityState,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  features,
  type DataTableFeatures,
} from "@/components/admin/resource-table/data-table-features"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import type { ResourceConfig, ResourceData } from "@/lib/resources/types"

import { createColumns } from "./columns"
import { getProducts } from "@/lib/repository/product.repository"
import { getOrders } from "@/lib/repository/order.repository"

interface ResourceTableProps<TData extends ResourceData> {
  data: TData[]
  config: ResourceConfig
}

export function ResourceTable<
  TData extends ResourceData
>({
  data,
  config,
}: ResourceTableProps<TData>) {
  const [sorting, setSorting] =
    React.useState<SortingState>([])

  const [columnVisibility, setColumnVisibility] =
    React.useState<ColumnVisibilityState>({})

  const [rowSelection, setRowSelection] =
    React.useState({})

  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>([])

  const [pagination, setPagination] =
    React.useState({
      pageIndex: 0,
      pageSize: 10,
    })

  const columns = React.useMemo<
    ColumnDef< DataTableFeatures,TData>[]
  >(
    () => createColumns<TData>(config),
    [config]
  )

  const table = useTable<
    DataTableFeatures,
    TData
  >({
    features,

    data,
    columns,

    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },

    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,

    getRowId: (row) => String(row.id),

    enableRowSelection: true,
  })

  return (
    <div className="w-full">

      {/* Toolbar */}

      <div className="flex items-center justify-between py-4">

        <Input
          placeholder={`Search ${config.title.toLowerCase()}...`}
          className="max-w-sm"
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Customize columns
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">

            {table
              .getAllColumns()
              .filter(
                (column) => column.getCanHide()
              )
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) =>
                    column.toggleVisibility(!!value)
                  }
                >
                  {typeof column.columnDef.header === "string"
                    ? column.columnDef.header
                    : column.id}
                </DropdownMenuCheckboxItem>
              ))}

          </DropdownMenuContent>
        </DropdownMenu>

      </div>

      {/* Table */}

      <div className="overflow-hidden rounded-md border">

        <Table>

          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>

                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>

                    {header.isPlaceholder
                      ? null
                      : (
                        <table.FlexRender
                          header={header}
                        />
                      )}

                  </TableHead>
                ))}

              </TableRow>
            ))}
          </TableHeader>

          <TableBody>

            {table.getRowModel().rows?.length ? (

              table.getRowModel().rows.map((row) => (

                <TableRow
                  key={row.id}
                  data-state={
                    row.getIsSelected() &&
                    "selected"
                  }
                >

                  {row.getVisibleCells().map((cell) => (

                    <TableCell key={cell.id}>

                      <table.FlexRender
                        cell={cell}
                      />

                    </TableCell>

                  ))}

                </TableRow>

              ))

            ) : (

              <TableRow>

                <TableCell
                  colSpan={
                    table.getVisibleLeafColumns().length
                  }
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>

              </TableRow>

            )}

          </TableBody>

        </Table>

      </div>

      {/* Selected */}

      <div className="flex-1 py-4 text-sm text-muted-foreground">

        {table.getFilteredSelectedRowModel().rows.length}{" "}
        of{" "}
        {table.getFilteredRowModel().rows.length}{" "}
        row(s) selected.

      </div>

      {/* Pagination */}

      <div className="flex items-center justify-end space-x-2 py-4">

        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>

      </div>

    </div>
  )
}