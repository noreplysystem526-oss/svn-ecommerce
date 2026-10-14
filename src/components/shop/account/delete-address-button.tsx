"use client"

import { useState } from "react"
import { deleteAddress } from "@/lib/actions/addresses.actions"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useRouter } from "next/navigation"

type DeleteAddressButtonProps = {
  addressId: string
}

export function DeleteAddressButton({
  addressId,
}: DeleteAddressButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    try {
      setLoading(true)

      await deleteAddress(addressId)

      router.refresh()
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          type="button"
          className="text-sm text-destructive"
        >
          Xóa
        </button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Xóa địa chỉ?
          </AlertDialogTitle>

          <AlertDialogDescription>
            Bạn có chắc muốn xóa địa chỉ này không?
            Thao tác này không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>
            Hủy
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Đang xóa..." : "Xóa"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}