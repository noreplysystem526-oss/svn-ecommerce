"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MapPin, ShoppingBag } from "lucide-react"

import { useCartStore } from "@/store/cart.store"
import { checkoutAction } from "@/lib/actions/checkout.actions"

import {
  AddressSelector,
  type CheckoutAddress,
} from "@/components/shop/checkout/address-selector"

import {
  PaymentSelector,
  type PaymentMethod,
} from "@/components/shop/checkout/payment-selector"

import { OrderSummary } from "@/components/shop/checkout/order-summary"

type CheckoutProfile = {
  id: string
  full_name: string | null
  phone: string | null
} | null

type ShippingInfo = {
  recipientName: string
  phone: string
  addressLine: string
  ward: string
  district: string
  province: string
}

type CheckoutClientProps = {
  isAuthenticated: boolean
  profile: CheckoutProfile
  addresses: CheckoutAddress[]
}

const emptyShippingInfo: ShippingInfo = {
  recipientName: "",
  phone: "",
  addressLine: "",
  ward: "",
  district: "",
  province: "",
}

export function CheckoutClient({
  isAuthenticated,
  profile,
  addresses,
}: CheckoutClientProps) {
  const router = useRouter()

  const items = useCartStore((state) => state.items)
  const clearCart = useCartStore((state) => state.clearCart)

  const defaultAddress =
    addresses.find((address) => address.is_default) ?? addresses[0]

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    defaultAddress?.id ?? null
  )

  const [useCustomAddress, setUseCustomAddress] = useState(
    !defaultAddress
  )

  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    ...emptyShippingInfo,
    recipientName:
      defaultAddress?.recipient_name ?? profile?.full_name ?? "",
    phone: defaultAddress?.phone ?? profile?.phone ?? "",
    addressLine: defaultAddress?.address_line ?? "",
    ward: defaultAddress?.ward ?? "",
    district: defaultAddress?.district ?? "",
    province: defaultAddress?.province ?? "",
  })

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("cod")

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  function updateShippingInfo(
    field: keyof ShippingInfo,
    value: string
  ) {
    setShippingInfo((current) => ({
      ...current,
      [field]: value,
    }))
  }

  async function handleCheckout() {
    setErrorMessage(null)

    if (items.length === 0) {
      setErrorMessage("Giỏ hàng của bạn đang trống.")
      return
    }

    if (!useCustomAddress && !selectedAddressId) {
      setErrorMessage("Vui lòng chọn địa chỉ giao hàng.")
      return
    }

    if (useCustomAddress) {
      const requiredFields: Array<keyof ShippingInfo> = [
        "recipientName",
        "phone",
        "addressLine",
        "province",
      ]

      const missingField = requiredFields.some(
        (field) => !shippingInfo[field].trim()
      ) 
      if (missingField) {
        setErrorMessage(
          "Vui lòng nhập họ tên, số điện thoại, địa chỉ và tỉnh/thành phố."
        )
        return
      }
    }

    setIsSubmitting(true)

    try {
      const result = await checkoutAction({
        addressId:
          !useCustomAddress && isAuthenticated
            ? selectedAddressId
            : null,
        shippingInfo: useCustomAddress ? shippingInfo : null,
        paymentMethod,
        items: items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId ?? null,
          quantity: item.quantity,
        })),
      })

      if (!result.success) {
        setErrorMessage(result.message)
        return
      }

      clearCart()

      router.push(
        `/checkout/success?orderId=${encodeURIComponent(result.orderId)}`
      )
    } catch (error) {
      console.error("Checkout error:", error)
      setErrorMessage("Không thể đặt hàng. Vui lòng thử lại.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="space-y-8 lg:col-span-2">
        <section className="rounded-xl border bg-card p-5">
          <h2 className="mb-4 text-lg font-semibold">
            Thông tin người nhận
          </h2>

          {!isAuthenticated && (
            <p className="mb-4 text-sm text-muted-foreground">
              Bạn có thể đặt hàng mà không cần đăng nhập hoặc tạo tài khoản.
            </p>
          )}

          {isAuthenticated && profile && (
            <p className="mb-4 text-sm text-muted-foreground">
              Đã đăng nhập. Bạn có thể sử dụng địa chỉ đã lưu hoặc nhập
              địa chỉ nhận hàng khác.
            </p>
          )}

          {addresses.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setUseCustomAddress(false)}
                className={`rounded-lg border px-4 py-2 text-sm ${
                  !useCustomAddress
                    ? "border-primary bg-primary/5 font-medium"
                    : "hover:bg-muted"
                }`}
              >
                Dùng địa chỉ đã lưu
              </button>

              <button
                type="button"
                onClick={() => setUseCustomAddress(true)}
                className={`rounded-lg border px-4 py-2 text-sm ${
                  useCustomAddress
                    ? "border-primary bg-primary/5 font-medium"
                    : "hover:bg-muted"
                }`}
              >
                Nhập địa chỉ khác
              </button>
            </div>
          )}

          {!useCustomAddress && addresses.length > 0 ? (
            <AddressSelector
              addresses={addresses}
              selectedAddressId={selectedAddressId}
              onSelect={setSelectedAddressId}
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label
                  htmlFor="recipientName"
                  className="mb-1.5 block text-sm font-medium"
                >
                  Họ và tên người nhận *
                </label>
                <input
                  id="recipientName"
                  autoComplete="name"
                  value={shippingInfo.recipientName}
                  onChange={(event) =>
                    updateShippingInfo("recipientName", event.target.value)
                  }
                  required
                  maxLength={120}
                  className="w-full rounded-lg border bg-background px-3 py-2.5 outline-none focus:border-primary"
                  placeholder="Nguyễn Văn A"
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="recipientPhone"
                  className="mb-1.5 block text-sm font-medium"
                >
                  Số điện thoại *
                </label>
                <input
                  id="recipientPhone"
                  type="tel"
                  autoComplete="tel"
                  value={shippingInfo.phone}
                  onChange={(event) =>
                    updateShippingInfo("phone", event.target.value)
                  }
                  required
                  maxLength={20}
                  className="w-full rounded-lg border bg-background px-3 py-2.5 outline-none focus:border-primary"
                  placeholder="09xxxxxxxx"
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="addressLine"
                  className="mb-1.5 block text-sm font-medium"
                >
                  Địa chỉ cụ thể *
                </label>
                <input
                  id="addressLine"
                  autoComplete="street-address"
                  value={shippingInfo.addressLine}
                  onChange={(event) =>
                    updateShippingInfo("addressLine", event.target.value)
                  }
                  required
                  maxLength={255}
                  className="w-full rounded-lg border bg-background px-3 py-2.5 outline-none focus:border-primary"
                  placeholder="Số nhà, tên đường..."
                />
              </div>

              <div>
                <label
                  htmlFor="ward"
                  className="mb-1.5 block text-sm font-medium"
                >
                  Phường / xã
                </label>
                <input
                  id="ward"
                  autoComplete="address-level3"
                  value={shippingInfo.ward}
                  onChange={(event) => updateShippingInfo("ward", event.target.value)
                  }
                  maxLength={120}
                  className="w-full rounded-lg border bg-background px-3 py-2.5 outline-none focus:border-primary"
                  placeholder="Phường / xã"
                />
              </div>

              <div>
                <label
                  htmlFor="district"
                  className="mb-1.5 block text-sm font-medium"
                >
                  Quận / huyện
                </label>
                <input
                  id="district"
                  value={shippingInfo.district}
                  onChange={(event) =>
                    updateShippingInfo("district", event.target.value)
                  }
                  maxLength={120}
                  className="w-full rounded-lg border bg-background px-3 py-2.5 outline-none focus:border-primary"
                  placeholder="Quận / huyện"
                />
              </div>

              <div className="sm:col-span-2">

                <label

                  htmlFor="province"

                  className="mb-1.5 block text-sm font-medium"

                >

                  Tỉnh / thành phố *

                </label>

                <input

                  id="province"

                  autoComplete="address-level1"

                  value={shippingInfo.province}

                  onChange={(event) =>

                    updateShippingInfo("province", event.target.value)

                  }

                  required

                  maxLength={120}

                  className="w-full rounded-lg border bg-background px-3 py-2.5 outline-none focus:border-primary"

                  placeholder="Tỉnh / thành phố"

                />

              </div>

            </div>

          )}

        </section>

        <section className="space-y-4">

          <h2 className="text-xl font-semibold">

            Phương thức thanh toán

          </h2>

          <PaymentSelector

            value={paymentMethod}

            onChange={setPaymentMethod}

          />

        </section>

      </div>

      <aside className="h-fit space-y-4 lg:sticky lg:top-6">

        <div className="flex items-center gap-2">

          <ShoppingBag className="size-5" />

          <h2 className="text-xl font-semibold">Đơn hàng của bạn</h2>

        </div>

        <OrderSummary shippingFee={0} discount={0} />

        {errorMessage && (

          <p

            role="alert"

            className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"

          >

            {errorMessage}

          </p>

        )}

        <button

          type="button"

          onClick={handleCheckout}

          disabled={isSubmitting || items.length === 0}

          className="w-full rounded-lg bg-primary px-5 py-3 font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"

        >

          {isSubmitting ? "Đang xử lý..." : "Đặt hàng"}

        </button>

        <p className="text-center text-xs text-muted-foreground">

          Vui lòng kiểm tra kỹ thông tin nhận hàng trước khi đặt hàng.

        </p>

      </aside>

    </div>

  )

}
                