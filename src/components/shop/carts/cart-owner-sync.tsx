"use client"

import { useEffect } from "react"
import { useCartStore } from "@/store/cart.store"

type CartOwnerSyncProps = {
  userId: string | null
}

export function CartOwnerSync({ userId }: CartOwnerSyncProps) {
  const syncOwner = useCartStore((state) => state.syncOwner)

  useEffect(() => {
    syncOwner(userId)
  }, [userId, syncOwner])

  return null
}
