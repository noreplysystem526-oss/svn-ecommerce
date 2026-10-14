"use client"

import { CheckCircle2, MapPin } from "lucide-react"

export type CheckoutAddress = {
  id: string
  recipient_name: string
  phone: string
  address_line: string
  ward: string | null
  district: string | null
  province: string
  is_default: boolean
}

type AddressSelectorProps = {
  addresses: CheckoutAddress[]
  selectedAddressId: string | null
  onSelect: (id: string) => void
}

export function AddressSelector({
  addresses,
  selectedAddressId,
  onSelect,
}: AddressSelectorProps) {
  return (
    <div className="space-y-3">
      {addresses.map((address) => {
        const selected = address.id === selectedAddressId

        const fullAddress = [
          address.address_line,
          address.ward,
          address.district,
          address.province,
        ]
          .filter(Boolean)
          .join(", ")

        return (
          <button
            key={address.id}
            type="button"
            onClick={() => onSelect(address.id)}
            aria-pressed={selected}
            className={`w-full rounded-xl border p-4 text-left transition-colors ${
              selected
                ? "border-primary bg-primary/5"
                : "hover:bg-muted/50"
            }`}
          >
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-5 shrink-0 text-muted-foreground" />

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">
                    {address.recipient_name}
                  </span>

                  {address.is_default && (
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-xs">
                      Mặc định
                    </span>
                  )}
                </div>

                <p className="mt-1 text-sm text-muted-foreground">
                  {address.phone}
                </p>

                <p className="mt-1 text-sm">{fullAddress}</p>
              </div>

              {selected && (
                <CheckCircle2 className="size-5 shrink-0 text-primary" />
              )}
            </div>
          </button>
        )
      })}
    </div>
  )
}