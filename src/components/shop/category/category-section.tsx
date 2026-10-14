import Link from "next/link"

import { Button } from "@/components/ui/button"

import { CategoryCard } from "./category-card"

import type { Category} from "@/types/database"

interface CategorySectionProps {
  featuredCategories: Category[]
}

export function CategorySection({
  featuredCategories,
}: CategorySectionProps) {
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
        {featuredCategories?.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
          />
        ))}
      </div>
    </section>
  )
}