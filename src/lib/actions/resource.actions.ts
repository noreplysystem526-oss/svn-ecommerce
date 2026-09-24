"use server"

import { revalidatePath } from "next/cache"

import { updateResource, createResource, deleteResource } from "@/lib/resources"

/**
 * Sau khi ghi DB phải revalidate, nếu không list page và detail page
 * (Server Component) vẫn trả về dữ liệu cũ trong cache -> nhìn như "không lưu được".
 */
function revalidateResource(resource: string) {
  revalidatePath(`/admin/${resource}`)
  revalidatePath(`/admin/${resource}/[slug]`, "page")
}

export async function updateResourceAction(
  resource: string,
  id: string,
  data: Record<string, unknown>
) {
  const result = await updateResource(resource, id, data)
  revalidateResource(resource)
  return result
}

export async function createResourceAction(
  resource: string,
  data: Record<string, unknown>
) {
  const result = await createResource(resource, data)
  revalidateResource(resource)
  return result
}

export async function deleteResourceAction(
  resource: string,
  id: string
) {
  const result = await deleteResource(resource, id)
  revalidateResource(resource)
  return result
}
