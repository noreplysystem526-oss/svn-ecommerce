import { notFound } from "next/navigation"
import { ProductSection } from "@/components/shop/product-section"
import { CategorySection } from "@/components/shop/category/category-section"
import { resourceConfig } from "@/lib/resources"
import { getFeatureProducts } from "@/lib/repository/product.repository"
import { getFeatureCategories } from "@/lib/repository/category.repository"


interface PageProps {
  params: Promise<{
    resource: string
  }>
}

export default async function ResourcePage({
  params,
}: PageProps) {
  const { resource } = await params

  const config =
    resourceConfig[
      resource as keyof typeof resourceConfig
    ]

  if (!config) {
    notFound()
  }

  switch(resource){
    case "products":
      const featuredProducts = await getFeatureProducts()
      return (
      <>
        <ProductSection
            featuredProducts={featuredProducts}
        />
      </>
      )
    case "categories":
      const featuredCategories = await getFeatureCategories()
      return (
      <>
        <CategorySection
            featuredCategories={featuredCategories}
        />
      </>
      )
    default:
      notFound()           
  }

}