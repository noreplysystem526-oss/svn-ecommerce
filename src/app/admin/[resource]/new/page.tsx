import { notFound } from "next/navigation"

import { resourceConfig } from "@/lib/resources"
import { ResourceForm } from "@/components/admin/resource-form/resource-form"

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

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-2xl font-semibold">
        Create {config.singularLabel}
      </h1>

      <ResourceForm
        resource={resource}
        config={config}
        mode="create"
      />
    </div>
  )
}