export type FieldType = 
| "text"
| "number"
| "select"
| "media"
| "relation"
| "rich_text"
| "boolean"

export interface ResourceOptions{
    label:string
    value:string
}

export interface ResourceField {
    name: string
    label: string
    type: FieldType
    required?: boolean
    options?: ResourceOptions[]
    relation?: {
        resource: string
        labelField: string
        valueField: string
        displayField: string
    }
    media?: {
        accept: string
        maxSize?: number
    }
}

export interface ResourceConfig {
    title: string
    singularLabel: string
    fields: ResourceField[]
}

export type ResourceData = {
  id: string | number
  name: string
  slug?: string
  [key: string]: unknown
}