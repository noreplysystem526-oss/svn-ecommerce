"use server"

import { createProduct as createProductRepository } from "@/lib/actions/product.actions";

export async function createProduct(formData: FormData) {
  const name = formData.get("name") as string
  const slug = formData.get("slug") as string
  const description = formData.get("description") as string
  const price = Number(formData.get("price"))
  const stock = Number(formData.get("stock"))
  const sku = formData.get("sku") as string

  return createProductRepository({
    category_id: null,
    name,
    slug,
    description,
    price,
    stock,
    sku,
  })
}