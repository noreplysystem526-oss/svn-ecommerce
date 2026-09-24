import { productConfig } from "./product.config";
import { orderConfig } from './order.config';
import { categoryConfig } from "./category.config";
import { brandConfig } from "./brand.config";
import { getProductBySlug, getBrandBySlug, getCategoryBySlug, getOrderBySlug, getBrandsForSelect, getCategoriesForSelect } from "@/lib/repository";
import { updateProduct, createProduct, deleteProduct } from "@/lib/actions/product.actions";
import { updateOrder, createOrder, deleteOrder } from "@/lib/actions/order.actions";
import { updateCategory, createCategory, deleteCategory } from "@/lib/actions/category.actions";
import { updateBrand, createBrand, deleteBrand } from "@/lib/actions/brand.actions";

export const resourceConfig = {
    products: productConfig,
    orders: orderConfig,
    categories: categoryConfig,
    brands: brandConfig
    
} as const

export type ResourceName = keyof typeof resourceConfig

const updateRepositories = {
    products: updateProduct,
    orders: updateOrder,
    categories: updateCategory,
    brands: updateBrand
} as const

export async function updateResource(
    resource: string,
    id : string,
    data: Record<string, unknown>
){
    const update = updateRepositories[
        resource as keyof typeof updateRepositories
    ]
    if(!update){
        throw new Error(`Unsupported resource: ${resource}`)
    }
    return update(id, data as never)
}

const findRepositories = {
  products: getProductBySlug,
  orders: getOrderBySlug,
  categories: getCategoryBySlug,
  brands: getBrandBySlug,
} as const

export async function getResourceBySlug(
  resource: string,
  slug: string
) {
  const find =
    findRepositories[
      resource as keyof typeof findRepositories
    ]

  if (!find) {
    throw new Error(`Unsupported resource: ${resource}`)
  }
  return find(slug)
}

const createRepositories = {
    products: createProduct,
    orders: createOrder,
    categories: createCategory,
    brands: createBrand
} as const

export async function createResource(
    resource: string,
    data: Record<string, unknown>
){
    const create = createRepositories[
        resource as keyof typeof createRepositories
    ]
    if(!create){
        throw new Error(`Unsupported resource: ${resource}`)
    }

    return create(data as never)
}

const deleteRepositories = {
    products: deleteProduct,
    orders: deleteOrder,
    categories: deleteCategory,
    brands: deleteBrand
} as const

export async function deleteResource(
    resource: string,
    id: string
){
    const deleteFn = deleteRepositories[
        resource as keyof typeof deleteRepositories
    ]
    if(!deleteFn){
        throw new Error(`Unsupported resource: ${resource}`)
    }

    return deleteFn(id)
}

const relationRepositories = {
    categories: getCategoriesForSelect,
    brands: getBrandsForSelect
} as const
export async function getRelationOptions(
    resource: string
){
    const relationRepository = relationRepositories[
        resource as keyof typeof relationRepositories
    ]
    if(!relationRepository){
        throw new Error(`Unsupported resource: ${resource}`)
    }
    const data = await relationRepository()
    if(!data){
        throw new Error(`Failed to fetch relation options for resource: ${resource}`)
    }
    return data.map((item: any) => ({
        value: String(item.id),
        label: String(item.name)
    }))
}