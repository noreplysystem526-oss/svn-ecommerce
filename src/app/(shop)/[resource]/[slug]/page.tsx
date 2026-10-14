import { notFound } from "next/navigation"

import {
  resourceConfig,
} from "@/lib/resources"

import {
  getProductBySlug,
  getProductByCategorySlug 
} from "@/lib/repository/product.repository"
import {
  getCategoryBySlug,
} from "@/lib/repository/category.repository"

import {
  ProductDetail,
} from "@/components/shop/product/product-detail"
import {
  CategoryDetail,
} from "@/components/shop/category/category-detail"
import { getFeatureCategories } from "@/lib/repository/category.repository"


interface PageProps {
  params: Promise<{
    resource: string
    slug: string
  }>
}

export default async function ResourceDetailPage({
  params,
}: PageProps) {
  const { resource, slug } = await params

  const config =
    resourceConfig[
      resource as keyof typeof resourceConfig
    ]

  if (!config) {
    notFound()
  }

  switch(resource){
    case "products":
      const product =
        await getProductBySlug(slug)

      if (!product) {
        notFound()
      }

      return (
        <ProductDetail product={product} />
      )
    case "categories":
      const category =
        await getCategoryBySlug(slug)

      if (!category) {
        notFound()
      }

      const products = await getProductByCategorySlug(category.slug)
      console.log("pd: ",products)
      return (
        <CategoryDetail 
          category={category} 
          products={products}
        />

      )
  }
}