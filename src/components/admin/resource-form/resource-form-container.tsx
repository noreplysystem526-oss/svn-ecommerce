import { getRelationOptions } from "@/lib/resources"
import { ResourceForm } from "./resource-form"
import type { ResourceConfig } from "@/lib/resources/types"

interface ResourceFormContainerProps {
  resource: string
  config: ResourceConfig
  mode: "create" | "edit"
  initialData?: Record<string, unknown>
}

export async function ResourceFormContainer({
  resource,
  config,
  mode,
  initialData,
}: ResourceFormContainerProps) {

  const relationOptions: Record<
    string,
    { value: string; label: string }[]
  > = {}

  for (const field of config.fields) {
    if (
      field.type === "relation" &&
      field.relation
    ) {
      relationOptions[field.name] =
        await getRelationOptions(
          field.relation.resource
        )
    }
  }

  return (
    <ResourceForm
      resource={resource}
      config={config}
      mode={mode}
      initialData={initialData}
      relationOptions={relationOptions}
    />
  )
}