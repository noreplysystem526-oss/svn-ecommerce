import { createClient } from "@/lib/supabase/server";
import { BrandsInsert,BrandsUpdate } from "@/types/database";


export async function createBrand(brand: BrandsInsert) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("brands")
    .insert(brand)
    .select()
    .single()

  console.log("4. AFTER INSERT")
  console.log("5. DATA:", data)
  console.log("6. ERROR:", error)

  if (error) {
    console.error("CREATE BRAND ERROR:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    })

    throw new Error(error.message)
  }

  return data
}
export async function updateBrand(
  id: string,
  brand: BrandsUpdate) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("brands")
    .update(brand)
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("UPDATE BRAND ERROR:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    })

    throw new Error(error.message)
  }

  return data
}
export async function deleteBrand(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("brands")
    .delete()
    .eq("id", id)

  if (error) {
    console.error("Error deleting brand:", error)
    throw new Error("Failed to delete brand")
  }

  return true
}