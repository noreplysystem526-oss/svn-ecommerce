import { createClient } from "@/lib/supabase/server"

export interface MediaFolder {
  name: string
  path: string
}

export interface MediaFile {
  name: string
  path: string
  url: string
  id: string | null
  created_at: string | null
  updated_at: string | null
  metadata: Record<string, unknown> | null
}

export interface MediaDirectory {
  folders: MediaFolder[]
  files: MediaFile[]
}

export async function getMediaDirectory(
  folder = ""
): Promise<MediaDirectory> {
  const supabase = await createClient()

  const { data, error } = await supabase.storage
    .from("media")
    .list(folder, {
      limit: 100,
      sortBy: {
        column: "name",
        order: "asc",
      },
    })

  if (error) {
    throw new Error(error.message)
  }
    
  console.log("FOLDER: ",folder)
  console.log("STORAGE DATA: ", data) 

  const folders: MediaFolder[] = []
  const files: MediaFile[] = []

  for (const item of data ?? []) {
    const path = folder
      ? `${folder}/${item.name}`
      : item.name

    // Folder
    if (item.id === null) {
      folders.push({
        name: item.name,
        path,
      })

      continue
    }

    // File
    const { data: publicUrlData } = supabase.storage
      .from("media")
      .getPublicUrl(path)

    files.push({
      name: item.name,
      path,
      url: publicUrlData.publicUrl,
      id: item.id ?? null,
      created_at: item.created_at ?? null,
      updated_at: item.updated_at ?? null,
      metadata: item.metadata ?? null,
    })
  }

  return {
    folders,
    files,
  }
}