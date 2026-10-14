import { createClient } from "@/lib/supabase/server"

export async function getAddresses(userId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("addresses")
    .select(`
      id,
      user_id,
      recipient_name,
      phone,
      address_line,
      ward,
      district,
      province,
      is_default,
      created_at,
      updated_at
    `)
    .eq("user_id", userId)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return data ?? []
}

export async function getAddressById(
  userId: string,
  addressId: string
) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("addresses")
    .select(`
      id,
      user_id,
      recipient_name,
      phone,
      address_line,
      ward,
      district,
      province,
      is_default,
      created_at,
      updated_at
    `)
    .eq("id", addressId)
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

