import { createClient } from "@/lib/supabase/server"

export async function getProductVariants(productId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("product_variants")
    .select("*")
    .eq("product_id", productId)
    .order("created_at", { ascending: true })

  if (error) {
    console.error("Error fetching product variants:", error.message)
    throw new Error("Failed to fetch product variants")
  }

  return data
}

export async function getProductVariantById(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("product_variants")
    .select("*")
    .eq("id", id)
    .maybeSingle()

  if (error) {
    console.error("Error fetching product variant:", error.message)
    throw new Error("Failed to fetch product variant")
  }

  return data
}

export async function createProductVariant(
  input: {
    product_id: string
    name: string
    sku?: string | null
    price?: number | null
    stock?: number
    attributes?: Record<string, unknown>
    is_active?: boolean
    image_url?: string | null
  }
) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("product_variants")
    .insert({
      product_id: input.product_id,
      name: input.name,
      sku: input.sku ?? null,
      price: input.price ?? null,
      stock: input.stock ?? 0,
      attributes: input.attributes ?? {},
      is_active: input.is_active ?? true,
    })
    .select()
    .single()

  if (error) {

    console.error("Error creating product variant:", error.message)
    console.error(error.code)

    if(String(error.code) === "23505") {
    let errorDetails = String(error.details);
    errorDetails = errorDetails.replace("Key ","");
    errorDetails = errorDetails.replace("already exists.","");

      throw new Error("Lỗi trùng dữ liệu: "+ errorDetails);
    }
    throw new Error("Failed to create product variant")
  }



  return data
}

export async function updateProductVariant(
  id: string,
  input: {
    name?: string
    sku?: string | null
    price?: number | null
    stock?: number
    attributes?: Record<string, unknown>
    is_active?: boolean
    image_url?: string | null
  }
) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("product_variants")
    .update({
      ...input,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    if(String(error.code) === "23505") {
    let errorDetails = String(error.details);
    errorDetails = errorDetails.replace("Key ","");
    errorDetails = errorDetails.replace("already exists.","");

      throw new Error("Lỗi trùng dữ liệu: "+ errorDetails);
    }
    console.error("Error updating product variant:", error.message)
    throw new Error("Failed to update product variant")
  }

  return data
}

export async function deleteProductVariant(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("product_variants")
    .delete()
    .eq("id", id)

  if (error) {
    console.error("Error deleting product variant:", error.message)
    throw new Error("Failed to delete product variant")
  }
}