import { createClient } from "@/lib/supabase/server"

export async function getProductImages(
  productId: string
) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("product_images")
    .select("*")
    .eq("product_id", productId)
    .order("sort_order", {
      ascending: true,
    })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function getProductImageById(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("product_images")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function createProductImage(data: {
  productId: string
  url: string
  path: string
}) {
  const supabase = await createClient()

  const { data: lastImage } = await supabase
    .from("product_images")
    .select("sort_order")
    .eq("product_id", data.productId)
    .order("sort_order", {
      ascending: false,
    })
    .limit(1)
    .maybeSingle()

  const sortOrder =
    lastImage
      ? lastImage.sort_order + 1
      : 0

  const { data: image, error } = await supabase
    .from("product_images")
    .insert({
      product_id: data.productId,
      url: data.url,
      path: data.path,
      sort_order: sortOrder,
      is_primary: sortOrder === 0,
    })
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return image
}

export async function deleteProductImage(id: string){
  const supabase = await createClient()
  const { error } = await supabase
    .from("product_images")
    .delete()
    .eq("id",id)

  if(error){
    throw new Error(error.message)
  }
}