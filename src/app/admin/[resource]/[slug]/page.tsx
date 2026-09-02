import { notFound } from "next/navigation"
import { resourceConfig } from "@/lib/resources"
import { getProductBySlug } from "@/lib/repository/product.repository"
import { ResourceForm } from "@/components/admin/resource-form/resource-form"
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
  // Tạm thời product trước.
  // Sau này sẽ dynamic repository.
  if (resource !== "products") {
    notFound()
  }
  const item = await getProductBySlug(slug)
  if (!item) {
    notFound()
  }
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">
          Edit {config.singularLabel}
        </h1>
      </div>
      <ResourceForm
        resource={resource}
        config={config}
        mode="edit"
        initialData={item}
      />
    </div>
  )
}