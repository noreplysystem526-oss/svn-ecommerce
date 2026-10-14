import { redirect } from "next/navigation"

import { createClient } from "@/lib/supabase/server"
import { getMyOrders } from "@/lib/repository/customer-orders.repository"
import Link from "next/link"

export default async function MyOrdersPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login?redirectTo=/account/orders")
  }

  const orders = await getMyOrders(user.id)

  return (
    <main className="container mx-auto max-w-5xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">
          Đơn hàng của tôi
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Theo dõi và quản lý các đơn hàng của bạn
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-lg border p-8 text-center">
          <p className="text-muted-foreground">
            Bạn chưa có đơn hàng nào.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-lg border p-5"
            >
              <div className="flex items-center justify-between">
                <div>
                    <Link href={`/account/orders/${order.id}`}>
                        <p className="font-medium">
                            Đơn hàng #{order.id}
                        </p>
                    </Link>


                  <p className="mt-1 text-sm text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString(
                      "vi-VN"
                    )}
                  </p>
                </div>

                <span className="text-sm">
                  {order.status}
                </span>
              </div>

              <div className="mt-4 space-y-2">
                {order.order_items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between text-sm"
                  >
                    <span>
                      {item.product_name} × {item.quantity}
                    </span>

                    <span>
                      {item.price.toLocaleString("vi-VN")} ₫
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex justify-between border-t pt-4">
                <span className="font-medium">
                  Tổng cộng
                </span>

                <span className="font-semibold">
                  {order.total.toLocaleString("vi-VN")} ₫
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}