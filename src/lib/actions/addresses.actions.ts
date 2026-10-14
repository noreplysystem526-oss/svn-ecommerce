"use server"

import { createClient } from "@/lib/supabase/server"

export async function createAddress(data: {
  recipient_name: string
  phone: string
  address_line: string
  ward?: string
  district?: string
  province?: string
  is_default?: boolean
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Bạn chưa đăng nhập")
  }

  // Nếu đây là địa chỉ mặc định,
  // bỏ mặc định của các địa chỉ cũ trước
  if (data.is_default) {
    const { error } = await supabase
      .from("addresses")
      .update({ is_default: false })
      .eq("user_id", user.id)

    if (error) {
      throw new Error(error.message)
    }
  }

  const { data: address, error } = await supabase
    .from("addresses")
    .insert({
      user_id: user.id,
      recipient_name: data.recipient_name,
      phone: data.phone,
      address_line: data.address_line,
      ward: data.ward || null,
      district: data.district || null,
      province: data.province || null,
      is_default: data.is_default ?? false,
    })
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return address
}

export async function updateAddress(
  addressId: string,
  data: {
    recipient_name: string
    phone: string
    address_line: string
    ward?: string
    district?: string
    province?: string
    is_default?: boolean
  }
) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Bạn chưa đăng nhập")
  }

  if (data.is_default) {
    const { error } = await supabase
      .from("addresses")
      .update({ is_default: false })
      .eq("user_id", user.id)

    if (error) {
      throw new Error(error.message)
    }
  }

  const { data: address, error } = await supabase
    .from("addresses")
    .update({
      recipient_name: data.recipient_name,
      phone: data.phone,
      address_line: data.address_line,
      ward: data.ward || null,
      district: data.district || null,
      province: data.province || null,
      is_default: data.is_default ?? false,
    })
    .eq("id", addressId)
    .eq("user_id", user.id)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return address
}

export async function deleteAddress(addressId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Bạn chưa đăng nhập")
  }

  const { error } = await supabase
    .from("addresses")
    .delete()
    .eq("id", addressId)
    .eq("user_id", user.id)

  if (error) {
    throw new Error(error.message)
  }

  return { success: true }
}

export async function setDefaultAddress(addressId: string) {
  const supabase = await createClient()

  const {
    data: { user },} = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Bạn chưa đăng nhập")
  }

  // Bỏ default của tất cả địa chỉ hiện tại
  const { error: resetError } = await supabase
    .from("addresses")
    .update({ is_default: false })
    .eq("user_id", user.id)

  if (resetError) {
    throw new Error(resetError.message)
  }

  // Chỉ set default nếu address thuộc user hiện tại
  const { data: address, error } = await supabase
    .from("addresses")
    .update({ is_default: true })
    .eq("id", addressId)
    .eq("user_id", user.id)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return address
}