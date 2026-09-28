"use client"

import { useState } from "react"
import { toast } from "sonner"

import { uploadMediaLibraryAction } from "@/lib/actions/media.actions"

interface MediaFieldProps {
  value?: string
  folder: string
  accept?: string
  onChange: (value: string) => void
  onUploadingChange?: (uploading: boolean) => void
}

export function MediaField({
  value,
  folder,
  accept = "image/*",
  onChange,
  onUploadingChange,
}: MediaFieldProps) {
  const [uploading, setUploading] = useState(false)

  // Preview local (blob:) chỉ dùng trong lúc đang upload
  const [localPreview, setLocalPreview] =
    useState<string | null>(null)

  async function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0]

    // Cho phép chọn lại cùng một file
    e.target.value = ""

    if (!file) return

    const blobUrl = URL.createObjectURL(file)

    setLocalPreview(blobUrl)
    setUploading(true)
    onUploadingChange?.(true)

    try {
      // File → Storage media/{folder}/{uuid}.{ext} → public URL
      const media = await uploadMediaLibraryAction(
        file,
        folder
      )

      // Chỉ URL thật mới được ghi vào form, không bao giờ là blob:
      onChange(media.url)
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Upload ảnh thất bại"
      )
    } finally {
      URL.revokeObjectURL(blobUrl)
      setLocalPreview(null)
      setUploading(false)
      onUploadingChange?.(false)
    }
  }

  const preview = localPreview ?? value

  return (
    <div className="space-y-3">
      <input
        type="file"
        accept={accept}
        disabled={uploading}
        onChange={handleChange}
      />

      {uploading && (
        <p className="text-sm text-muted-foreground">
          Đang upload...
        </p>
      )}

      {preview && (
        <img
          src={preview}
          alt=""
          className="h-32 w-32 rounded-lg object-cover"
        />
      )}
    </div>
  )
}
