import Link from "next/link"
import { Plus, Pencil } from "lucide-react"

import { getProducts } from "@/lib/repository/product";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable } from "@/components/admin/data-table";

export default async function ProductsPage() {
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
            {/* <table className="w-full">
              <thead>
                <tr className="border-b text-left">
                  <th className="p-3">Product</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Stock</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product as any) => (
                  <tr
                    key={product.id}
                    className="border-b"
                  >
                    <td className="p-3">
                      <div className="font-medium">
                        {product.name}
                      </div>

                      <div className="text-sm text-muted-foreground">
                        {product.sku}
                      </div>
                    </td>

                    <td className="p-3">
                      {product.category?.name ?? "-"}
                    </td>

                    <td className="p-3">
                      {product.price.toLocaleString("vi-VN")} ₫
                    </td>

                    <td className="p-3">
                      {product.stock}
                    </td>

                    <td className="p-3 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                      >
                        <Link
                          href={`/admin/products/${product.id}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table> */}
            <DataTable data={data} />

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