import { z } from "zod";

export const productVariantSchema = z.object({
  product_id: z.string().uuid("Sản phẩm không hợp lệ"),
  name: z.string().trim().min(1, "Tên biến thể không được để trống"),
  sku: z.string().trim().nullable().optional(),
  price: z.number().min(0, "Giá không được âm").nullable().optional(),
  stock: z.number().int().min(0, "Tồn kho không được âm"),
  attributes: z.record(z.string(), z.unknown()).default({}),
  is_active: z.boolean().default(true),
  image_url: z.string().url("URL hình ảnh không hợp lệ").nullable().optional()
})

export type ProductVariantFormValues = z.infer<typeof productVariantSchema>