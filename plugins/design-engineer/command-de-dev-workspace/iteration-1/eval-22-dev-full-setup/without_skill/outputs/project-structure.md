# Recommended Project Structure

```
my-remix-app/
├── app/
│   ├── routes/
│   │   ├── _index.tsx
│   │   ├── login.tsx
│   │   └── dashboard/
│   ├── components/
│   │   ├── ui/
│   │   └── layout/
│   ├── models/
│   ├── utils/
│   └── root.tsx
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
├── public/
├── .env
├── package.json
├── tsconfig.json
└── remix.config.js
```

## Key Directories

- **app/routes/**: File-based routing. Each file exports loader, action, and default component.
- **app/components/**: Shared UI components used across routes.
- **app/models/**: Thin wrappers around Prisma queries for common operations.
- **prisma/**: Database schema, migrations, and seed data.
