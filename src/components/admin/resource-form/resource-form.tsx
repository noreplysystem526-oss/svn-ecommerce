"use client"

import type { ResourceConfig } from "@/lib/resources/types"

interface ResourceFormProps {
  resource: string
  config: ResourceConfig
  mode: "create" | "edit"
  initialData?: Record<string, unknown>
}

export function ResourceForm({
  resource,
  config,
  mode,
  initialData,
}: ResourceFormProps) {
  return (
    <div className="space-y-6">
      <div>
        Resource: {resource}
      </div>

      <div>
        Mode: {mode}
      </div>

      <div>
        Fields: {config.fields.length}
      </div>

      <pre className="rounded-lg bg-muted p-4 text-sm">
        {JSON.stringify(initialData, null, 2)}
      </pre>
    </div>
  )
}