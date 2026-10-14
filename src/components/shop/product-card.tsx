import Image from "next/image"
import Link from "next/link"

import {
  Card,
  CardContent,
} from "@/components/ui/card"

import type { Product } from "@/types/database"

interface ProductCardProps {
  product: Product
}

export function ProductCard({
  product,
}: ProductCardProps) {
  
  const image =
    product.product_images?.find(
      (item) => item.is_primary
    ) ??
    product.product_images?.[0]

  return (
    <Card className="group overflow-hidden border-0 shadow-100 transition-shadow hover:shadow-2xl">
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden rounded-xl bg-white">
          {image ? (
            <Image
              src={image.url}
              alt={image.alt ?? product.name}
              fill
              className="object-cover transition-transform duration-300  w-80 px-5"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              No image
            </div>
          )}
        </div>

        <CardContent className="px-3 pt-4 ">
          <h3 className="font-medium">
            {product.name}
          </h3>

          <p className="mt-1 font-semibold">
            {product.price.toLocaleString("vi-VN")} ₫
          </p>
        </CardContent>
      </Link>
    </Card>
  )
}