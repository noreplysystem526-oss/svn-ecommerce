import type { Database } from "./database.types";

export type Order =
  Database["public"]["Tables"]["orders"]["Row"];

export type OrderInsert =
  Database["public"]["Tables"]["orders"]["Insert"];

export type OrderUpdate =
  Database["public"]["Tables"]["orders"]["Update"];