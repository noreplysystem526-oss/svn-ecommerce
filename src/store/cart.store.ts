"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export type CartItem = {
  productId: string
  variantId?: string | null
  variantName?: string | null
  name: string
  slug: string
  price: number
  imageUrl?: string | null
  quantity: number
}

type CartStore = {
  items: CartItem[]

  ownerId: string | null

  addItem: (item: CartItem) => void

  removeItem: (
    productId: string,
    variantId?: string | null
  ) => void

  updateQuantity: (
    productId: string,
    quantity: number,
    variantId?: string | null
  ) => void

  clearCart: () => void

  syncOwner: (userId: string | null) => void

  getTotalItems: () => number
  getSubtotal: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      ownerId: null,
      addItem: (item) => {
        set((state) => {
          const itemVariantId = item.variantId ?? null

          const existingItem = state.items.find(
            (x) =>
              x.productId === item.productId &&
              (x.variantId ?? null) === itemVariantId
          )

          if (existingItem) {
            return {
              items: state.items.map((x) =>
                x.productId === item.productId &&
                (x.variantId ?? null) === itemVariantId
                  ? {
                      ...x,
                      quantity: x.quantity + item.quantity,
                    }
                  : x
              ),
            }
          }

          return {
            items: [
              ...state.items,
              {
                ...item,
                variantId: itemVariantId,
                variantName: item.variantName ?? null,
              },
            ],
          }
        })
      },

      removeItem: (productId, variantId = null) => {
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(
                item.productId === productId &&
                (item.variantId ?? null) === variantId
              )
          ),
        }))
      },

      updateQuantity: (
        productId,
        quantity,
        variantId = null
      ) => {
        if (quantity <= 0) {
          get().removeItem(productId, variantId)
          return
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId &&
            (item.variantId ?? null) === variantId
              ? {
                  ...item,
                  quantity,
                }
              : item
          ),
        }))
      },

      clearCart: () => {
        set({ items: [] })
      },

      syncOwner: (userId) => {
        const currentOwner = get().ownerId ?? null

        if (currentOwner === userId) {
          return
        }

        if (currentOwner && currentOwner !== userId) {
          set({ items: [] })
        }
        
        set({ ownerId: userId })
      },

      getTotalItems: () => {
        return get().items.reduce(
          (total, item) => total + item.quantity,
          0
        )
      },

      getSubtotal: () => {
        return get().items.reduce(
          (total, item) =>
            total + item.price * item.quantity,
          0
        )
      },
    }),
    {
      name: "shop-cart",
    }
  )
)