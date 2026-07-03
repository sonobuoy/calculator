# Kalkulator Web - Robust & Scalable

Aplikasi kalkulator web modern yang dibangun dengan prinsip arsitektur bersih dan SOLID design principles.

## 🚀 Tech Stack

- **Framework:** React 18 dengan TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Testing:** Vitest & React Testing Library
- **State Management:** React Context API (lightweight)

## 🏗️ Arsitektur & Design Principles

### 1. Separation of Concerns (SoC) & MVVM Pattern

Proyek ini memisahkan secara mutlak antara **Calculation Engine** (Business Logic) dan **UI Components** (Presentation):

```
src/
├── core/calculator/    # Pure functions, zero dependencies ke React/DOM
├── components/         # UI Components hanya untuk render & event handling
├── hooks/              # Custom hooks sebagai bridge antara Core dan UI
└── types/              # TypeScript type definitions
```

**Calculation Engine** adalah modul independen yang:
- Tidak memiliki side-effects
- Tidak bergantung pada React atau DOM
- Dapat di-test secara terpisah
- Dapat digunakan di environment lain (Node.js, CLI, dll)

### 2. Single Responsibility Principle (SRP)

Setiap modul memiliki tanggung jawab tunggal:

| Modul | Tanggung Jawab |
|-------|----------------|
| `CalculatorEngine` | Parsing ekspresi matematika dan kalkulasi |
| `OperatorRegistry` | Mendaftarkan dan mengelola operasi matematika |
| `Display` | Menampilkan input dan hasil kalkulasi |
| `Keypad` | Merender tombol-tombol input |
| `Button` | Komponen tombol individual dengan styling |
| `useCalculator` | Mengelola state dan menghubungkan Core dengan UI |

### 3. Open/Closed Principle (OCP)

Calculation Engine menggunakan pola **Strategy/Registry** untuk operasi matematika:

```typescript
// Menambahkan operasi baru TANPA memodifikasi fungsi inti
registry.register('sin', (a: number) => Math.sin(a));
registry.register('cos', (a: number) => Math.cos(a));
registry.register('log', (a: number) => Math.log10(a));
```

Untuk menambahkan operasi scientific di masa depan, cukup daftarkan operasi baru tanpa mengubah kode existing.

### 4. Defensive Programming & Error Handling

Edge cases ditangani secara elegan:

| Kasus | Penanganan |
|-------|------------|
| Pembagian dengan nol | Menampilkan "Error" |
| Input desimal ganda (`5..3`) | Diabaikan atau ditampilkan sebagai error |
| Overflow angka | Menampilkan "Overflow" |
| Ekspresi tidak valid | Menampilkan "Error" |
| Input kosong | Tetap menampilkan "0" |

## 📁 Struktur Direktori

```
calculator-app/
├── src/
│   ├── core/
│   │   └── calculator/
│   │       ├── engine.ts          # Pure calculation functions
│   │       ├── registry.ts        # Operator registry pattern
│   │       ├── types.ts           # Type definitions
│   │       └── engine.test.ts     # Unit tests
│   ├── components/
│   │   ├── Display.tsx
│   │   ├── Keypad.tsx
│   │   └── Button.tsx
│   ├── hooks/
│   │   └── useCalculator.ts
│   ├── App.tsx
│   └── main.tsx
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

## 🛠️ Instalasi & Development

### Prerequisites

- Node.js >= 18.x
- npm >= 9.x

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build untuk production
npm run build

# Preview production build
npm run preview
```

## 🧪 Testing

Jalankan test suite dengan Vitest:

```bash
# Run semua tests
npm run test

# Run tests dengan watch mode
npm run test -- --watch

# Run tests dengan coverage
npm run test -- --coverage
```

### Test Coverage

Unit tests mencakup:
- ✅ Operasi dasar (+, -, *, /)
- ✅ Presisi desimal (floating point handling)
- ✅ Error handling (pembagian dengan nol, input tidak valid)
- ✅ Edge cases (overflow, underflow)

## 📝 Conventional Commits

Proyek ini mengikuti standar Conventional Commits:

```
feat: tambah operasi modulus
fix: handle pembagian dengan nol
docs: update README dengan contoh usage
test: tambah unit test untuk operator registry
refactor: pisahkan engine dari UI components
chore: update dependencies
```

## 🎨 Features

- ✅ Operasi dasar: tambah, kurang, kali, bagi
- ✅ Support bilangan negatif
- ✅ History kalkulasi
- ✅ Keyboard navigation (a11y)
- ✅ Responsive design
- ✅ Dark/Light mode ready
- ✅ Error handling yang user-friendly

## 🔒 Error Handling Examples

```typescript
// Pembagian dengan nol
calculate("5 / 0") // returns "Error"

// Input tidak valid
calculate("5 ++ 3") // returns "Error"

// Desimal ganda
calculate("5..3") // returns "Error"

// Overflow
calculate("99999999999999999999 * 99999999999999999999") // returns "Overflow"
```

## 📄 License

MIT License - feel free to use this project for learning or production.

---
