"use client"

import Image from "next/image"
import Link from "next/link"
import { useCartStore } from "@/store/cart.store"

type OrderSummaryProps = {
  shippingFee?: number
  discount?: number
}

function formatPrice(price: number) {
  return `${price.toLocaleString("vi-VN")} ₫`
}

export function OrderSummary({
  shippingFee = 0,
  discount = 0,
}: OrderSummaryProps) {
  const items = useCartStore((state) => state.items)

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

  const total = Math.max(
    0,
    subtotal + shippingFee - discount
  )

  return (
    <aside className="h-fit rounded-xl border bg-background p-5 lg:sticky lg:top-6">
      <h2 className="text-lg font-semibold">
        Đơn hàng của bạn
      </h2>

      <div className="mt-5 space-y-4">
        {items.map((item) => (
          <div
            key={`${item.productId}-${item.variantId ?? "default"}`}
            className="flex items-start gap-3"
          >
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md border bg-muted">
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={item.variantName || item.name}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-[10px] text-muted-foreground">
                  No image
                </div>
              )}

              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-foreground px-1 text-xs text-background">
                {item.quantity}
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <Link
                href={`/products/${item.slug}`}
                className="line-clamp-2 text-sm font-medium hover:underline"
              >
                {item.name}
              </Link>

              {item.variantName && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {item.variantName}
                </p>
              )}

              <p className="mt-1 text-xs text-muted-foreground">
                {formatPrice(item.price)} / sản phẩm
              </p>
            </div>

            <p className="shrink-0 text-sm font-medium">
              {formatPrice(item.price * item.quantity)}
            </p>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="py-6 text-center">
          <p className="text-sm text-muted-foreground">
            Giỏ hàng đang trống.
          </p>
          <Link
            href="/"
            className="mt-2 inline-block text-sm text-primary hover:underline"
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      )}
      <div className="mt-5 space-y-3 border-t pt-4 text-sm">
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">Tạm tính</span>
          <span>{formatPrice(subtotal)}</span>
        </div>

        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">
            Phí vận chuyển
          </span>
          <span>
            {shippingFee === 0
              ? "Miễn phí"
              : formatPrice(shippingFee)}
          </span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">
              Giảm giá
            </span>
            <span className="text-green-600">
              −{formatPrice(discount)}
            </span>
          </div>
        )}

        <div className="flex justify-between gap-4 border-t pt-4 text-base font-semibold">
          <span>Tổng thanh toán</span>
          <span className="text-primary">
            {formatPrice(total)}
          </span>
        </div>
      </div>
    </aside>
  )
}