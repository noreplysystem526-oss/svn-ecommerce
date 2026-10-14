"use client"

import { useState } from "react"
import {
  createAddress,
  updateAddress,
} from "@/lib/actions/addresses.actions"
import { useRouter } from "next/navigation"

type Address = {
  id: string
  recipient_name: string
  phone: string
  address_line: string
  ward: string | null
  district: string | null
  province: string | null
  is_default: boolean
}

type AddressFormProps = {
  address?: Address
  onSuccess?: () => void
}

export function AddressForm({
  address,
  onSuccess,
}: AddressFormProps) {
  const isEdit = !!address

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError("")

    try {
      const data = {
        recipient_name: String(
          formData.get("recipient_name") || "",
        ),
        phone: String(
          formData.get("phone") || "",
        ),
        address_line: String(
          formData.get("address_line") || "",
        ),
        ward: String(
          formData.get("ward") || "",
        ),
        district: String(
          formData.get("district") || "",
        ),
        province: String(
          formData.get("province") || "",
        ),
        is_default:
          formData.get("is_default") === "on",
      }

      if (isEdit) {
        await updateAddress(address.id, data)
      } else {
        await createAddress(data)
      }
      onSuccess?.()
      router.refresh()     

    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra",
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      action={handleSubmit}
      className="space-y-4"
    >
      <div className="space-y-2">
        <label
          htmlFor="recipient_name"
          className="text-sm font-medium"
        >
          Người nhận
        </label>

        <input
          id="recipient_name"
          name="recipient_name"
          required
          defaultValue={address?.recipient_name ?? ""}
          className="w-full rounded-md border px-3 py-2"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="phone"
          className="text-sm font-medium"
        >
          Số điện thoại
        </label>

        <input
          id="phone"
          name="phone"
          required
          defaultValue={address?.phone ?? ""}
          className="w-full rounded-md border px-3 py-2"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="address_line"
          className="text-sm font-medium"
        >
          Địa chỉ
        </label>

        <input
          id="address_line"
          name="address_line"
          required
          defaultValue={address?.address_line ?? ""}
          className="w-full rounded-md border px-3 py-2"
          placeholder="Số nhà, tên đường..."
        />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <label
            htmlFor="ward"
            className="text-sm font-medium"
          >
            Phường/Xã
          </label>

          <input
            id="ward"
            name="ward"
            defaultValue={address?.ward ?? ""}
            className="w-full rounded-md border px-3 py-2"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="district"
            className="text-sm font-medium"
          >
            Quận/Huyện
          </label>

          <input
            id="district"
            name="district"
            defaultValue={address?.district ?? ""}
            className="w-full rounded-md border px-3 py-2"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="province"
            className="text-sm font-medium"
          >
            Tỉnh/Thành phố
          </label>

          <input
            id="province"
            name="province"
            defaultValue={address?.province ?? ""}
            className="w-full rounded-md border px-3 py-2"
          />
        </div>
      </div>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="is_default"
          defaultChecked={address?.is_default ?? false}
        />

        <span className="text-sm">
          Đặt làm địa chỉ mặc định
        </span>
      </label>

      {error && (
        <p className="text-sm text-destructive">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
      >
        {loading
          ? "Đang lưu..."
          : isEdit
            ? "Lưu thay đổi"
            : "Lưu địa chỉ"}
      </button>
    </form>
  )
}