import Link from "next/link"
import { Plus } from "lucide-react"
import { getProducts } from "@/lib/repository/product.repository";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ResourceTable } from "@/components/admin/resource-table/data-table";
import { ResourceConfig } from "@/lib/resources/types";
// import { columns, TData } from "@/components/admin/resource-table/columns";

interface ResourcePageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function ResourcePage({ 
  params, 
}: ResourcePageProps ) {
  const { slug } = await params
  const config = ResourceConfig[slug]
  if(!config){
    notFound()
  }
  let data = []
  switch (slug){
    case "products":
      data = await getProducts()
    case "orders":
      data = await getOrders()
    default:
      notFound()
  }
    
  // const res = await fetch("https://cppqtksyzoljynrijopa.supabase.co")
  // console.log(res)
  const data = await getProducts()

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="flex  items-center justify-between px-4 lg:px-6">
        <div className="">
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-muted-foreground">
            Manage your products
          </p>
        </div>

        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>
    <div className="px-4 lg:px-6">
      <Card>
        <CardHeader>
          <CardTitle>All Products</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">

            <ResourceTable config={config} data={data} />

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