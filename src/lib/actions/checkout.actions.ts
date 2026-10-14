"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

const shippingInfoSchema = z.object({
  recipientName: z.string().trim().min(1, "Vui lòng nhập họ tên").max(120),
  phone: z.string().trim().min(1, "Vui lòng nhập số điện thoại").max(20),
  addressLine: z.string().trim().min(1, "Vui lòng nhập địa chỉ").max(255),
  ward: z.string().trim().max(120),
  district: z.string().trim().max(120),
  province: z.string().trim().min(1, "Vui lòng nhập tỉnh/thành phố").max(120),
})

const checkoutSchema = z.object({
  addressId: z.string().uuid().nullable(),
  shippingInfo: shippingInfoSchema.nullable(),
  paymentMethod: z.enum(["cod", "bank_transfer"]),
  items: z
    .array(
      z.object({
        productId: z.string().uuid(),
        variantId: z.string().uuid().nullable(),
        quantity: z.number().int().min(1).max(100),
      })
    )
    .min(1, "Giỏ hàng đang trống")
    .max(100),
})
.refine(
  (data) => Boolean(data.addressId) !== Boolean(data.shippingInfo),
  {
    message: "Vui lòng cung cấp địa chỉ giao hàng hợp lệ.",
  }
)

export type CheckoutInput = z.infer<typeof checkoutSchema>

export type CheckoutActionResult =
  | {
      success: true
      orderId: string
      message: string
    }
  | {
      success: false
      message: string
    }

export async function checkoutAction(
  input: CheckoutInput
): Promise<CheckoutActionResult> {
  const parsed = checkoutSchema.safeParse(input)

  if (!parsed.success) {
    return {
      success: false,
      message:
        parsed.error.issues[0]?.message ?? "Thông tin đặt hàng không hợp lệ.",
    }
  }

  const { addressId, shippingInfo, paymentMethod, items } = parsed.data

  // Không cho gửi trùng một sản phẩm/biến thể trong cùng đơn.
  const itemKeys = items.map(
    (item) => `${item.productId}:${item.variantId ?? "default"}`
  )

  if (new Set(itemKeys).size !== itemKeys.length) {
    return {
      success: false,
      message: "Giỏ hàng có sản phẩm bị trùng.",
    }
  }

  const supabase = await createClient()

    const {
    data: { user },
    error: authError,
    } = await supabase.auth.getUser()

    // Chỉ ghi log lỗi xác thực.
    // Khách chưa đăng nhập vẫn được phép checkout.
    if (authError) {
    console.warn("Checkout auth warning:", authError.message)
    }

    const userId = user?.id ?? null

  // Địa chỉ đã lưu chỉ được dùng khi người dùng đã đăng nhập.

    if (addressId) {
  if (!userId) {
    return {
      success: false,
      message: "Vui lòng nhập thông tin nhận hàng.",
    }
  }

  const { data: address, error: addressError } = await supabase
    .from("addresses")
    .select("id")
    .eq("id", addressId)
    .eq("user_id", userId)
    .maybeSingle()

  if (addressError || !address) {
    return {
      success: false,
      message: "Địa chỉ giao hàng không hợp lệ.",
    }
  }
}


  if (!addressId && !shippingInfo) {
    return {
      success: false,
      message: "Vui lòng nhập thông tin nhận hàng.",
    }
  }

  const { data, error } = await supabase.rpc("checkout_create_order", {
    p_address_id: addressId,
    p_shipping_info: shippingInfo,
    p_payment_method: paymentMethod,
    p_items: items.map((item) => ({
      product_id: item.productId,
      variant_id: item.variantId,
      quantity: item.quantity,
    })),
  })

  if (error) {
    console.error("Create order error:", error)
    return {
      success: false,
      message:
        error.message === "OUT_OF_STOCK"
          ? "Một hoặc nhiều sản phẩm đã hết hàng."
          : "Không thể tạo đơn hàng. Vui lòng kiểm tra lại giỏ hàng.",
    }
  }

  const orderId =
    typeof data === "string"
      ? data
      : data &&
          typeof data === "object" &&
          "order_id" in data &&
          typeof data.order_id === "string"
        ? data.order_id
        : null

  if (!orderId) {
    return {
      success: false,
      message: "Không nhận được mã đơn hàng.",
    }
  }

  revalidatePath("/account/orders")
  revalidatePath("/admin/orders")

  return {
    success: true,
    orderId,
    message: "Đặt hàng thành công.",
  }
}