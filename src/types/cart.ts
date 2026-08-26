import type { Database } from "./database.types";

export type Cart =
  Database["public"]["Tables"]["carts"]["Row"];

export type CartInsert =
  Database["public"]["Tables"]["carts"]["Insert"];

export type CartUpdate =
  Database["public"]["Tables"]["carts"]["Update"];