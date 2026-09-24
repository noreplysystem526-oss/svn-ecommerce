"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import {
  Folder,
  Trash2,
} from "lucide-react"
import { toast } from "sonner"

import {
  deleteMediaAction,
} from "@/lib/actions/media.actions"

import { MediaUpload } from "./media-upload"

import type {
  MediaFile,
  MediaFolder,
} from "@/lib/repository/media.repository"

interface MediaLibraryProps {
  folder: string
  folders: MediaFolder[]
  files: MediaFile[]
}

export function MediaLibrary({
  folder,
  folders,
  files: initialFiles,
}: MediaLibraryProps) {
  const [files, setFiles] = useState(initialFiles)
  const [deletingPath, setDeletingPath] =
    useState<string | null>(null)

    console.log("FILE: ",files)
    useEffect(() => {
        setFiles(initialFiles)
    },[initialFiles])

  async function handleDelete(file: MediaFile) {
    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa "${file.name}"?`
    )

    if (!confirmed) return

    try {
      setDeletingPath(file.path)

      await deleteMediaAction(file.path)

      setFiles((prev) =>
        prev.filter(
          (item) => item.path !== file.path
        )
      )

      toast.success("Đã xóa media")
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Xóa media thất bại"
      )
    } finally {
      setDeletingPath(null)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="mb-2 text-sm text-muted-foreground">
            <Link
              href="/admin/media-library"
              className="hover:text-foreground"
            >
              Media Library
            </Link>

            {folder
              .split("/")
              .filter(Boolean)
              .map((part, index, parts) => {
                const path = parts
                  .slice(0, index + 1)
                  .join("/")

                return (
                  <span key={path}>
                    {" / "}

                    <Link
                      href={`/admin/media-library?folder=${encodeURIComponent(path)}`}
                      className="hover:text-foreground"
                    >
                      {part}
                    </Link>
                  </span>
                )
              })}
          </div>

          <h1 className="text-2xl font-semibold">
            {folder || "Media Library"}
          </h1>
        </div>

        <MediaUpload
          folder={folder}
          onUploaded={(media) => {
            const fileName =
              media.path.split("/").pop() ?? ""

            setFiles((prev) => [
              {
                name: fileName,
                path: media.path,
                url: media.url,
                id: null,
                created_at:
                  new Date().toISOString(),
                updated_at:
                  new Date().toISOString(),
                metadata: null,
              },
              ...prev,
            ])
            }}
        />
      </div>

      {/* Folders */}
      {folders.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-semibold">
            Folders
          </h2>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {folders.map((item) => (
              <Link
                key={item.path}
                href={`/admin/media-library?folder=${encodeURIComponent(item.path)}`}
                className="flex items-center gap-3 rounded-lg border p-4 transition hover:bg-muted"
              >
                <Folder className="h-8 w-8" />

                <span className="truncate font-medium">
                  {item.name}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Files */}
      {files.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-semibold">
            Files
          </h2>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {files.map((file) => (
              <div
                key={file.path}
                className="overflow-hidden rounded-lg border"
              >
                <div className="aspect-square bg-muted">
                  <img
                    src={file.url}
                    alt={file.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="p-3">
                  <p
                    className="truncate text-sm"
                    title={file.name}
                  >
                    {file.name}
                  </p>

                  <button
                    type="button"
                    disabled={
                      deletingPath === file.path
                    }
                    onClick={() =>
                      handleDelete(file)
                    }
                    className="mt-2 text-sm text-destructive disabled:opacity-50"
                  >
                    <Trash2 className="mr-1 inline h-4 w-4" />

                    {deletingPath === file.path
                      ? "Đang xóa..."
                      : "Xóa"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Empty */}
      {folders.length === 0 &&
        files.length === 0 && (
          <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
            Folder trống
          </div>
        )}
    </div>
  )
}