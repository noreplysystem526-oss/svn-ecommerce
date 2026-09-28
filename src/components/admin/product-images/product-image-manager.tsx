"use client"

import {
  useEffect,
  useState,
} from "react"

import {
  saveProductImages,
  type ProductImageInput,
} from "@/lib/actions/product-image.actions"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { ProductImage } from "@/lib/resources/product-image.types"

// type ExistingProductImage = {
//   id: string
//   product_id: string
//   url: string
//   path: string
//   alt: string | null
//   sort_order: number
//   is_primary: boolean
//   created_at: string | null
// }

type ProductImageItem = {
  id?: string
  url: string
  path?: string
  alt: string
  sort_order: number
  is_primary: boolean

  /*
   * FRONTEND ONLY
   */
  isNew: boolean

  /*
   * Chỉ tồn tại với ảnh mới
   */
  file?: File
}

interface ProductImageManagerProps {
  productId: string
  initialImages: ProductImage[]
}

export function ProductImageManager({
  productId,
  initialImages,
}: ProductImageManagerProps) {
  const [images, setImages] =
    useState<ProductImageItem[]>([])

  const [saving, setSaving] =
    useState(false)

  /*
   * Convert DB data → frontend state
   */
  useEffect(() => {
    setImages(
      initialImages.map((image) => ({
        id: image.id,
        url: image.url,
        path: image.path,
        alt: image.alt ?? "",
        sort_order: image.sort_order,
        is_primary: image.is_primary,
        isNew: false,
      }))
    )
  }, [initialImages])

  /*
   * ----------------------------------------------
   * Chọn ảnh mới
   * ----------------------------------------------
   */
  function handleSelectFiles(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const files = Array.from(
      e.target.files ?? []
    )

    if (files.length === 0) {
      return
    }

    setImages((current) => {
      const startIndex =
        current.length

      const newImages =
        files.map(
          (file, index) => ({
            file,

            /*
             * Preview local.
             *
             * Chưa upload Storage.
             */
            url:
              URL.createObjectURL(
                file
              ),

            alt: "",

            sort_order:
              startIndex + index,

            /*
             * Nếu chưa có ảnh nào
             * thì ảnh đầu tiên làm primary.
             */
            is_primary:
              current.length === 0 &&
              index === 0,

            isNew: true,
          })
        )

      return [
        ...current,
        ...newImages,
      ]
    })

    /*
     * Cho phép chọn lại cùng một file
     */
    e.target.value = ""
  }

  /*
   * ----------------------------------------------
   * Chọn ảnh primary
   * ----------------------------------------------
   */
  function handleSetPrimary(
    index: number
  ) {
    setImages((current) =>
      current.map(
        (image, imageIndex) => ({
          ...image,
          is_primary:
            imageIndex === index,
        }))
    )
  }

  /*
   * ----------------------------------------------
   * Sửa alt
   * ----------------------------------------------
   */
  function handleAltChange(
    index: number,
    alt: string
  ) {
    setImages((current) =>
      current.map(
        (image, imageIndex) =>
          imageIndex === index
            ? {
                ...image,
                alt,
              }
            : image
      )
    )
  }

  /*
   * ----------------------------------------------
   * Xóa ảnh khỏi state
   * ----------------------------------------------
   *
   * Chưa xóa DB ngay.
   *
   * Save mới thực sự xóa.
   */
  function handleRemove(
    index: number
  ) {
    setImages((current) =>
      current
        .filter(
          (_, imageIndex) =>
            imageIndex !== index
        )
        .map(
          (image, newIndex) => ({
            ...image,
            sort_order:
              newIndex,
          })
        )
    )
  }

  /*
   * ----------------------------------------------
   * Save
   * ----------------------------------------------
   */
  async function handleSave() {
    if (saving) {
      return
    }

    /*
     * Normalize sort order
     */
    const normalizedImages =
      images.map(
        (image, index) => ({
          ...image,
          sort_order: index,
        })
      )

    /*
     * Kiểm tra primary
     */
    const primaryImages =
      normalizedImages.filter(
        (image) =>
          image.is_primary
      )

    if (
      normalizedImages.length > 0 &&
      primaryImages.length === 0
    ) {
      normalizedImages[0].is_primary =
        true
    }

    if (
      primaryImages.length > 1
    ) {
      alert(
        "Chỉ được chọn một ảnh chính"
      )
      return
    }

    setSaving(true)

    try {
      const payload: ProductImageInput[] =
        normalizedImages.map(
          (image) => ({
            id: image.id,
            file: image.file,
            url: image.url,
            path: image.path,
            alt: image.alt,
            sort_order:
              image.sort_order,
            is_primary:
              image.is_primary,
            isNew: image.isNew,
          })
        )

      await saveProductImages(
        productId,
        payload
      )

      /*
       * Sau khi save thành công,
       * reload lại page để lấy dữ liệu
       * chính thức từ DB.
       */
      window.location.reload()
    } catch (error) {
      console.error(
        "Save product images error:",
        error
      )

      alert(
        error instanceof Error
          ? error.message
          : "Không thể lưu ảnh"
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">
          Hình ảnh sản phẩm
        </h2>

        <p className="text-sm text-muted-foreground">Chọn ảnh, đặt ảnh chính,
          chỉnh alt và thứ tự trước
          khi lưu.
        </p>
      </div>
    
      <div>
        <Label
          htmlFor="product-images"
        >
          Thêm hình ảnh
        </Label>

        <Input
          id="product-images"
          type="file"
          accept="image/*"
          multiple
          className="mt-2"
          onChange={
            handleSelectFiles
          }
        />
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {images.map(
            (image, index) => (
              <div
                key={
                  image.id ??
                  `${image.url}-${index}`
                }
                className="space-y-3 rounded-lg border p-3"
              >
                <div className="aspect-square overflow-hidden rounded-md bg-muted">
                  <img
                    src={image.url}
                    alt={
                      image.alt ||
                      "Product image"
                    }
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    #{index + 1}
                  </span>

                  {image.is_primary && (
                    <span className="text-xs font-medium">
                      Ảnh chính
                    </span>
                  )}
                </div>

                <Input
                  value={image.alt}
                  placeholder="Alt text"
                  onChange={(e) =>
                    handleAltChange(
                      index,
                      e.target.value
                    )
                  }
                />

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={
                      image.is_primary
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    className="flex-1"
                    onClick={() =>
                      handleSetPrimary(
                        index
                      )
                    }
                  >
                    {image.is_primary
                      ? "Ảnh chính"
                      : "Đặt chính"}
                  </Button>

                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() =>
                      handleRemove(
                        index
                      )
                    }
                  >
                    Xóa
                  </Button>
                </div>
              </div>
            )
          )}
          </div>
      )}

      <Button
        type="button"
        onClick={handleSave}
        disabled={saving}
      >
        {saving
          ? "Đang lưu..."
          : "Lưu hình ảnh"}
      </Button>
    </div>
  )
}