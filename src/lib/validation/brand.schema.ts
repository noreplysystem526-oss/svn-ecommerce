import { z } from "zod";

export const brandSchema = z.object({
    description: z.string({
        "error": "Mô tả không được để trống!",
    }).nullable(),
    is_active: z.boolean({
      error: "Trạng thái phải có Có hoặc Không"
    }),
    name: z.string({
        "error": "Tên thương hiệu không được để trống!"
    }).min(1,"Không được để trống"),
    slug: z.string({
        "error": "Slug không được để trống!"
    }).min(1,"Không được để trống"),
})

export type BrandFormValues = z.infer<typeof brandSchema>