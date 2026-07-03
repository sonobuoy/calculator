# Kalkulator Web - Robust & Scalable

Aplikasi kalkulator web modern yang dibangun dengan React, TypeScript, dan Vite. Proyek ini dirancang dengan menerapkan prinsip-prinsip software design yang solid (SOLID) untuk memastikan kode yang bersih, mudah dipelihara, dan scalable.

## 🚀 Tech Stack

- **Framework:** React 19+ dengan Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Testing:** Vitest & React Testing Library
- **State Management:** React Context API

## 🏗️ Arsitektur & Design Principles

Proyek ini mengimplementasikan prinsip-prinsip fundamental software engineering:

### 1. Separation of Concerns (SoC) & MVVM Pattern

```
src/
├── core/
│   └── calculator/
│       ├── engine.ts          # Pure Business Logic
│       ├── operations.ts      # Operation Registry (Strategy Pattern)
│       └── types.ts           # Type definitions
├── components/
│   ├── Display.tsx            # Presentation Layer
│   ├── Keypad.tsx             # Presentation Layer
│   └── Button.tsx             # Reusable UI Component
├── hooks/
│   └── useCalculator.ts       # ViewModel (connects UI to Engine)
└── App.tsx                    # Root Component
```

- **Calculation Engine** (`src/core/calculator/engine.ts`): Murni *pure functions* tanpa side-effects, tidak bergantung pada React atau DOM.
- **UI Components**: Hanya bertanggung jawab untuk rendering dan menangkap event user.
- **Custom Hook** (`useCalculator`): Bertindak sebagai ViewModel yang menghubungkan UI dengan Business Logic.

### 2. Single Responsibility Principle (SRP)

Setiap modul memiliki tanggung jawab tunggal:

| Modul | Tanggung Jawab |
|-------|----------------|
| `engine.ts` | Parsing ekspresi matematika dan eksekusi kalkulasi |
| `operations.ts` | Registrasi dan definisi operasi matematika |
| `Button.tsx` | Render tombol dengan styling dan aksesibilitas |
| `Display.tsx` | Menampilkan input dan hasil kalkulasi |
| `useCalculator.ts` | Mengelola state (history, current input, error handling) |

### 3. Open/Closed Principle (OCP)

Calculation Engine menggunakan pola **Strategy/Registry** untuk operasi matematika:

```typescript
// Menambahkan operasi baru TANPA memodifikasi fungsi inti
registerOperation('sqrt', {
  symbol: '√',
  arity: 1,
  fn: (a) => Math.sqrt(a)
});

// Operasi scientific dapat ditambahkan dengan mudah
registerOperation('sin', {
  symbol: 'sin',
  arity: 1,
  fn: (a) => Math.sin(a)
});
```

### 4. Defensive Programming & Error Handling

Edge cases ditangani secara elegan:

- ✅ Pembagian dengan nol → Menampilkan "Error"
- ✅ Input desimal ganda (`5..3`) → Dicegah/dibersihkan
- ✅ Overflow angka → Ditangani dengan graceful error
- ✅ Ekspresi tidak valid → Tidak menyebabkan crash aplikasi

## 📦 Instalasi

```bash
npm install
```

## 🧪 Testing

Jalankan test suite dengan Vitest:

```bash
# Jalankan semua test
npm run test

# Jalankan test dengan watch mode
npm run test -- --watch

# Lihat coverage
npm run test -- --coverage
```

### Test Coverage

Unit tests mencakup:
- Operasi dasar (+, -, *, /)
- Presisi desimal
- Error handling (pembagian dengan nol, input invalid)
- Edge cases (overflow, multiple decimals)

## 🛠️ Development

```bash
# Start development server
npm run dev

# Build untuk production
npm run build

# Preview build production
npm run preview

# Linting
npm run lint
```

## 🎨 Fitur UI/UX

- **Responsif:** Tampilan optimal di berbagai ukuran layar
- **Aksesibel:** Mendukung navigasi keyboard (a11y)
- **Modern:** Desain clean dengan Tailwind CSS
- **History:** Menyimpan riwayat kalkulasi
- **Error Display:** Menampilkan pesan error yang informatif

## 📁 Struktur Direktori

```
calculator-app/
├── src/
│   ├── core/
│   │   └── calculator/
│   │       ├── engine.ts        # Core business logic (pure functions)
│   │       ├── operations.ts    # Operation registry
│   │       ├── engine.test.ts   # Unit tests untuk engine
│   │       └── types.ts         # TypeScript types
│   ├── components/
│   │   ├── Display.tsx          # Display component
│   │   ├── Keypad.tsx           # Keypad layout
│   │   └── Button.tsx           # Reusable button
│   ├── hooks/
│   │   └── useCalculator.ts     # State management hook
│   ├── index.css                # Global styles + Tailwind
│   ├── App.tsx                  # Main application
│   └── main.tsx                 # Entry point
├── tests/
│   └── setup.ts                 # Test configuration
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🔐 Type Safety

Seluruh kode ditulis dengan TypeScript strict mode untuk memastikan:
- Type checking pada compile time
- Autocomplete yang akurat
- Refactoring yang aman
- Dokumentasi tipe yang jelas

## 📝 Conventional Commits

Proyek ini menggunakan Conventional Commits:

```
feat: menambahkan operasi sqrt
fix: memperbaiki presisi desimal
test: menambahkan unit test untuk pembagian
docs: update README
refactor: memisahkan engine dari UI
```

## 🤝 Kontribusi

1. Buat branch fitur (`git checkout -b feat/amazing-feature`)
2. Commit perubahan (`git commit -m 'feat: add amazing feature'`)
3. Push ke branch (`git push origin feat/amazing-feature`)
4. Buat Pull Request

## 📄 License

MIT License - lihat [LICENSE](LICENSE) untuk detail.

---

**Dibuat dengan ❤️ oleh Senior Software Engineer**
