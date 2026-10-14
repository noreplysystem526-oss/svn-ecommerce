import { createClient } from "@/lib/supabase/server"

export async function getProfileById(userId: string) {
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

export async function updateProfile(
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