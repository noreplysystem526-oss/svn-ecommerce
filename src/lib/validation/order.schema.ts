import { z } from "zod";

export const orderSchema = z.object({
    discount: z.number({
        error: "Discount phải là số!"
    })
    .min(0, "Discount không thể âm!")
    .optional(),
    note: z.string().nullable(),
    order_number: z.string().min(1,"Không được để trống"),
    payment_method: z.enum(["cod","bank_transfer","credit_card"]),
    payment_status: z.string().min(1,"Không được để trống"),
    recipient_name: z.string().min(1,"Không được để trống"),
    recipient_phone: z.string().min(1,"Không được để trống"),
    shipping_address: z.string().min(1,"Không được để trống"),
    shipping_fee: z.number(),
    subtotal: z.number(),
    status: z.string().min(1,"Không được để trống"),
    total: z.number(),
    user_id: z.string().nullable().optional(),
})

export type OrderFormValues = z.infer<typeof orderSchema>    
