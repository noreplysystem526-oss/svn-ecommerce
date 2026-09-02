import { createClient } from "@/lib/supabase/server";
import { ProductInsert,ProductUpdate } from "@/types/database";

export async function createProduct(product:ProductInsert) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("products")
    .insert(product)
    .select()
    .single()

  if (error) {
    console.error("Error creating product:", error)
    throw new Error("Failed to create product")
  }

  return data
}

export async function updateProduct(
  id: string,
  product: ProductUpdate) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("products")
    .update(product)
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("Error updating product:", error)
    throw new Error("Failed to update product")
  }

  return data
}
export async function deleteProduct(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id)

  if (error) {
    console.error("Error deleting product:", error)
    throw new Error("Failed to delete product")
  }

  return true
}