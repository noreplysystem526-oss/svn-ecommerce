"use client"

import type {
  Row,
  ColumnDef,
} from "@tanstack/react-table"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { ResourceConfig,ResourceData } from "@/lib/resources/types"
import {
  features,
  type DataTableFeatures,
} from "@/components/admin/resource-table/data-table-features"
import Link from "next/link";
import { Button } from "@/components/ui/button"
import Image from "next/image"


export function createColumns<
  TData extends ResourceData
>(
  config: ResourceConfig,
  resource: string,
  onDelete: (id: string) => void
): ColumnDef< DataTableFeatures, TData>[] {

  return [

    ...config.fields.map((field) => (
    {
      accessorKey: field.name,
      header: field.label,
      cell: ({ row }: { row: Row<DataTableFeatures,TData> }) => {
        const value = row.getValue(field.name)

        if (value === null || value === undefined) {
          return "-"
        }

        if ( field.name === "name" ){
          return (
            <Link href={`/admin/${resource}/${row.original.slug}`} className="hover:underline">
              {String(value)}
            </Link>
          )
        }

        switch (field.type) {
          case "number":
            return typeof value === "number"
              ? value.toLocaleString("vi-VN")
              : String(value)

          case "boolean":
            return value ? "Yes" : "No"

          case "media":
              if(!value){
                return "-"
              }

              
              if(typeof value === "object"){
                const media = value as {
                url: string
                alt: string
              }

                return (
                  <Image 
                    src={media?.url}
                    alt={media?.alt}
                    width={40}
                    height={40}
                    priority
                  />
                )
              }else{
                return (
                  <Image 
                    src={String(value)}
                    alt={field.name}
                    width={40}
                    height={40}
                    priority
                  />
                ) 
              }
             


          case "relation":

            const relation = row.original[field.relation!.displayField]
            
            if(relation === "product_image"){
              const url = String(row.original["image"])
              return url
              
            }
            if(!relation || typeof relation !== "object"){
              return "-"
            }
            return String(
              (relation as Record<string, unknown>)[field.relation!.labelField]
              ?? "-"
            )

          default:
            return String(value)
        }
      },
    }
)
    ),
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const id = String(row.original.id)
        return (
            <Dialog>
                <DialogTrigger asChild>
                  <Button className="text-red-600 hover:underline" variant="outline"
                  >Delete</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-sm">
                  
                  <DialogHeader>
                    <DialogDescription>
                      Are you sure you want to delete item {row.original.name}?
                    </DialogDescription>
                  </DialogHeader>

                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={() => onDelete(id)}>Delete</Button>
                  </DialogFooter>
                </DialogContent>
            </Dialog>
        )
      }
    }
  ]
  
  
  
}