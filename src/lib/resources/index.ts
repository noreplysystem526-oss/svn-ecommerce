import { productConfig } from "./product.config";
import { orderConfig } from './order.config';
import { categoryConfig } from "./category.config";

export const resourceConfig = {
    products: productConfig,
    orders: orderConfig,
    categories: categoryConfig
} as const

export type ResourceName = keyof typeof resourceConfig

// f={
//     a:b,
//     d:e
// } => f[a]=b