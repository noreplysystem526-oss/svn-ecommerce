import Link from "next/link"

import { Button } from "@/components/ui/button"

import { ProductCard } from "./product-card"

import type { Product } from "@/types/database"

interface ProductSectionProps {
  featuredProducts: Product[]
}

export function ProductSection({
  featuredProducts,
}: ProductSectionProps) {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            Featured
          </p>

          <h2 className="mt-1 text-3xl font-bold">
            Featured Products
          </h2>
        </div>

        <Button
          variant="ghost"
          asChild
        >
          <Link href="/products">
            View all
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {featuredProducts?.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </section>
  )
}