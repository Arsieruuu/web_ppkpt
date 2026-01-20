# API Integration Documentation

## ✅ Status Integrasi

Backend API berhasil diintegrasikan ke web Next.js PPKPT Admin Panel.

### File API Service yang Dibuat:

1. **lib/api/client.ts** - HTTP Client dengan JWT authentication
2. **lib/api/auth.ts** - Authentication services (login, logout, register)
3. **lib/api/laporan.ts** - Laporan CRUD dan admin operations
4. **lib/api/content.ts** - Edukasi & Aktivitas CRUD
5. **lib/api/notifications.ts** - Notification management
6. **lib/api/profile.ts** - User profile management
7. **.env.local** - Environment configuration

### Halaman yang Sudah Terintegrasi:

✅ **Login Page** (`app/page.tsx`)
- Real authentication dengan backend API
- Error handling untuk login gagal
- Loading state saat login
- Redirect ke admin dashboard setelah login sukses

✅ **Admin Dashboard** (`app/admin/page.tsx`)
- Load laporan terbaru dari API
- Statistik laporan real-time
- Logout dengan API

✅ **Laporan Page** (`app/admin/laporan/page.tsx`)
- Fetch semua laporan dari backend
- Filter berdasarkan status
- Search functionality
- Real-time statistics
- Loading state
- Status: Dalam Proses, Verifikasi, Proses Tindak Lanjut, Selesai, Ditolak

---

## 🔧 Cara Menggunakan

### 1. Install Dependencies (jika belum)
```bash
npm install
```

### 2. Jalankan Development Server
```bash
npm run dev
```

### 3. Login ke Admin Panel
Buka browser: `http://localhost:3000`

**Credentials:**
- Gunakan username/email dan password dari database backend
- Role harus `admin` atau `superadmin`

---

## 📡 Backend API Information

**Base URL:** `http://31.97.109.108:3000`

**Authentication:** JWT Bearer Token (disimpan di localStorage)

**Response Format:**
```typescript
{
  success: boolean,
  message?: string,
  data?: any,
  error_code?: string
}
```

---

## 🎯 API Endpoints yang Tersedia

### Authentication
- `POST /api/auth/login` - Login
- `GET /api/auth/jurusan` - Get jurusan
- `GET /api/auth/prodi` - Get prodi

### Laporan
- `GET /api/admin/laporan` - Get all laporan (with filters)
- `GET /api/admin/laporan/:id` - Get laporan detail
- `PUT /api/admin/laporan/:id/verifikasi` - Verify laporan
- `PUT /api/admin/laporan/:id/proses` - Process laporan
- `PUT /api/admin/laporan/:id/selesai` - Complete laporan
- `GET /api/laporan/me` - Get my laporan (user)
- `POST /api/laporan` - Create new laporan

### Content (Edukasi & Aktivitas)
- `GET /api/edukasi` - Get all edukasi
- `POST /api/edukasi` - Create edukasi (with file upload)
- `PUT /api/edukasi/:id` - Update edukasi
- `DELETE /api/edukasi/:id` - Delete edukasi
- `GET /api/aktivitas` - Get all aktivitas
- `POST /api/aktivitas` - Create aktivitas
- `PUT /api/aktivitas/:id` - Update aktivitas
- `DELETE /api/aktivitas/:id` - Delete aktivitas

### Notifications
- `GET /api/notifications/user` - Get notifications
- `GET /api/notifications/user/unread-count` - Get unread count
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/mark-all-read` - Mark all as read

### Profile
- `GET /api/profile` - Get current user profile
- `PUT /api/profile` - Update profile
- `POST /api/profile/picture` - Upload profile picture
- `PUT /api/profile/password` - Change password

---

## 💻 Contoh Penggunaan di Component

### Login
```typescript
import { login } from '@/lib/api';

const handleLogin = async () => {
  const response = await login(username, password);
  if (response.success) {
    router.push('/admin');
  } else {
    setError(response.message);
  }
};
```

### Get Laporan List
```typescript
import { getAdminLaporanList } from '@/lib/api';

const loadLaporan = async () => {
  const response = await getAdminLaporanList({
    page: 1,
    limit: 10,
    status: 'Dalam Proses'
  });
  
  if (response.success && response.data) {
    setLaporanList(response.data.data);
    setStats(response.data.statistics);
  }
};
```

### Verify Laporan
```typescript
import { verifyLaporan } from '@/lib/api';

const handleVerify = async (laporanId: number) => {
  const response = await verifyLaporan(laporanId, 'Catatan admin');
  if (response.success) {
    alert('Laporan berhasil diverifikasi');
    loadLaporan(); // Refresh data
  }
};
```

### Upload Content (Edukasi)
```typescript
import { createEdukasi } from '@/lib/api';

const handleUpload = async () => {
  const response = await createEdukasi({
    judul: 'Judul Edukasi',
    konten: 'Isi konten...',
    kategori: 'Kesehatan Mental',
    status: 'published',
    media: fileImage, // File object
    thumbnail: fileThumbnail
  });
  
  if (response.success) {
    alert('Konten berhasil di-upload');
  }
};
```

### Logout
```typescript
import { logout } from '@/lib/api';

const handleLogout = () => {
  logout(); // Clear token dari localStorage
  localStorage.removeItem('isLoggedIn');
  router.push('/');
};
```

---

## 🔐 Authentication Flow

1. User login dengan username/email dan password
2. Backend mengirim JWT token
3. Token disimpan di localStorage dengan key `jwt_token`
4. Setiap request otomatis include `Authorization: Bearer {token}`
5. Jika token invalid (401), user di-redirect ke login page

---

## 📊 Status Laporan

Backend menggunakan 5 status:
1. **Dalam Proses** - Laporan baru masuk (gray)
2. **Verifikasi** - Sedang diverifikasi admin (orange)
3. **Proses Tindak Lanjut** - Sedang ditindaklanjuti (blue)
4. **Selesai** - Laporan selesai ditangani (green)
5. **Ditolak** - Laporan ditolak (red)

---

## 🚀 Next Steps (Belum Diintegrasikan)

Halaman yang masih perlu integrasi API:

- [ ] Laporan Detail Page - integrate verifyLaporan, prosesLaporan, selesaikanLaporan
- [ ] Konten Page - integrate getAllEdukasi, getAllAktivitas
- [ ] Upload Konten Page - integrate createEdukasi, createAktivitas
- [ ] Notifikasi Page - integrate getNotifications, markAsRead
- [ ] Profile Page - integrate getProfile, updateProfile
- [ ] Statistik Page - integrate getStatistikLaporan
- [ ] Manajemen Pengguna Page - create user management API

---

## 🐛 Troubleshooting

### Login Gagal
- Pastikan backend running di `http://31.97.109.108:3000`
- Check network tab di browser developer tools
- Pastikan credentials benar

### Data Tidak Muncul
- Check console untuk error messages
- Pastikan token valid (belum expired)
- Check apakah API endpoint mengembalikan data yang benar

### CORS Error
- Pastikan backend sudah setup CORS dengan benar
- Pastikan origin Next.js diizinkan oleh backend

---

## 📝 Notes

- Folder `ppkpt_mobile` sudah bisa dihapus dari workspace web, semua API sudah diekstrak
- Token JWT disimpan di localStorage (untuk production sebaiknya gunakan httpOnly cookie)
- File upload menggunakan FormData dengan multipart/form-data
- Real-time notifications menggunakan Supabase (credentials sudah ada di .env.local)

---

**Dibuat:** 20 Januari 2026  
**Backend:** Express.js + MySQL  
**Frontend:** Next.js 16 + TypeScript + Tailwind CSS
