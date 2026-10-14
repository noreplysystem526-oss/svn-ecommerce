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
      brand:brands (
        id,
        name,
        slug
      ),
      product_images(
        id,
        url,
        alt,
        is_primary,
        sort_order
      ),
      product_variants(
        *
      )
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error(JSON.stringify(error, null, 2))
    throw new Error("Failed to fetch products")
  }

  return data.map((product) => {
    const images = [...(product.product_images ?? [])].sort(
      (a,b) => (a.sort_order - b.sort_order)
    )
    const image = 
      images.find((item) => item.is_primary)  ??
      images[0] ?? 
      null

      return {
        ...product,
        image,
      }
  })

  return data
}

export async function getFeatureProducts() {
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
      brand:brands (
        id,
        name,
        slug
      ),
      product_images(
        id,
        url,
        alt,
        is_primary,
        sort_order
      ),
      product_variants(
        *
      )
    `)
    .eq("status","active")
    .order("created_at", { ascending: false })


  if (error) {
    console.error(JSON.stringify(error, null, 2))
    throw new Error("Failed to fetch products")
  }

  return data.map((product) => {
    const images = [...(product.product_images ?? [])].sort(
      (a,b) => (a.sort_order - b.sort_order)
    )
    const image = 
      images.find((item) => item.is_primary)  ??
      images[0] ?? 
      null

      return {
        ...product,
        image,
      }
  })

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
      product_images(
        id,
        url,
        alt,
        is_primary,
        sort_order
      ),
      product_variants(
        *
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
      brand:brands (
        id,
        name,
        slug
      ),
      product_images(
        id,
        url,
        alt,
        is_primary,
        sort_order
      ),
      product_variants(
        *
      )
    `)
    .eq("slug", slug)
    .single()

    console.log("product data: ", data)
  if (error) {
    console.error("Error fetching product by slug:", error.message)
    throw new Error("Product not found")
  }

  return data
}

export async function getProductByCategorySlug(
  slug: string
) {
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
      brand:brands (
        id,
        name,
        slug
      ),
      product_images(
        id,
        url,
        alt,
        is_primary,
        sort_order
      )
      product_variants(
        *
      )
    `)
    .eq("category.slug", slug)

  if (error) {
    console.error("Error fetching product by slug:", error.message)
    throw new Error("Product not found")
  }

  return data
}
