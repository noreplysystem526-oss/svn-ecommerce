// src/lib/resources/order.config.ts

import type { ResourceConfig } from "./types";

export const orderConfig: ResourceConfig = {
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
}