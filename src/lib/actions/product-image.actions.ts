"use server"

import { createClient } from "@/lib/supabase/server"
import { uploadMedia } from "./media.actions"

import {
  createProductImage,
  getProductImageById,
  deleteProductImage,
} from "@/lib/repository/product-images.repository"

export async function uploadProductImage(
  productId: string,
  file: File
) {
  console.log("1. START UPLOAD")

  const media = await uploadMedia(
    file,
    "products"
  )

  console.log("2. UPLOADED STORAGE", media)

  const image = await createProductImage({
    productId,
    url: media.url,
    path: media.path,
  })

  console.log("3. INSERTED PRODUCT IMAGE", image)

  return image
}

export async function deleteProductImageAction(
  imageId: string
) {
  console.log("1. START DELETE", imageId)

  // Lấy image để biết path trong Storage
  const image = await getProductImageById(imageId)
  console.log("Đường dẫn xóa file: ", image.path)

  if (!image) {
    throw new Error("Không tìm thấy ảnh")
  }

  // Xóa file Storage
  const supabase = await createClient()

  const { error: storageError } = await supabase.storage
    .from("media")
    .remove([image.path])

  if (storageError) {
    throw new Error(storageError.message)
  }

  // Xóa record DB
  await deleteProductImage(imageId)

  console.log("4. DELETE SUCCESS")

  return {
    success: true,
  }
}