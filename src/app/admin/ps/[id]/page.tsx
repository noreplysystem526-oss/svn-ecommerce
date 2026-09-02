import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { getProductById } from "@/lib/repository/product.repository"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface ProductPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { id } = await params

  const product = await getProductById(id)

  return (
    <div className="space-y-6 py-4">
      <div className="flex items-center gap-4 px-4">
        <Button
          variant="ghost"
          size="icon"
          asChild
        >
          <Link href="/admin/products">
            <ArrowLeft />
          </Link>
        </Button>

        <div>
          <h1 className="text-2xl font-bold">
            {product.name}
          </h1>

          <p className="text-muted-foreground">
            Product details
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 px-4">
        <Card>
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">
                Name
              </p>

              <p className="font-medium">
                {product.name}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Slug
              </p>

              <p>{product.slug}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Category
              </p>

              <p>
                {product.category?.name ?? "-"}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Description
              </p>

              <p>
                {product.description || "-"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inventory</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">
                Price
              </p>

              <p className="text-xl font-bold">
                {product.price.toLocaleString("vi-VN")} ₫
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Stock
              </p>

              <p>{product.stock}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                SKU
              </p>

              <p>{product.sku || "-"}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}