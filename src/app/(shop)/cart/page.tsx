"use client"

import Link from "next/link"
import { useCartStore } from "@/store/cart.store"
import Image from "next/image"

export default function CartPage() {
  const items = useCartStore((state) => state.items)
  const removeItem = useCartStore((state) => state.removeItem)
  const updateQuantity = useCartStore(
    (state) => state.updateQuantity
  )
  
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

  if (items.length === 0) {
    return (
      <main className="container mx-auto px-6 py-16">
        <h1 className="text-2xl font-semibold">
          Giỏ hàng
        </h1>

        <p className="mt-4 text-muted-foreground">
          Giỏ hàng của bạn đang trống.
        </p>

        <Link
          href="/"
          className="mt-6 inline-block underline"
        >
          Tiếp tục mua sắm
        </Link>
      </main>
    )
  }

  return (
    <main className="container mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-semibold">
        Giỏ hàng
      </h1>

      <div className="mt-8 space-y-4">
        {items.map((item) => (
          <div
  key={`${item.productId}-${item.variantId ?? "default"}`}
  className="flex items-center justify-between gap-4 rounded-lg border p-4"
>
  {/* Khu vực 1: Ảnh + thông tin sản phẩm */}
  <div className="flex min-w-0 flex-1 items-center gap-3">
    {item.imageUrl ? (
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border bg-muted">
        <Image
          src={item.imageUrl}
          alt={item.variantName || item.name}
          width={64}
          height={64}
          className="h-full w-full object-cover"
        />
      </div>
    ) : (
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md border bg-muted text-xs text-muted-foreground">
        Chưa có ảnh
      </div>
    )}

    <div className="min-w-0 flex-1">
      <Link
        href={`/products/${item.slug}`}
        className="font-medium hover:underline"
      >
        {item.name}
      </Link>

      {item.variantName && (
        <p className="mt-1 text-sm text-muted-foreground">
          Phiên bản: {item.variantName}
        </p>
      )}

      <p className="mt-1 text-sm text-muted-foreground">
        {item.price.toLocaleString("vi-VN")} ₫
      </p>

      <p className="mt-1 text-sm font-medium">
        Thành tiền:{" "}
        {(item.price * item.quantity).toLocaleString("vi-VN")} ₫
      </p>
    </div>
  </div>

  {/* Khu vực 2: Số lượng + xóa */}
  <div className="flex shrink-0 items-center gap-2">
    <button
      type="button"
      onClick={() =>
        updateQuantity(item.productId, item.quantity - 1, item.variantId)
      }
      className="flex h-8 w-8 items-center justify-center rounded border hover:bg-muted"
      aria-label="Giảm số lượng"
    >
      −
    </button>

    <span className="min-w-5 text-center">{item.quantity}</span>

    <button
      type="button"
      onClick={() =>
        updateQuantity(item.productId, item.quantity + 1, item.variantId)
      }
      className="flex h-8 w-8 items-center justify-center rounded border hover:bg-muted"
      aria-label="Tăng số lượng"
    >
      +
    </button>

    <button
      type="button"
      onClick={() => removeItem(item.productId, item.variantId)}
      className="ml-1 text-sm text-red-500 hover:text-red-600"
    >
      Xóa
    </button>
  </div>
</div>
        ))}
      </div>

      {/* Tổng tiền */}
      <div className="mt-8 border-t pt-6 text-right">
        <p className="text-lg font-semibold">
          Tổng: {subtotal.toLocaleString("vi-VN")} ₫
        </p>

        <Link
          href="/checkout"
          className="mt-4 inline-block rounded-md bg-primary px-6 py-3 text-white"
        >
          Thanh toán
        </Link>
      </div>
    </main>
  )
}