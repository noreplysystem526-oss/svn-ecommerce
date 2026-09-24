import { createClient } from "@/lib/supabase/server";

export async function getBrands() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("brands")
    .select(`*`)
    .order("created_at", { ascending: false })

  if (error) {
    console.error(JSON.stringify(error, null, 2))
    throw new Error("Failed to fetch brands")
  }

  return data
}

export async function getBrandById(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("brands")
    .select(`*`)
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching brand:", error)
    throw new Error("Brand not found")
  }

  return data
}

export async function getBrandBySlug(slug: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("brands")
    .select(`*`)
    .eq("slug", slug)
    .single()

  if (error) {
    console.error("Error fetching brand by slug:", error)
    throw new Error("Brand not found")
  }

  return data
}

export async function getBrandsForSelect(){
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("brands")
    .select(`
      id,
      name
    `)
    .order("name")

  if (error) {
    console.error("Error fetching brands for select:", error)
    throw new Error("Failed to fetch brands for select")
  }

  return data
}

      
