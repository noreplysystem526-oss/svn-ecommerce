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

}

export interface ResourceConfig {
    title: string
    singularLabel: string
    fields: ResourceField[]
}

export type ResourceData = {
  id: string | number
}