import { redirect, notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getMyOrder } from "@/lib/repository/customer-orders.repository"

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function OrderDetailPage({
  params,
}: PageProps) {
  const { id } = await params

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/login?redirectTo=/account/orders/${id}`)
  }

  const order = await getMyOrder(user.id, id)

  if (!order) {
    notFound()
  }

  return (
    <main className="container mx-auto max-w-5xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">
          Chi tiết đơn hàng
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          #{order.id}
        </p>
      </div>

      {/* Thông tin đơn hàng */}
      <div className="rounded-lg border p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">
              Mã đơn hàng
            </p>
            <p className="font-medium">
              {order.id}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Trạng thái
            </p>
            <p className="font-medium">
              {order.status}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Phương thức thanh toán
            </p>
            <p className="font-medium">
              {order.payment_method}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Ngày đặt hàng
            </p>
            <p className="font-medium">
              {new Date(order.created_at).toLocaleDateString("vi-VN")}
            </p>
          </div>
        </div>
      </div>

      {/* Sản phẩm */}
      <div className="mt-6 rounded-lg border">
        <div className="border-b p-6">
          <h2 className="font-semibold">
            Sản phẩm
          </h2>
        </div>

        <div className="divide-y">
          {order.order_items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-6"
            >
              <div>
                <p className="font-medium">
                  {item.product_name}
                </p>

                {item.variant_name && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.variant_name}
                  </p>
                )}

                <p className="mt-1 text-sm text-muted-foreground">
                  SL: {item.quantity}
                </p>
              </div>

              <div className="text-right">
                <p className="font-medium">
                  {item.price.toLocaleString("vi-VN")} ₫
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  {item.subtotal.toLocaleString("vi-VN")} ₫
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tổng tiền */}
      <div className="mt-6 rounded-lg border p-6">
        <div className="flex justify-between">
          <span>Tạm tính</span>
          <span>
            {order.subtotal.toLocaleString("vi-VN")} ₫
          </span>
        </div>

        <div className="mt-3 flex justify-between">
          <span>Phí vận chuyển</span>
          <span>
            {order.shipping_fee.toLocaleString("vi-VN")} ₫
          </span>
        </div>

        <div className="mt-3 flex justify-between">
          <span>Giảm giá</span>
          <span>
            -{order.discount.toLocaleString("vi-VN")} ₫
          </span>
        </div>

        <div className="mt-4 flex justify-between border-t pt-4 text-lg font-semibold">
          <span>Tổng cộng</span>
          <span>
            {order.total.toLocaleString("vi-VN")} ₫
          </span>
        </div>
      </div>
    </main>
  )
}