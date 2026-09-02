import { createClient } from "@/lib/supabase/server";
import { CategoryInsert,CategoryUpdate } from "@/types/database";

export async function createCategory(category:CategoryInsert) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("categories")
    .insert(category)
    .select()
    .single()

  if (error) {
    console.error("Error creating category:", error)
    throw new Error("Failed to create category")
  }

  return data
}

export async function updateCategory(
  id: string,
  category: CategoryUpdate) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("categories")
    .update(category)
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("Error updating category:", error)
    throw new Error("Failed to update category")
  }

  return data
}
export async function deleteCategory(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id)

  if (error) {
    console.error("Error deleting category:", error)
    throw new Error("Failed to delete category")
  }

  return true
}