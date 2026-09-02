import { z } from "zod";

export const categorySchema = z.object({
    description: z.string().nullable(),
    image_url: z.string().nullable(),
    is_active: z.boolean({
      error: "Trạng thái phải có Có hoặc Không"
    }),
    name: z.string().min(1,"Không được để trống"),
    slug: z.string().min(1,"Không được để trống"),
})

export type CategoryFormValues = z.infer<typeof categorySchema>