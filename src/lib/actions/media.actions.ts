"use server"

import { createClient } from "@/lib/supabase/server"
import { getMediaDirectory } from "@/lib/repository/media.repository"

export interface UploadedMedia {
  url: string
  path: string
}

export async function uploadMedia(
  file: File,
  folder: string
): Promise<UploadedMedia> {
  if (!file.type.startsWith("image/")) {
    throw new Error("File phải là hình ảnh")
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Ảnh không được vượt quá 5MB")
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  console.log("USER:", user)

  const extension =
    file.name.split(".").pop()?.toLowerCase() ?? "jpg"

  const fileName =
    `${crypto.randomUUID()}.${extension}`

  const path = `${folder}/${fileName}`

  const { error } = await supabase.storage
    .from("media")
    .upload(path, file, {
      contentType: file.type,
      upsert: false,
    })

  if (error) {
    throw new Error(error.message)
  }

  const {
    data: { publicUrl },
  } = supabase.storage
    .from("media")
    .getPublicUrl(path)

  return {
    url: publicUrl,
    path,
  }
}

export async function uploadMediaLibraryAction(
  file: File,
  folder = "uploads"
) {
  const supabase = await createClient()
  const { 
    data: {user}
  } = await supabase.auth.getUser()

  if(!user){
    throw new Error("Bạn chưa đăng nhập")
  }
  const media = await uploadMedia(
    file, folder
  )
  return media
}

export async function getMediaLibrary(
  folder = ""
){
  return getMediaDirectory(folder)
}

export async function deleteMediaAction(path: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Bạn chưa đăng nhập")
  }

  const { error } = await supabase.storage
    .from("media")
    .remove([path])

  if (error) {
    throw new Error(error.message)
  }

  return {
    success: true,
    path,
  }
}