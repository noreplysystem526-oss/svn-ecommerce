import Image from "next/image"
import Link from "next/link"

import {
  Card,
  CardContent,
} from "@/components/ui/card"

import type { Category } from "@/types/database"

interface CategoryCardProps {
  category: Category
}

export function CategoryCard({
  category,
}: CategoryCardProps) {

  return (
    <Card className="group overflow-hidden border-0 shadow-100 transition-shadow hover:shadow-2xl">
      <Link href={`/categories/${category.slug}`}>
        <div className="relative aspect-square overflow-hidden rounded-xl bg-white">
          {category.image_url ? (
            <Image
              src={category.image_url}
              alt={category.name}
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
            {category.name}
          </h3>

          <div dangerouslySetInnerHTML={{ __html: category.description ?? "" }} className="mt-1 font-semibold">
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}