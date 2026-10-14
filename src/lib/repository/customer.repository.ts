import { createClient } from "@/lib/supabase/server"

export async function getCustomers() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("profiles")
    .select(`*`)
    .order("created_at", { ascending: false })

  if (error) {
    console.error(JSON.stringify(error, null, 2))
    throw new Error("Failed to fetch customers")
  }

  return data
}

export async function getCustomerById(userId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, phone")
    .eq("id", userId)
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function updateCustomerInformation(
  userId: string,
  data: {
    full_name: string
    phone: string
  }
) {
  const supabase = await createClient()

  const { data: profile, error } = await supabase
    .from("profiles")
    .update(data)
    .eq("id", userId)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return profile
}