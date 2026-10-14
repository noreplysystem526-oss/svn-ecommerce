"use client"

import { toast } from "sonner"
import { useCartStore } from "@/store/cart.store"

type AddToCartButtonProps = {
  product: {
    id: string
    name: string
    slug: string
    price: number
    stock: number
    requiresVariant: boolean
    variantId: string | null
    variantName: string | null
    imageUrl: string | null
  }
}

export function AddToCartButton({
  product,
}: AddToCartButtonProps) {
  const addItem = useCartStore(
    (state) => state.addItem
  )

  const needsVariant =
    product.requiresVariant && !product.variantId

  const outOfStock = product.stock <= 0

  const disabled = needsVariant || outOfStock

  function handleAddToCart() {
    if (needsVariant) {
      toast.error("Vui lòng chọn phiên bản sản phẩm")
      return
    }

    if (outOfStock) {
      toast.error("Sản phẩm đã hết hàng")
      return
    }

    addItem({
      productId: product.id,
      variantId: product.variantId,
      variantName: product.variantName,
      name: product.name,
      slug: product.slug,
      price: product.price,
      quantity: 1,
      imageUrl: product.imageUrl,
    })

    toast.success("Đã thêm sản phẩm vào giỏ hàng")
  }

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      disabled={disabled}
      className="rounded-md bg-primary px-5 py-3 text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {outOfStock
        ? "Hết hàng"
        : needsVariant
          ? "Chọn phiên bản"
          : "Thêm vào giỏ hàng"}
    </button>
  )
}