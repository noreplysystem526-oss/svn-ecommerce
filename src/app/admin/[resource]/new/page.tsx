import { notFound } from "next/navigation"

import { resourceConfig } from "@/lib/resources"
import { ResourceForm } from "@/components/admin/resource-form/resource-form"
import { getCategoriesForSelect, getBrandsForSelect } from "@/lib/repository"

interface PageProps {
  params: Promise<{
    resource: string
  }>
}

export default async function NewResourcePage({
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


  const categories = await getCategoriesForSelect()
  const brands = await getBrandsForSelect()
  const relationOptions = {
    category_id: categories.map((category) => ({
      value: category.id,
      label: category.name
    })),

    brand_id: brands.map((brand) => ({
      value: brand.id,
      label: brand.name
    }))
  }


  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-2xl font-semibold">
        Create {config.singularLabel}
      </h1>

      <ResourceForm
        resource={resource}
        config={config}
        mode="create"
        relationOptions={relationOptions}
      />
    </div>
  )
}