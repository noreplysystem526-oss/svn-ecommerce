"use client"

import { useState } from "react"
import { setDefaultAddress } from "@/lib/actions/addresses.actions"
import { useRouter } from "next/navigation"

type SetDefaultAddressButtonProps = {
  addressId: string
}

export function SetDefaultAddressButton({
  addressId,
}: SetDefaultAddressButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSetDefault() {
    try {
      setLoading(true)

      await setDefaultAddress(addressId)

      router.refresh()
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleSetDefault}
      disabled={loading}
      className="text-sm text-muted-foreground hover:text-primary disabled:opacity-50"
    >
      {loading ? "Đang cập nhật..." : "Đặt mặc định"}
    </button>
  )
}