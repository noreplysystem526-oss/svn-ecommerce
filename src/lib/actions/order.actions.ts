import { createClient } from "@/lib/supabase/server";
import { OrderInsert,OrderUpdate } from "@/types/database";

export async function createOrder(order:OrderInsert) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("orders")
    .insert(order)
    .select()
    .single()

  if (error) {
    console.error("Error creating order:", error)
    throw new Error("Failed to create order")
  }

  return data
}
export async function updateOrder(
  id: string,
  order: OrderUpdate) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("orders")
    .update(order)
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("Error updating order:", error)
    throw new Error("Failed to update order")
  }

  return data
}
export async function deleteOrder(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("orders")
    .delete()
    .eq("id", id)

  if (error) {
    console.error("Error deleting order:", error)
    throw new Error("Failed to delete order")
  }

  return true
}