import { getProducts } from "@/lib/repository/product.repository"
import { getOrders } from "@/lib/repository/order.repository"
import { getCategories } from "@/lib/repository/category.repository"
import { getBrands } from "../repository/brand.repository"
import { getCustomers } from "../repository/customer.repository"


export const ResourceRepositories = {
  products: {
    getAll: getProducts,
  },
  orders: {
    getAll: getOrders,
  },
  categories: {
    getAll: getCategories,
  },
  brands: {
    getAll: getBrands,
  },
  customers: {
    getAll: getCustomers, 
  }
}
