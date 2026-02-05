# 🎁 Unbox - Interactive Valentine Card System

## ✅ ระบบที่สร้างเสร็จแล้ว

### 1. 🏗️ Clean Architecture Implementation
```
✅ Domain Layer
  - GreetingCard Entity
  - ICardRepository Interface

✅ Use Cases
  - CreateCardUseCase (สร้างการ์ด พร้อม validation)

✅ Infrastructure
  - LocalStorageCardRepository (เก็บข้อมูลใน localStorage)

✅ Presentation
  - ValentineEnvelope Component (Interactive unboxing animation)
```

### 2. 🔄 Dynamic Routing System
```
✅ Routes:
  / (Home)           → สร้างการ์ด
  /[cardId]          → ดูการ์ด (Public page)

✅ URL Format:
  unbox.io/abc123    → ดูการ์ด ID: abc123
```

### 3. 💝 Interactive Valentine Card
**คุณสมบัติ:**
- ✨ Unboxing animation (เปิดซอง)
- 💖 Floating hearts background
- 🎨 Smooth transitions
- 📱 Responsive design
- 🌙 Dark mode support

**Flow:**
1. ซองจดหมายปิดผนึกด้วย 💝
2. คลิกเพื่อเปิดซอง (แอนิเมชันเปิดขาหน้า)
3. การ์ดค่อยๆ โผล่จากซอง
4. การ์ดแสดงเต็มหน้าจอพร้อมข้อความ

---

## 🎯 วิธีใช้งาน

### สร้างการ์ด (Home Page)
1. เข้า `http://localhost:3001`
2. กรอก "ชื่อผู้มอบ"
3. กรอก "ชื่อผู้รับ"
4. กดปุ่ม "สร้างการ์ด"
5. ระบบจะ redirect ไปหน้า preview `/[cardId]`

### ดูการ์ด (Card Page)
1. เข้า `http://localhost:3001/[cardId]`
2. คลิกที่ซองเพื่อเปิด
3. ดู unboxing animation

---

## 📦 Data Flow (Clean Architecture)

```
User Input (Home Page)
    ↓
CreateCardUseCase.execute()
    ↓
Validation (ชื่อผู้มอบ, ชื่อผู้รับ, Template)
    ↓
LocalStorageCardRepository.create()
    ↓
Generate Unique ID (nanoid)
    ↓
Save to LocalStorage
    ↓
Return GreetingCard object
    ↓
Router.push(`/${card.id}`)
    ↓
Card Preview Page
    ↓
LocalStorageCardRepository.findById()
    ↓
Increment View Count
    ↓
Render ValentineEnvelope Component
```

---

## 🗂️ ไฟล์ที่สร้าง

### Core Layer
```
src/core/domain/entities/GreetingCard.ts
src/core/domain/repositories/ICardRepository.ts
src/core/use-cases/CreateCardUseCase.ts
```

### Infrastructure Layer
```
src/infrastructure/repositories/LocalStorageCardRepository.ts
```

### Presentation Layer
```
src/presentation/components/features/ValentineEnvelope.tsx
```

### App Layer
```
src/app/page.tsx                    → Home (สร้างการ์ด)
src/app/[cardId]/page.tsx           → Card preview (ดูการ์ด)
```

---

## 🔧 Technical Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Animation**: Framer Motion
- **Styling**: Tailwind CSS v4
- **Font**: Kanit (Google Fonts)
- **Storage**: LocalStorage (Demo) → Ready for Supabase/DB
- **ID Generation**: nanoid

---

## 🚀 Next Steps (อนาคต)

### 1. Authentication System
```typescript
// เพิ่มการ login เพื่อจำกัดการสร้างการ์ด
- หน้า /login
- หน้า /signup
- หน้า /dashboard (ต้อง login)
- Middleware protection
```

### 2. Database Integration
```typescript
// แทนที่ LocalStorage ด้วย Database จริง
- Supabase
- Vercel Postgres
- MongoDB
```

### 3. Template System
```typescript
// เพิ่ม templates อื่นๆ
- Birthday Card
- Christmas Card
- New Year Card
- Custom Message Card
```

### 4. Share Features
```typescript
// เพิ่มฟีเจอร์การแชร์
- Copy Link
- QR Code Generator
- Social Media Sharing
- WhatsApp/Line Direct Share
```

### 5. Analytics
```typescript
// ติดตามสถิติ
- View count per card
- Popular templates
- Creation rate
- Share rate
```

---

## 🎨 Animation Details

### ValentineEnvelope Component
**States:**
1. **'sealed'** - ซองปิดอยู่ พร้อมแสดงชื่อผู้รับ/ผู้มอบ
2. **'opening'** - กำลังเปิดซอง (0.6s animation)
3. **'opened'** - ซองเปิดแล้ว
4. **'revealed'** - การ์ดแสดงเต็มหน้าจอ

**Animations:**
- Floating hearts background
- Envelope flap rotation (rotateX: -180deg)
- Seal/heart sticker breaking animation
- Card emerging from envelope
- Smooth transitions between states

---

## 💾 Data Structure

### GreetingCard Entity
```typescript
{
  id: string;              // "abc123"
  senderName: string;      // "ชื่อผู้มอบ"
  receiverName: string;    // "ชื่อผู้รับ"
  templateId: string;      // "valentine-2026"
  customMessage?: string;  // ข้อความเพิ่มเติม
  createdAt: Date;         // วันที่สร้าง
  viewCount: number;       // จำนวนการดู
  isPublic: boolean;       // สามารถดูได้โดยไม่ต้อง auth
}
```

---

## 🌐 Public vs Protected Routes

### Public (ใครก็เข้าได้)
- ✅ `/[cardId]` - ดูการ์ด

### Protected (ต้อง login - อนาคต)
- 🔒 `/dashboard` - สร้างการ์ด
- 🔒 `/dashboard/cards` - รายการการ์ดของฉัน
- 🔒 `/dashboard/analytics` - สถิติ

### Landing (ตอนนี้ = สร้างการ์ดฟรี, อนาคต = Login/Signup)
- `/` - Home page

---

## 📱 Responsive Breakpoints

```css
sm:  640px  → Mobile landscape
md:  768px  → Tablet
lg:  1024px → Desktop
xl:  1280px → Large desktop
```

---

## 🎯 สรุป

✅ **สำเร็จแล้ว:**
- Clean Architecture structure
- Dynamic routing (/[cardId])
- Interactive Valentine envelope animation
- Create card flow with validation
- LocalStorage data persistence
- Framer Motion animations
- Responsive design
- Dark mode support

🚧 **ยังไม่ได้ทำ (แต่พร้อมแล้ว):**
- Authentication system
- Database integration (แนะนำ Supabase)
- QR Code generation
- อรับในลัสองจดหมายเป็น templates อื่นๆ

---

**Status**: ✅ พร้อมใช้งาน Demo
**Date**: 2026-02-03
**Version**: 1.0.0
