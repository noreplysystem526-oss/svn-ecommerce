"use client"

import { useRef, useState } from "react"
import { Upload } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  uploadMediaLibraryAction,
} from "@/lib/actions/media.actions"

interface MediaUploadProps {
  folder: string
  onUploaded?: (media: {
    url: string
    path: string
  }) => void
}

export function MediaUpload({
  folder,
  onUploaded,
}: MediaUploadProps) {
  const inputRef =
    useRef<HTMLInputElement>(null)

  const [isUploading, setIsUploading] =
    useState(false)

  async function handleUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0]

    if (!file) return

    try {
      setIsUploading(true)

      const media =
        await uploadMediaLibraryAction(
          file,
          folder
        )

      onUploaded?.(media)

      toast.success("Upload thành công")
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Upload thất bại"
      )
    } finally {
      setIsUploading(false)

      if (inputRef.current) {
        inputRef.current.value = ""
      }
    }
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleUpload}
      />

      <Button
        type="button"
        disabled={isUploading}
        onClick={() =>
          inputRef.current?.click()
        }
      >
        <Upload className="mr-2 h-4 w-4" />

        {isUploading
          ? "Đang upload..."
          : "Upload media"}
      </Button>
    </>
  )
}