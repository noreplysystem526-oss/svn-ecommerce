import type { Database } from "./database.types";

export type ProductImages =
  Database["public"]["Tables"]["product_images"]["Row"];

export type ProductImagesInsert =
  Database["public"]["Tables"]["product_images"]["Insert"];

export type ProductImagesUpdate =
  Database["public"]["Tables"]["product_images"]["Update"];