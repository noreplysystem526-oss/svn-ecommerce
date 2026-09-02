import { createClient } from "@/lib/supabase/server";

export async function getProducts() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      category:categories (
        id,
        name,
        slug
      ),
      product_images (
        id,
        url,
        alt,
        sort_order
      )
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error(JSON.stringify(error, null, 2))
    throw new Error("Failed to fetch products")
  }

  return data
}

export async function getProductById(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      category:categories (
        id,
        name,
        slug
      ),
      product_images (
        id,
        url,
        alt,
        sort_order
      )
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching product:", error)
    throw new Error("Product not found")
  }

  return data
}

export async function getProductBySlug(slug: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      category:categories (
        id,
        name,
        slug
      ),
      product_images (
        id,
        url,
        alt,
        sort_order
      )
    `)
    .eq("slug", slug)
    .single()

  if (error) {
    console.error("Error fetching product by slug:", error)
    throw new Error("Product not found")
  }

  return data
}
