import { createClient } from "@/lib/supabase/server";
import { ProductInsert,ProductUpdate } from "@/types/database";

// export async function createProduct(product:ProductInsert) {
//   const supabase = await createClient()

//   const { data, error } = await supabase
//     .from("products")
//     .insert(product)
//     .select()
//     .single()

//   if (error) {
//     console.log(data)
//     console.error("Error creating product:", {
//       message: error.message,
//       details: error.details,
//       hint: error.hint,
//       code: error.code,
//     })
//     throw new Error("Failed to create product")
//   }

//   return data
// }
export async function createProduct(product: ProductInsert) {
  console.log("1. ENTER createProduct")
  console.log("2. PRODUCT:", product)

  const supabase = await createClient()

  console.log("3. BEFORE INSERT")

  const { data, error } = await supabase
    .from("products")
    .insert(product)
    .select()
    .single()

  console.log("4. AFTER INSERT")
  console.log("5. DATA:", data)
  console.log("6. ERROR:", error)

  if (error) {
    console.error("CREATE PRODUCT ERROR:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    })

    throw new Error(error.message)
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
    console.error("UPDATE PRODUCT ERROR:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    })

    throw new Error(error.message)
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