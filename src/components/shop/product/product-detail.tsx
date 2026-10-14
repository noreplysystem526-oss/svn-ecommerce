"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import type { Product } from "@/types/database"
import { AddToCartButton } from "../carts/add-to-cart-button"

type ProductVariant = {
  id: string
  name: string
  sku: string | null
  price: number | null
  stock: number
  is_active: boolean
  image_url: string | null
  product_images: []
  attributes: Record<string, unknown>
}

type ProductDetailData = Product & {
  product_variants?: ProductVariant[]
}

interface ProductDetailProps {
  product: ProductDetailData
}

export function ProductDetail({ product }: ProductDetailProps) {
  // 1. Sắp xếp ảnh sản phẩm theo thứ tự
  const images = [...(product.product_images ?? [])].sort(
    (a, b) => a.sort_order - b.sort_order
  )

  const primaryImage =
    images.find((image) => image.is_primary) ?? images[0]

  // 2. Lấy các biến thể đang hoạt động
  const variants = (product.product_variants ?? []).filter(
    (variant) => variant.is_active
  )

  // 3. Kết hợp ảnh sản phẩm và ảnh riêng của biến thể
  // Tránh hiển thị trùng ảnh theo URL
  const galleryImages = [
    ...images.map((image) => ({
      id: image.id,
      url: image.url,
      alt: image.alt || product.name,
      variantId: null as string | null,
    })),

    ...variants
      .filter(
        (variant) =>
          variant.image_url &&
          !images.some((image) => image.url === variant.image_url)
      )
      .map((variant) => ({
        id: `variant-${variant.id}`,
        url: variant.image_url!,
        alt: `${product.name} - ${variant.name}`,
        variantId: variant.id,
      })),
  ]

  // 4. Trạng thái ảnh và biến thể đang chọn
  const [selectedImage, setSelectedImage] = useState<string | null>(
    primaryImage?.url ?? null
  )

  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    null
  )

  const selectedVariant = variants.find(
    (variant) => variant.id === selectedVariantId
  )

  // 5. Khi chuyển sang sản phẩm khác, reset lựa chọn
  useEffect(() => {
    setSelectedImage(primaryImage?.url ?? null)
    setSelectedVariantId(null)
  }, [product.id, primaryImage?.url])

  // 6. Giá, tồn kho và SKU phụ thuộc biến thể đang chọn
  const currentPrice = selectedVariant
    ? selectedVariant.price ?? product.price
    : product.price

  const currentStock = selectedVariant
    ? selectedVariant.stock
    : product.stock

  const currentSku = selectedVariant
    ? selectedVariant.sku
    : product.sku

  // 7. Chọn biến thể
  function handleSelectVariant(variant: ProductVariant) {
    setSelectedVariantId(variant.id)

    // Có ảnh riêng thì hiển thị ảnh biến thể.
    // Nếu không có thì quay về ảnh đại diện sản phẩm.
    setSelectedImage(
      variant.image_url ?? primaryImage?.url ?? null
    )
  }

  // 8. Chọn ảnh trong album
  function handleSelectImage(image: (typeof galleryImages)[number]) {
    setSelectedImage(image.url)

    // Ảnh riêng của biến thể: tự chọn biến thể tương ứng.
    // Ảnh chung của sản phẩm: bỏ lựa chọn biến thể.
    setSelectedVariantId(image.variantId)
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="grid gap-10 md:grid-cols-2">
        {/* CỘT TRÁI: HÌNH ẢNH */}
        <div>
          {/* Ảnh chính */}
          <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
            {selectedImage ? (
              <Image
                src={selectedImage}
                alt={
                  selectedVariant
                    ? `${product.name} - ${selectedVariant.name}`
                    : product.name
                }
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                Chưa có hình ảnh
              </div>
            )}
          </div>

          {/* Album ảnh sản phẩm và ảnh biến thể */}
          {galleryImages.length > 0 && (
            <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5">
              {galleryImages.map((image) => (
                <button
                  key={image.id}
                  type="button"
                  onClick={() => handleSelectImage(image)}
                  aria-label={`Xem ảnh ${image.alt}`}
                  aria-pressed={selectedImage === image.url}
                  className={`relative aspect-square overflow-hidden rounded-lg border-2 transition ${
                    selectedImage === image.url
                      ? "border-primary"
                      : "border-transparent hover:border-muted-foreground/40"
                  }`}
                >
                  <Image
                    src={image.url}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 768px) 25vw, 120px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* CỘT PHẢI: THÔNG TIN SẢN PHẨM */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {product.name}
            </h1>

            {currentSku && (
              <p className="mt-2 text-sm text-muted-foreground">
                SKU: {currentSku}
              </p>
            )}
          </div>

          {/* Giá sản phẩm */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-2xl font-bold text-primary">
              {Number(currentPrice).toLocaleString("vi-VN")}₫
            </span>
            {!selectedVariant && product.compare_price != null && (
              <span className="text-base text-muted-foreground line-through">
                {Number(product.compare_price).toLocaleString("vi-VN")}₫
              </span>
            )}
          </div>

          {/* Mô tả */}
          {product.description && (
            <div
              className="prose prose-sm max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{
                __html: product.description,
              }}
            />
          )}

          {/* Chọn biến thể */}
          {variants.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-semibold">
                Phiên bản
                {selectedVariant && (
                  <span className="ml-2 font-normal text-muted-foreground">
                    {selectedVariant.name}
                  </span>
                )}
              </h2>

              <div className="flex flex-wrap gap-2">
                {variants.map((variant) => {
                  const isSelected = selectedVariantId === variant.id
                  const isOutOfStock = variant.stock <= 0

                  return (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() => handleSelectVariant(variant)}
                      aria-pressed={isSelected}
                      className={`rounded-lg border px-4 py-2 text-sm transition ${
                        isSelected
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-input hover:border-primary"
                      } ${
                        isOutOfStock
                          ? "opacity-60"
                          : ""
                      }`}
                    >
                      <span>{variant.name}</span>

                      {isOutOfStock && (
                        <span className="ml-2 text-xs text-muted-foreground">
                          Hết hàng
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Tồn kho */}
          <div className="text-sm">
            {currentStock > 0 ? (
              <span className="text-green-600">
                Còn hàng: {currentStock}
              </span>
            ) : (
              <span className="text-destructive">
                Hết hàng
              </span>
            )}
          </div>

          {/* Thêm vào giỏ hàng */}
          <div className="pt-2">
            <AddToCartButton
              product={{
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: Number(currentPrice),
                stock: currentStock,
                requiresVariant: variants.length > 0,
                variantId: selectedVariant?.id ?? null,
                variantName: selectedVariant?.name ?? null,
                imageUrl: selectedVariant?.image_url ?? 
                            primaryImage?.url ?? null,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}