"use client"

import { Banknote, Building2, CheckCircle2 } from "lucide-react"

export type PaymentMethod = "cod" | "bank_transfer"

type PaymentSelectorProps = {
  value: PaymentMethod
  onChange: (method: PaymentMethod) => void
}

const paymentMethods = [
  {
    value: "cod" as const,
    title: "Thanh toán khi nhận hàng",
    description: "Thanh toán trực tiếp cho đơn vị giao hàng.",
    icon: Banknote,
  },
  {
    value: "bank_transfer" as const,
    title: "Chuyển khoản ngân hàng",
    description: "Chuyển khoản theo hướng dẫn sau khi đặt hàng.",
    icon: Building2,
  },
]

export function PaymentSelector({
  value,
  onChange,
}: PaymentSelectorProps) {
  return (
    <section className="rounded-xl border bg-background p-5">
      <h2 className="mb-5 text-lg font-semibold">
        Phương thức thanh toán
      </h2>

      <div className="space-y-3">
        {paymentMethods.map((method) => {
          const Icon = method.icon
          const selected = value === method.value

          return (
            <button
              key={method.value}
              type="button"
              onClick={() => onChange(method.value)}
              aria-pressed={selected}
              className={`flex w-full items-start gap-3 rounded-lg border p-4 text-left transition ${
                selected
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "hover:border-muted-foreground/50"
              }`}
            >
              <Icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

              <div className="min-w-0 flex-1">
                <p className="font-medium">{method.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {method.description}
                </p>
              </div>

              {selected && (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
              )}
            </button>
          )
        })}
      </div>
    </section>
  )
}