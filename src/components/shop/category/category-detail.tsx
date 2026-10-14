// components/shop/product/product-detail.tsx

import Image from "next/image"

import type { Category, Product } from "@/types/database"
import { ProductSection } from "@/components/shop/product-section"
import { AddToCartButton } from "../carts/add-to-cart-button"

interface CategoryDetailProps {
  category: Category
  products: Product
}

export function CategoryDetail({
  category, products
}: CategoryDetailProps) {
    console.log("dt: ",products)

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="grid gap-10 md:grid-cols-2">
        <h1>
            {category.name}
        </h1>

        <h3>
            {category.description}
        </h3>
        {/* Gallery */}
        <ProductSection 
            featuredProducts={products}
        />

      </div>
    </div>
  )
}