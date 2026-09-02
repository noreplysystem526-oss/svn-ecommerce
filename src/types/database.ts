import type { Database } from "../lib/supabase/database.types";

// Cart
export type Cart =
  Database["public"]["Tables"]["carts"]["Row"];

export type CartInsert =
  Database["public"]["Tables"]["carts"]["Insert"];

export type CartUpdate =
  Database["public"]["Tables"]["carts"]["Update"];

// Category
export type Category =
  Database["public"]["Tables"]["categories"]["Row"];

export type CategoryInsert =
  Database["public"]["Tables"]["categories"]["Insert"];

export type CategoryUpdate =
  Database["public"]["Tables"]["categories"]["Update"];

// Order
export type Order =
  Database["public"]["Tables"]["orders"]["Row"];

export type OrderInsert =
  Database["public"]["Tables"]["orders"]["Insert"];

export type OrderUpdate =
  Database["public"]["Tables"]["orders"]["Update"];

// Product
export type Product =
  Database["public"]["Tables"]["products"]["Row"];

export type ProductInsert =
  Database["public"]["Tables"]["products"]["Insert"];

export type ProductUpdate =
  Database["public"]["Tables"]["products"]["Update"];

// Profile
export type Profile =
  Database["public"]["Tables"]["profiles"]["Row"];

export type ProfileInsert =
  Database["public"]["Tables"]["profiles"]["Insert"];

export type ProfileUpdate =
  Database["public"]["Tables"]["profiles"]["Update"];

// Product Image
export type ProductImages =
  Database["public"]["Tables"]["product_images"]["Row"];

export type ProductImagesInsert =
  Database["public"]["Tables"]["product_images"]["Insert"];

export type ProductImagesUpdate =
  Database["public"]["Tables"]["product_images"]["Update"];
