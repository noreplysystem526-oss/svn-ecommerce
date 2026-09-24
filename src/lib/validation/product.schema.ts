import { z } from "zod";

export const productSchema = z.object({
    category_id: z.string().nullable().optional(),
    compare_price: z.number({
        error: "Giá so sánh không hợp lệ!",
    }),
    description: z
    .string()
    .nullable()
    .optional(),
    name: z.string({
        error: "Tên sản phẩm không được để trống!",
    }).min(1, "Tên sản phẩm không được để trống!"),
    price: z.number({
        error: "Giá tiền không hợp lệ!",
    }).min(0, "Giá tiền phải lớn hơn 0"),
    sku: z.string({
        error: "SKU không được để trống",
    }).min(1, "SKU không được để trống"),
    slug: z.string({
        error: "Slug không được để trống",
    }).min(1, "Slug không được để trống"),
    status: z.string({
        error: "Trạng thái không được để trống",
    }).min(1, "Trạng thái không được để trống"),
    stock: z.number({
        error: "Số lượng không hợp lệ!",
    }).min(0, "Số lượng phải lớn hơn hoặc bằng 0"),
    brand_id: z.string({
        error: "Brand không được để trống",
    }).min(1, "Brand không được để trống"),
})