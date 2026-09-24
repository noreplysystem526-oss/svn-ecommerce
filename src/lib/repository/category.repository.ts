import { createClient } from "@/lib/supabase/server";

export async function getCategories() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("categories")
    .select(`
      *
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error(JSON.stringify(error, null, 2))
    throw new Error("Failed to fetch categories")
  }

  return data
}

export async function getCategoryById(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("categories")
    .select(`
      *
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching category:", error)
    throw new Error("Category not found")
  }

  return data
}

export async function getCategoryBySlug(slug: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("categories")
    .select(`
      *
    `)
    .eq("slug", slug)
    .single()

  if (error) {
    console.error("Error fetching category by slug:", error)
    throw new Error("Category not found")
  }

  return data
}

export async function getCategoriesForSelect(){
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("categories")
    .select(`
      id,
      name
    `)
    .eq("is_active", true)
    .order("name")

  if (error) {
    console.error("Error fetching categories for select:", error)
    throw new Error("Failed to fetch categories for select")
  }

  return data
}