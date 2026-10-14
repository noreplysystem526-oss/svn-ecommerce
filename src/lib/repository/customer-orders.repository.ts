import { createClient } from "@/lib/supabase/server"

export async function getMyOrders(userId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("orders")
    .select(`
      id,
      status,
      payment_method,
      total,
      created_at,
      order_items (
        id,
        product_id,
        product_name,
        quantity,
        price
      )
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return data ?? []
}                   

export async function getMyOrder(
  userId: string,
  orderId: string
) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("orders")
    .select(`
      id,
      user_id,
      order_number,
      status,
      payment_method,
      payment_status,
      subtotal,
      shipping_fee,
      discount,
      total,
      recipient_name,
      recipient_phone,
      shipping_address,
      note,
      created_at,
      order_items (
        id,
        product_id,
        product_name,
        variant_name,
        sku,
        price,
        quantity,
        subtotal
      )
    `)
    .eq("id", orderId)
    .eq("user_id", userId)
    .single()

  if (error) {
    if (error.code === "PGRST116") {
      return null
    }

    throw new Error(error.message)
  }

  return data
}