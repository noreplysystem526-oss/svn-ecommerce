"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";
import {
  createProductVariant,
  updateProductVariant,
  deleteProductVariant,
} from "@/lib/repository/product-variant.repository";
import { productVariantSchema } from "@/lib/validation/product-variant";

const updateProductVariantSchema = productVariantSchema
  .omit({ product_id: true })
  .partial();

async function requireAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Bạn cần đăng nhập");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || profile?.role !== "admin") {
    throw new Error("Bạn không có quyền thực hiện thao tác này");
  }
}

export async function createProductVariantAction(
  input: unknown
) {
  await requireAdmin();

  const validated = productVariantSchema.parse(input);

  const variant = await createProductVariant(validated);

  revalidatePath(`/admin/products/${validated.product_id}`);

  return { success: true, data: variant };
}

export async function updateProductVariantAction(
  id: string,
  input: unknown
) {
  await requireAdmin();

  const validId = z.string().uuid().safeParse(id);

  if (!validId.success) {
    throw new Error("ID biến thể không hợp lệ");
  }

  const validated = updateProductVariantSchema.parse(input);

  const variant = await updateProductVariant(id, validated);

  revalidatePath("/admin/products");

  return { success: true, data: variant };
}

export async function deleteProductVariantAction(
  id: string,
  productId: string
) {
  await requireAdmin();

  const validId = z.string().uuid().safeParse(id);
  const validProductId = z.string().uuid().safeParse(productId);

  if (!validId.success || !validProductId.success) {
    throw new Error("ID biến thể hoặc sản phẩm không hợp lệ");
  }

  await deleteProductVariant(id);

  revalidatePath(`/admin/products/${productId}`);

  return { success: true };
}