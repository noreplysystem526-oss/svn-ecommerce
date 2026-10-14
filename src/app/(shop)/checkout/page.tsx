import { createClient } from "@/lib/supabase/server"
import { CheckoutClient } from "@/components/shop/checkout/checkout-client"
import type { CheckoutAddress } from "@/components/shop/checkout/address-selector"

type CheckoutProfile = {
  id: string
  full_name: string | null
  phone: string | null
}

export default async function CheckoutPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let profile: CheckoutProfile | null = null
  let addresses: CheckoutAddress[] = []

  if (user) {
    const [profileResult, addressResult] = await Promise.all([
      supabase
        .from("profiles")
        .select("id, full_name, phone")
        .eq("id", user.id)
        .maybeSingle(),

      supabase
        .from("addresses")
        .select(
          "id, recipient_name, phone, address_line, ward, district, province, is_default"
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
    ])

    if (profileResult.error) {
      console.error("Get profile error:", profileResult.error)
      throw new Error("Không thể tải thông tin tài khoản.")
    }

    if (addressResult.error) {
      console.error("Get addresses error:", addressResult.error)
      throw new Error("Không thể tải địa chỉ giao hàng.")
    }

    profile = profileResult.data
    addresses = addressResult.data ?? []
  }

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Thanh toán
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Điền thông tin nhận hàng và kiểm tra đơn hàng của bạn.
        </p>
      </div>

      <CheckoutClient
        isAuthenticated={Boolean(user)}
        profile={profile}
        addresses={addresses}
      />
    </main>
  )
}