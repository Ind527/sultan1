# Deploy ke Vercel

Ikuti langkah-langkah berikut untuk deploy project ini ke Vercel:

## 1. Persiapan File

Ganti file konfigurasi dengan versi Vercel:

```bash
# Backup file lama
mv package.json package.json.replit
mv tsconfig.json tsconfig.json.replit

# Gunakan konfigurasi Vercel
mv package.json.vercel package.json
mv tsconfig.json.vercel tsconfig.json
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Build Project

```bash
npm run build
```

## 4. Environment Variables

Pastikan Anda set environment variables berikut di Vercel:

- `DATABASE_URL` - Connection string ke database PostgreSQL
- `SESSION_SECRET` - Secret key untuk session (generate random string)

## 5. Deploy ke Vercel

1. Push code ke GitHub repository
2. Connect repository ke Vercel
3. Set environment variables di Vercel dashboard
4. Deploy!

## Struktur Project untuk Vercel

```
project-root/
├── src/
│   └── index.ts          ← Entry point untuk Vercel
├── dist/                 ← Hasil build (auto-generated)
├── server/               ← Server logic (existing)
├── shared/               ← Shared schemas (existing)
├── package.json          ← Package config untuk Vercel
├── tsconfig.json         ← TypeScript config untuk Vercel
└── vercel.json           ← Vercel deployment config
```

## Catatan Penting

- File `src/index.ts` adalah entry point yang disesuaikan untuk Vercel
- Database harus PostgreSQL yang bisa diakses dari internet (seperti Neon, PlanetScale, atau Supabase)
- Session store menggunakan database PostgreSQL, bukan memory store