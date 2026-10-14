"use client"

import { useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { updateMyProfileAction } from "@/lib/actions/profile.actions"

interface ProfileFormProps {
  email: string
  initialData: {
    full_name: string
    phone: string
  }
}

export function ProfileForm({
  email,
  initialData,
}: ProfileFormProps) {
  const [fullName, setFullName] = useState(
    initialData.full_name
  )

  const [phone, setPhone] = useState(
    initialData.phone
  )

  const [loading, setLoading] = useState(false)

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault()

    if (loading) return

    setLoading(true)

    try {
      await updateMyProfileAction({
        full_name: fullName,
        phone,
      })

      toast.success(
        "Cập nhật thông tin thành công"
      )
    } catch (error) {
      console.error(error)

      toast.error(
        "Không thể cập nhật thông tin"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div className="space-y-2">
        <Label>Email</Label>

        <Input
          value={email}
          disabled
        />

        <p className="text-xs text-muted-foreground">
          Email đăng nhập không thể chỉnh sửa tại đây.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="full_name">
          Họ và tên
        </Label>

        <Input
          id="full_name"
          value={fullName}
          onChange={(e) =>
            setFullName(e.target.value)
          }
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">
          Số điện thoại
        </Label>

        <Input
          id="phone"
          value={phone}
          onChange={(e) =>
            setPhone(e.target.value)
          }
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
      >
        {loading
          ? "Đang lưu..."
          : "Lưu thay đổi"}
      </Button>
    </form>
  )
}