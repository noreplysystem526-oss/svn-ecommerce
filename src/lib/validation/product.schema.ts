import { z } from "zod";

export const productSchema = z.object({
    category_id: z.string().nullable().optional(),
    compare_price: z.number(),
    description: z.string().nullable(),
    name: z.string().min(1, "Tên sản phẩm không được để trống!"),
    price: z.number().min(0,"Giá tiền phải lớn hơn 0"),
    sku: z.string().min(1,"Không được để trống"),
    slug: z.string().min(1,"Không được để trống"),
    status: z.string().min(1,"Không được để trống"),
    stock: z.number()
})