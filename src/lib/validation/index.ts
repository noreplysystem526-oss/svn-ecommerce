import { categorySchema } from "./category.schema"
import { orderSchema } from "./order.schema"
import { productSchema } from "./product.schema"
import { brandSchema } from "./brand.schema"

export const validationSchemas = {
  categories: categorySchema,
  products: productSchema,
  orders: orderSchema,
  brands: brandSchema, // Assuming brandSchema is similar to categorySchema, replace with actual brandSchema if available
} as const  