src/
│
├── app/
│
├── components/
│   ├── ui/                 ← shadcn
│   ├── product/
│   ├── cart/
│   ├── checkout/
│   └── account/
│
├── lib/
│   └── supabase/
│       ├── client.ts       ← Browser
│       ├── server.ts       ← Server
│       └── middleware.ts   ← Auth session
│
├── types/
│   ├── database.types.ts   ← GENERATED, không sửa tay
│   ├── product.ts
│   ├── category.ts
│   ├── cart.ts
│   ├── order.ts
│   └── profile.ts
│
└── middleware.ts            ← Next.js Middleware