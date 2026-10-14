import type { ResourceConfig } from "./types";

export const productVariantConfig: ResourceConfig = {
  title: "Product Variants",
  description: "Quản lý các biến thể của sản phẩm",
  singularLabel: "Product Variant",
  related: [],

  fields: [
    {
      name: "name",
      label: "Variant Name",
      type: "text",
      required: true,
    },
    {
      name: "sku",
      label: "SKU",
      type: "text",
      showIn: ["table", "form"],
    },
    {
      name: "price",
      label: "Price",
      type: "number",
      showIn: ["table", "form"],
    },
    {
      name: "stock",
      label: "Stock",
      type: "number",
      required: true,
      showIn: ["table", "form"],
    },
    {
      name: "attributes",
      label: "Attributes",
      type: "text",
      showIn: ["form"],
    },
    {
      name: "is_active",
      label: "Status",
      type: "boolean",
      required: true,
      showIn: ["table", "form"],
    },
  ],
};