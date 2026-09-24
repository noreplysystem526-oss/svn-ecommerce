import {
  getMediaDirectory,
} from "@/lib/repository/media.repository"

import { MediaLibrary } from "@/components/admin/media-library/media-library"

interface PageProps {
  searchParams: Promise<{
    folder?: string
  }>
}

export default async function MediaLibraryPage({
  searchParams,
}: PageProps) {
  const { folder = "" } = await searchParams

  const directory = await getMediaDirectory(folder)

  return (
    <div className="container mx-auto p-6">
      <MediaLibrary
        folder={folder}
        folders={directory.folders}
        files={directory.files}
      />
    </div>
  )
}