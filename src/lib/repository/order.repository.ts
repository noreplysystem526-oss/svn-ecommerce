import { createClient } from "@/lib/supabase/server";

export async function getOrders() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("orders")
    .select(`
      *
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error(JSON.stringify(error, null, 2))
    throw new Error("Failed to fetch orders")
  }

  return data
}
export async function getOrderById(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("orders")
    .select(`
      *
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching order:", error)
    throw new Error("Order not found")
  }

  return data
}
export async function getOrderBySlug(slug: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("orders")
    .select(`
      *
    `)
    .eq("slug", slug)
    .single()

  if (error) {
    console.error("Error fetching order by slug:", error)
    throw new Error("Order not found")
  }

  return data
}