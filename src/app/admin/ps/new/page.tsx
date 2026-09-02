import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ProductForm } from "../components/product-form"

export default function NewProductPage() {
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
            Add Product
          </h1>

          <p className="text-muted-foreground">
            Create a new product
          </p>
        </div>
      </div>
      <div className="px-4">
        <ProductForm />
      
      </div>

      
    </div>
  )
}