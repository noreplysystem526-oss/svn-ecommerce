"use server"

import { createClient } from "@/lib/supabase/server"
import { uploadMedia } from "./media.actions"

import {
  createProductImage,
  updateProductImage,
  getProductImageById,
  deleteProductImage,
} from "@/lib/repository/product-images.repository"

/**
 * Dữ liệu ProductImage từ frontend gửi lên.
 *
 * isNew KHÔNG phải database field.
 * Nó chỉ tồn tại ở frontend để phân biệt
 * ảnh mới và ảnh đã có trong database.
 */
export type ProductImageInput = {
  id?: string

  // Chỉ có đối với ảnh mới
  file?: File

  // Có đối với ảnh cũ
  url?: string
  path?: string

  // Database fields
  alt: string
  sort_order: number
  is_primary: boolean

  // Frontend only
  isNew: boolean
}

/**
 * Upload một product image.
 *
 * Flow:
 *
 * File
 *   ↓
 * Storage
 *   ↓
 * product_images
 */
export async function uploadProductImage(
  productId: string,
  file: File
) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Bạn chưa đăng nhập")
  }

  const media = await uploadMedia(
    file,
    "products"
  )

  const image = await createProductImage({
    productId,
    url: media.url,
    path: media.path,
  })

  return image
}

/**
 * Update metadata của ảnh đã tồn tại.
 *
 * Không upload lại file.
 * Chỉ update:
 *
 * - alt
 * - sort_order
 * - is_primary
 */
export async function updateProductImageAction(
  imageId: string,
  data: {
    alt: string
    sort_order: number
    is_primary: boolean
  }
) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Bạn chưa đăng nhập")
  }

  return updateProductImage(
    imageId,
    data
  )
}

/**
 * Xóa product image.
 *
 * Flow:
 *
 * product_images
 *      ↓
 * lấy path
 *      ↓
 * Storage.remove()
 *      ↓
 * delete DB record
 */
export async function deleteProductImageAction(
  imageId: string
) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Bạn chưa đăng nhập")
  }

  const image =
    await getProductImageById(imageId)

  if (!image) {
    throw new Error("Không tìm thấy ảnh")
  }

  if (image.path) {
    const { error: storageError } =
      await supabase.storage
        .from("media")
        .remove([image.path])

    if (storageError) {
      throw new Error(
        storageError.message
      )
    }
  }

  await deleteProductImage(imageId)

  return {
    success: true,
  }
}

/**
 * Lưu toàn bộ danh sách ảnh của product.
 *
 * Đây là action chính cho ProductImageManager.
 *
 * Nó xử lý:
 *
 * 1. Ảnh bị xóa
 * 2. Ảnh mới
 * 3. Ảnh cũ bị thay đổi metadata
 */
export async function saveProductImages(
  productId: string,
  images: ProductImageInput[]
) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Bạn chưa đăng nhập")
  }

  /*
   * ------------------------------------------------
   * 1. Validate primary
   * ------------------------------------------------
   *
   * Chỉ cho phép tối đa 1 ảnh primary.
   */

  const primaryCount = images.filter(
    (image) => image.is_primary
  ).length

  if (primaryCount > 1) {
    throw new Error(
      "Chỉ được chọn một ảnh chính"
    )
  }

  /*
   * ------------------------------------------------
   * 2. Lấy ảnh hiện tại trong DB
   * ------------------------------------------------
   */

  const {
    data: existingImages,
    error: existingError,
  } = await supabase
    .from("product_images")
    .select(`
      id,
      path
    `)
    .eq("product_id", productId)

  if (existingError) {
    throw new Error(
      existingError.message
    )
  }

  /*
   * ------------------------------------------------
   * 3. Xác định ảnh bị xóa
   * ------------------------------------------------
   *
   * Ví dụ DB có:
   *
   * A
   * B
   * C
   *
   * Frontend sau khi user xóa B:
   *
   * A
   * C
   *
   * currentIds = [A, C]
   *
   * => B nằm trong deletedImages
   */

  const currentIds = new Set(
    images
      .filter((image) => image.id)
      .map((image) => image.id!)
  )

  const deletedImages =
    existingImages?.filter(
      (image) =>
        !currentIds.has(image.id)
    ) ?? []

  /*
   * ------------------------------------------------
   * 4. Xóa ảnh khỏi Storage + DB
   * ------------------------------------------------
   */

  for (const image of deletedImages) {
    if (image.path) {
      const { error } =
        await supabase.storage
          .from("media")
          .remove([image.path])

      if (error) {
        throw new Error(
          error.message
        )
      }
    }

    await deleteProductImage(
      image.id
    )
  }

  /*
   * ------------------------------------------------
   * 5. Xử lý ảnh hiện tại
   * ------------------------------------------------
   */

  for (const image of images) {

    /*
     * ----------------------------------------------
     * 5A. ẢNH MỚI
     * ----------------------------------------------
     *
     * isNew = true
     *
     * file
     *  ↓
     * Storage
     *  ↓
     * product_images
     */

    if (
      image.isNew &&
      image.file
    ) {
      const media =
        await uploadMedia(
          image.file,
          "products"
        )

      await createProductImage({
        productId,
        url: media.url,
        path: media.path,
        alt: image.alt,
        sortOrder:
          image.sort_order,
        isPrimary:
          image.is_primary,
      })

      continue
    }

    /*
     * ----------------------------------------------
     * 5B. ẢNH CŨ
     * * ----------------------------------------------
     *
     * Có id
     * isNew = false
     *
     * Không upload lại.
     *
     * Chỉ update metadata.
     */

    if (
      image.id &&
      !image.isNew
    ) {
      await updateProductImage(
        image.id,
        {
          alt: image.alt,
          sort_order:
            image.sort_order,
          is_primary:
            image.is_primary,
        }
      )
    }
  }

  return {
    success: true,
  }
}