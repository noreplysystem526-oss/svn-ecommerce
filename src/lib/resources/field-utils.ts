import type { FieldView, ResourceField } from "./types"

export function isFieldVisible(
  field: ResourceField,
  view: FieldView
): boolean {
    if(field.showIn === undefined){
        return true
    }
    if(field.showIn.includes(view)){
        return true
    }else return false
}

// Folder trong bucket "media": ưu tiên config, mặc định là tên resource
export function getMediaFolder(
  field: ResourceField,
  resource: string
): string {
    return field.media?.folder ?? resource
}