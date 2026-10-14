"use server"

import { createClient } from "@/lib/supabase/server"
import {
  getProfileById as getProfile,
  updateProfile,
} from "@/lib/repository/profile.repository"

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