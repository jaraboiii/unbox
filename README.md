# Unbox - Clean Architecture with Framer Motion

โปรเจค Next.js ที่ออกแบบด้วย **Clean Architecture** พร้อม **Framer Motion** สำหรับ Interactive Animations และใช้ฟอนต์ **Kanit** จาก Google Fonts

## 🎯 Features

- ✅ **Clean Architecture** - โครงสร้างแบบ Clean Architecture แยก layers ชัดเจน
- ✅ **Framer Motion** - Animations สวยงามและ smooth
- ✅ **Kanit Font** - ฟอนต์ภาษาไทยที่สวยงามจาก Google Fonts
- ✅ **Next.js 16** - React framework ล่าสุด
- ✅ **React 19** - React เวอร์ชันล่าสุด
- ✅ **Tailwind CSS v4** - Utility-first CSS framework
- ✅ **TypeScript** - Type safety

## 📁 โครงสร้างโฟลเดอร์

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with Kanit font
│   ├── page.tsx                 # Home page
│   └── globals.css              # Global styles
│
├── core/                         # Business Logic Layer
│   ├── domain/                   # Domain Layer
│   │   ├── entities/             # Domain entities (User, Product, etc.)
│   │   ├── value-objects/        # Value objects
│   │   └── repositories/         # Repository interfaces
│   │
│   └── use-cases/                # Application Business Rules
│       └── products.ts           # Product use cases
│
├── infrastructure/               # External Concerns
│   ├── api/                      # API clients
│   ├── repositories/             # Repository implementations
│   │   └── MockProductRepository.ts
│   ├── services/                 # External services
│   └── config/                   # Configuration files
│
├── presentation/                 # UI Layer
│   ├── components/               # React Components
│   │   ├── ui/                   # Base UI components
│   │   │   ├── Button.tsx
│   │   │   └── Card.tsx
│   │   ├── features/             # Feature-specific components
│   │   └── layout/               # Layout components
│   │
│   ├── hooks/                    # Custom React hooks
│   │   └── useScrollAnimation.ts
│   │
│   ├── contexts/                 # React contexts
│   ├── animations/               # Framer Motion animations
│   │   └── variants.ts
│   └── styles/                   # Global styles & theme
│
└── shared/                       # Shared utilities
    ├── types/                    # TypeScript types & interfaces
    ├── constants/                # Constants
    ├── utils/                    # Utility functions
    └── helpers/                  # Helper functions
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn or pnpm

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Clean Architecture Principles

### 1. Dependency Rule
- Dependencies ชี้จากนอกเข้าใน
- Core layer ไม่ต้องรู้จัก Infrastructure หรือ Presentation
- Inner layers ไม่มี dependency กับ outer layers

### 2. Layers

#### **Core Layer** (ชั้นในสุด)
- `domain/`: Entities, Value Objects, Repository Interfaces
- `use-cases/`: Business logic, application rules
- ไม่มี dependencies กับ framework หรือ external libraries

#### **Infrastructure Layer**
- API clients, Database connections
- Implementations ของ repository interfaces
- External services integration

#### **Presentation Layer** (ชั้นนอกสุด)
- React Components, Hooks, Contexts
- Framer Motion animations
- UI/UX specific code

#### **Shared Layer**
- Utilities, Types, Constants
- ใช้ร่วมกันได้ทุก layer

## ✨ Framer Motion Animations

### Animation Variants

โปรเจคมี animation variants พร้อมใช้งาน:

```typescript
import { fadeIn, slideUp, scaleIn } from "@/presentation/animations/variants";
```

- `fadeIn` - Fade in animation
- `slideUp` - Slide up with fade
- `slideDown` - Slide down with fade
- `scaleIn` - Scale in animation
- `staggerContainer` - Stagger children
- `bounce` - Bounce animation
- และอื่นๆ

### Custom Hooks

```typescript
import { useScrollAnimation } from "@/presentation/hooks/useScrollAnimation";

const { ref, isInView } = useScrollAnimation();
```

## 🎨 Components

### Button Component

```tsx
import { Button } from "@/presentation/components/ui/Button";

<Button variant="primary" size="lg">
  Click me
</Button>
```

### Card Component

```tsx
import { Card } from "@/presentation/components/ui/Card";

<Card>
  <h3>Card Title</h3>
  <p>Card content</p>
</Card>
```

## 🔤 Kanit Font

ฟอนต์ Kanit ถูก configure แล้วใน `app/layout.tsx`:

- รองรับภาษาไทยและภาษาอังกฤษ
- มี weights ครบทุกแบบ (100-900)
- Auto-optimized โดย Next.js

## 📝 Example Usage

### Creating a Use Case

```typescript
// src/core/use-cases/my-use-case.ts
import { IProductRepository } from "../domain/repositories";

export class MyUseCase {
  constructor(private productRepository: IProductRepository) {}
  
  async execute(params: any) {
    // Business logic here
  }
}
```

### Creating a Repository Implementation

```typescript
// src/infrastructure/repositories/MyRepository.ts
import { IProductRepository } from "@/core/domain/repositories";

export class MyRepository implements IProductRepository {
  // Implementation
}
```

## 🛠️ Tech Stack

- **Framework**: Next.js 16
- **UI Library**: React 19
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Language**: TypeScript
- **Font**: Kanit (Google Fonts)

## 📖 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

## 📄 License

MIT

---

สร้างด้วย ❤️ โดยใช้ Next.js, React, Framer Motion และ Tailwind CSS
