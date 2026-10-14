"use client"

import { useState } from "react"
import { AddressForm } from "./address-form"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { DeleteAddressButton } from "./delete-address-button"
import { SetDefaultAddressButton } from "./set-default-address-button"

type Address = {
  id: string
  user_id: string
  recipient_name: string
  phone: string
  address_line: string
  ward: string | null
  district: string | null
  province: string | null
  is_default: boolean
  created_at: string
  updated_at: string
}

type AddressesPageContentProps = {
  addresses: Address[]
}

export function AddressesPageContent({
  addresses,
}: AddressesPageContentProps) {
  const [open, setOpen] = useState(false)
  const [editingAddress, setEditingAddress] =
    useState<Address | null>(null)

  function handleAdd() {
    setEditingAddress(null)
    setOpen(true)
  }

  function handleEdit(address: Address) {
    setEditingAddress(address)
    setOpen(true)
  }

  function handleDialogChange(value: boolean) {
    setOpen(value)

    if (!value) {
      setEditingAddress(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div>
          <h1 className="text-2xl font-semibold">
            Địa chỉ giao hàng
          </h1>

          <p className="text-muted-foreground">
            Quản lý các địa chỉ dùng khi đặt hàng
          </p>
        </div>

        <Dialog
          open={open}
          onOpenChange={handleDialogChange}
        >
          <DialogTrigger asChild>
            <button
              type="button"
              onClick={handleAdd}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              + Thêm địa chỉ
            </button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingAddress
                  ? "Sửa địa chỉ giao hàng"
                  : "Thêm địa chỉ giao hàng"}
              </DialogTitle>
            </DialogHeader>

            <AddressForm
              address={editingAddress ?? undefined}
              onSuccess={() => {
                setOpen(false)
                setEditingAddress(null)
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Address list */}
      {addresses.length === 0 ? (
        <div className="rounded-lg border p-8 text-center">
          <p className="text-muted-foreground">
            Bạn chưa có địa chỉ giao hàng nào.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="rounded-lg border p-5"
            >
              <div className="flex items-start justify-between gap-4">
                {/* Address information */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {address.recipient_name}
                    </span>

                    {address.is_default && (
                      <span className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">
                        Mặc định
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {address.phone}
                  </p>

                  <p className="text-sm">
                    {[
                      address.address_line,
                      address.ward,
                      address.district,
                      address.province,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex shrink-0 gap-3">
                  <button
                    type="button"
                    onClick={() => handleEdit(address)}
                    className="text-sm text-primary"
                  >
                    Sửa
                  </button>

                    <DeleteAddressButton 
                        addressId={address.id}

                    />

                    {!address.is_default && (
                            <SetDefaultAddressButton 
                                addressId={address.id}
                            />                        
                    )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}