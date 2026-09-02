            ┌──────────────────┐
            │     Next.js      │
            │    App Router    │
            └────────┬─────────┘
                    │
    ┌───────────────┼───────────────┐
    │               │               │
    ▼               ▼               ▼
Shop             Account          Admin
    │               │               │
    └───────────────┼───────────────┘
                    │
                    ▼
        ┌──────────────────┐
        │     Supabase     │
        ├──────────────────┤
        │ Auth             │
        │ PostgreSQL       │
        │ Storage          │
        │ RLS              │
        └──────────────────┘

        Supabase
                       │
              generated Database
                       │
       ┌───────────────┴──────────────┐
       ↓                              ↓
 Repository                     Resource Config
       │                              │
       │                         Dynamic UI
       ↓                              ↓
   Data/Query                  Table + Form + Fields
       │                              │
       └──────────────┬───────────────┘
                      ↓
                    Zod
                      ↓
                 Server Action
                      ↓
                   Supabase