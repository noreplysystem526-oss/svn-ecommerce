// import { createClient } from "@/lib/supabase/server"

// export async function getProductImages(
//   productId: string
// ) {
//   const supabase = await createClient()

//   const { data, error } = await supabase
//     .from("product_images")
//     .select(`
//         id,
//         product_id,
//         url,
//         path,
//         alt,
//         sort_order,
//         is_primary
//         created_at
//       `)
//     .eq("product_id", productId)
//     .order("sort_order", {
//       ascending: true,
//     })

//   if (error) {
//     throw new Error(error.message)
//   }

//   return data
// }

// export async function getProductImageById(id: string) {
//   const supabase = await createClient()

//   const { data, error } = await supabase
//     .from("product_images")
//     .select(`
//     id,
//     product_id,
//     url,
//     path,
//     alt,
//     sort_order,
//     is_primary
//     created_at
//   `)
//     .eq("id", id)
//     .single()

//   if (error) {
//     throw new Error(error.message)
//   }

//   return data
// }

// export async function createProductImage(data: {
//   productId: string
//   url: string
//   path: string
//   alt?: string
//   sortOrder: number
//   isPrimary: boolean
// }) {
//   const supabase = await createClient()

//   const { data: lastImage } = await supabase
//     .from("product_images")
//     .select("sort_order")
//     .eq("product_id", data.productId)
//     .order("sort_order", {
//       ascending: false,
//     })
//     .limit(1)
//     .maybeSingle()

//   const sortOrder =
//     lastImage
//       ? lastImage.sort_order + 1
//       : 0

//   const { data: image, error } = await supabase
//     .from("product_images")
//     .insert({
//       product_id: data.productId,
//       url: data.url,
//       path: data.path,
//       alt: data.alt ?? "",
//       sort_order: sortOrder,
//       is_primary: sortOrder === 0,
//     })
//     .select()
//     .single()

//   if (error) {
//     throw new Error(error.message)
//   }

//   return image
// }

// export async function deleteProductImage(id: string){
//   const supabase = await createClient()
//   const { error } = await supabase
//     .from("product_images")
//     .delete()
//     .eq("id",id)

//   if(error){
//     throw new Error(error.message)
//   }
// }

// export async function updateProductImage(
//   id: string,
//   data: {
//     alt?: string
//     sort_order?: number
//     is_primary?: boolean
//   }
// ) {
//   const supabase = await createClient()
//   const { data: image, error } = await supabase
//     .from("product_images")
//     .update(data)
//     .eq("id",id)
//     .select()
//     .single()

//     if(error){
//       throw new Error(error.message)
//     }

//     return image
// }

import { createClient } from "@/lib/supabase/server"

export async function getProductImages(
  productId: string
) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("product_images")
    .select(`
      id,
      product_id,
      url,
      path,
      alt,
      sort_order,
      is_primary,
      created_at
    `)
    .eq("product_id", productId)
    .order("sort_order", {
      ascending: true,
    })

  if (error) {
    throw new Error(error.message)
  }

  return data ?? []
}

export async function getProductImageById(
  imageId: string
) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("product_images")
    .select(`
      id,
      product_id,
      url,
      path,
      alt,
      sort_order,
      is_primary,
      created_at
    `)
    .eq("id", imageId)
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function createProductImage(data: {
  productId: string
  url: string
  path: string
  alt?: string
  sortOrder?: number
  isPrimary?: boolean
}) {
  const supabase = await createClient()

  const { data: image, error } = await supabase
    .from("product_images")
    .insert({
      product_id: data.productId,
      url: data.url,
      path: data.path,
      alt: data.alt ?? "",
      sort_order: data.sortOrder ?? 0,
      is_primary: data.isPrimary ?? false,
    })
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return image
}

export async function updateProductImage(
  imageId: string,
  data: {
    alt?: string
    sort_order?: number
    is_primary?: boolean
  }
) {
  const supabase = await createClient()

  const { data: image, error } = await supabase
    .from("product_images")
    .update(data)
    .eq("id", imageId)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return image
}

export async function deleteProductImage(
  imageId: string
) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("product_images")
    .delete()
    .eq("id", imageId)

  if (error) {
    throw new Error(error.message)
  }

  return true
}