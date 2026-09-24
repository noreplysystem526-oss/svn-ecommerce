import { notFound } from "next/navigation"

import {
  resourceConfig,
  getResourceBySlug,
} from "@/lib/resources"

import {
  ResourceFormContainer,
} from "@/components/admin/resource-form/resource-form-container"

import {
  getProductImages,
} from "@/lib/repository/product-images.repository"

import {
  ProductImageUpload,
} from "@/components/admin/product-images/product-image-upload"

import type { ProductImage } from "@/lib/resources/product-image.types"

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

  const item = await getResourceBySlug(
    resource,
    slug
  )

  if (!item) {
    notFound()
  }

  let productImages: ProductImage[] = []

  if (resource === "products") {
    productImages = await getProductImages(
      String(item.id)
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">
          Edit {config.singularLabel}
        </h1>
      </div>

      <div className="space-y-8">
        <ResourceFormContainer
          resource={resource}
          config={config}
          mode="edit"
          initialData={item}
        />

        {resource === "products" && (
          <ProductImageUpload
            productId={String(item.id)}
            initialImages={productImages}
          />
        )}
      </div>
    </div>
  )
}