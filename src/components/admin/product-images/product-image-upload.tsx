"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  uploadProductImage,
} from "@/lib/actions/product-image.actions"

import type {
  ProductImage,
} from "@/lib/resources/product-image.types"

import { deleteProductImageAction } from "@/lib/actions/product-image.actions"

interface ProductImageUploadProps {
  productId: string
  initialImages: ProductImage[]
}
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function ProductImageUpload({
  productId,
  initialImages,
}: ProductImageUploadProps) {
  const [imageDelete, setImageDelete] = useState<string | null>(null)

  const [images, setImages] =
    useState<ProductImage[]>(initialImages)

  const [uploading, setUploading] =
    useState(false)

  async function handleUpload(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0]

    if (!file) {
      return
    }

    try {
      setUploading(true)

      const image =
        await uploadProductImage(
          productId,
          file
        )

      setImages((prev) => [
        ...prev,
        image,
      ])

      toast.success("Upload ảnh thành công")
    } catch (error) {
      console.error(error)

      toast.error(
        error instanceof Error
          ? error.message
          : "Upload ảnh thất bại"
      )
    } finally {
      setUploading(false)

      e.target.value = ""
    }
  }

async function handleDelete(imageId: string) {
  try {
    await deleteProductImageAction(imageId)

    setImages((prev) =>
      prev.filter((image) => image.id !== imageId)
    )

    toast.success("Đã xóa ảnh")
  } catch (error) {
    toast.error(
      error instanceof Error
        ? error.message
        : "Xóa ảnh thất bại"
    )
  }
}

  return (
    <div className="space-y-4 rounded-lg border p-6">
      <div>
        <h2 className="font-semibold">
          Hình ảnh sản phẩm
        </h2>

        <p className="text-sm text-muted-foreground">
          Upload hình ảnh cho sản phẩm
        </p>
      </div>

      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        disabled={uploading}
      />

      {uploading && (
        <p className="text-sm text-muted-foreground">
          Đang upload...
        </p>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="relative overflow-hidden rounded-lg border"
            >
              <img
                src={image.url}
                alt=""
                className="aspect-square w-full object-cover"
              />

              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute right-2 top-2"
                onClick={() => setImageDelete(image.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

            <Dialog
              open={imageDelete !== null}
              onOpenChange={(open) => {
                if (!open) setImageDelete(null);
              }}
            >
                <DialogContent className="sm:max-w-sm">
                  <DialogHeader>
                    <DialogDescription>
                      Are you sure you want to delete this item?
                    </DialogDescription>
                  </DialogHeader>

                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={() => {
                      if(imageDelete){
                        handleDelete(imageDelete)
                        setImageDelete(null)
                      }
                    }}>Delete</Button>
                  </DialogFooter>
                </DialogContent>
            </Dialog>
    </div>
  )
}