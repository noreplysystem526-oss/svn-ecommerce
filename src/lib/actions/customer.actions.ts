"use server"

import { createClient } from "@/lib/supabase/server"
import {
  getCustomerById as getProfile,
  updateCustomerInformation as updateProfile,
} from "@/lib/repository/customer.repository"

export async function getMyProfileAction() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  return getProfile(user.id)
}

export async function updateMyProfileAction(data: {
  full_name: string
  phone: string
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  return updateProfile(user.id, data)
}