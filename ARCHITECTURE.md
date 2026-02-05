# Clean Architecture Structure

## โครงสร้างโฟลเดอร์

```
src/
├── app/                          # Next.js App Router
│   ├── (routes)/                 # Route groups
│   ├── layout.tsx
│   └── page.tsx
│
├── core/                         # Business Logic Layer (ไม่ขึ้นกับ framework)
│   ├── domain/                   # Entities & Business Rules
│   │   ├── entities/             # Domain entities
│   │   ├── value-objects/        # Value objects
│   │   └── repositories/         # Repository interfaces
│   │
│   └── use-cases/                # Application Business Rules
│       └── */                    # Use case per feature
│
├── infrastructure/               # External Concerns
│   ├── api/                      # API clients
│   ├── repositories/             # Repository implementations
│   ├── services/                 # External services
│   └── config/                   # Configuration files
│
├── presentation/                 # UI Layer
│   ├── components/               # React Components
│   │   ├── ui/                   # Base UI components (buttons, inputs, etc.)
│   │   ├── features/             # Feature-specific components
│   │   └── layout/               # Layout components
│   │
│   ├── hooks/                    # Custom React hooks
│   ├── contexts/                 # React contexts
│   ├── animations/               # Framer Motion animations
│   └── styles/                   # Global styles & theme
│
└── shared/                       # Shared utilities
    ├── types/                    # TypeScript types & interfaces
    ├── constants/                # Constants
    ├── utils/                    # Utility functions
    └── helpers/                  # Helper functions
```

## หลักการ Clean Architecture

### 1. **Dependency Rule**
- Dependencies ชี้จากนอกเข้าใน
- Core layer ไม่ต้องรู้จัก Infrastructure หรือ Presentation
- Inner layers ไม่มี dependency กับ outer layers

### 2. **Layers**

#### **Core Layer** (ชั้นในสุด)
- `domain/`: Entities, Value Objects, Repository Interfaces
- `use-cases/`: Business logic, application rules

#### **Infrastructure Layer**
- API clients, Database, External services
- Implementations of repository interfaces

#### **Presentation Layer** (ชั้นนอกสุด)
- React Components, Hooks, Contexts
- Framer Motion animations
- UI/UX specific code

#### **Shared Layer**
- Utilities, Types, Constants ที่ใช้ร่วมกันได้ทุก layer

## การใช้งาน Framer Motion

Animations จะอยู่ใน `presentation/animations/` และถูกใช้โดย components ใน `presentation/components/`

## การใช้ Kanit Font

Font configuration อยู่ใน `app/layout.tsx` และ imported จาก `next/font/google`
