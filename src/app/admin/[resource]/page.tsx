import Link from "next/link"
import { Plus } from "lucide-react"
import { getProducts } from "@/lib/repository/product.repository";
import { getOrders } from "@/lib/repository/order.repository";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ResourceTable } from "@/components/admin/resource-table/data-table";
import { resourceConfig } from "@/lib/resources"; 
import { ResourceRepositories } from "@/lib/resources/repositories";
import { notFound } from "next/navigation";
// import { columns, TData } from "@/components/admin/resource-table/columns";

interface ResourcePageProps {
  params: Promise<{
    resource: string
  }>
}

export default async function ResourcePage({ 
  params, 
}: ResourcePageProps ) {
  const { resource } = await params
  const config = resourceConfig[resource as keyof typeof resourceConfig]
  const repositories = ResourceRepositories[resource as keyof typeof ResourceRepositories]
  if(!config || !repositories){
    notFound()
  }
  const data = await repositories.getAll();
  console.log("data", data)
  
    
  // const res = await fetch("https://cppqtksyzoljynrijopa.supabase.co")
  // console.log(res)
  // const data = await getProducts()

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="flex  items-center justify-between px-4 lg:px-6">
        <div className="">
          <h1 className="text-2xl font-bold">{config.title}</h1>
          <p className="text-muted-foreground">
            Manage your {config.title} here. You can add, edit, and delete {config.title.toLowerCase()} as needed.
          </p>
        </div>

        <Button asChild>
          <Link href={`/admin/${resource}/new`}>
            <Plus className="mr-2 h-4 w-4" />
            Add {config.title}
          </Link>
        </Button>
      </div>
    <div className="px-4 lg:px-6">
      <Card>
        <CardHeader>
          <CardTitle>All {config.title}</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">

            <ResourceTable config={config} data={data} resource={resource} />

            {data.length === 0 && (
              <div className="py-10 text-center text-muted-foreground">
                No products found.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
     </div> 
    </div>
  )
}