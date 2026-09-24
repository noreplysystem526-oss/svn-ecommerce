import type { ResourceConfig } from "./types";

export const resourceConfigs = {
    products: {
    title: "Products",
    singularLabel: "Product",

    fields: [
        {
            name: "name",
            label: "Name",
            type: "text",
            required: true,
        },
        {
            name: "price",
            label: "Price",
            type: "number",
            required: true,
        },
        {
            name: "sku",
            label: "SKU",
            type: "text",
            required: true,
        },
        {
            name: "stock",
            label: "Stock",
            type: "number",
            required: true,
        },
        {
            name: "status",
            label: "Status",
            type: "select",
            required: true,
            options: [
                {
                    label: "Active",
                    value: "active"
                },
                {
                    label: "In Process",
                    value: "in_process"
                },
            ]
        },
        {
            name: "slug",
            label: "Slug",
            type: "text",
            required: true,
        },
        {
            name: "description",
            label: "Description",
            type: "rich_text",
        },
        {
            name: "compare_price",
            label: "Compare Price",
            type: "number",
            required: true,
        },
        {
            name: "category_id",
            label: "Category Id",
            type: "relation"
        }
    ]
    },
    orders: {
    title: "Orders",
    singularLabel: "Order",

    fields: [
        {
            name: "discount",
            label: "Discount",
            type: "number",
            required: true,
        },
        {
            name: "note",
            label: "Note",
            type: "rich_text",
        },
        {
            name: "order_number",
            label: "Order Number",
            type: "text",
            required: true,
        },
        {
            name: "payment_method",
            label: "Payment Method",
            type: "select",
            required: true,
            options: [
                {
                    label: "COD",
                    value: "cod"
                },
                {
                    label: "Bank Transfer",
                    value: "bank_transfer"
                },
                {
                    label: "Credit Card",
                    value: "credit_card"
                },
            ]
        },
        {
            name: "recipient_name",
            label: "Recipient Name",
            type: "text",
            required: true,
        },
        {
            name: "recipient_phone",
            label: "Recipient Phone",
            type: "text",
            required: true,
        },
        {
            name: "shipping_address",
            label: "Shipping Address",
            type: "rich_text",
            required: true,
        },
        {
            name: "shipping_fee",
            label: "Shipping Fee",
            type: "number",
            required: true,
        },
        {
            name: "subtotal",
            label: "Subtotal",
            type: "number",
            required: true,
        }
    ]
    },
    categories: {
    title: "Category",
    singularLabel: "Category",

    fields: [
        {
            name: "description",
            label: "Description",
            type: "rich_text",
        },
        {
            name: "image_url",
            label: "Image Url",
            type: "media",
        },
        {
            name: "is_active",
            label: "Is Active",
            type: "text",
            required: true,
        },
        {
            name: "name",
            label: "Name",
            type: "text",
            required: true,
        },
        {
            name: "slug",
            label: "Slug",
            type: "text",
            required: true,
        }
    ]
    }
}