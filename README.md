# Backend KFA - Pharmacy Management System API

Backend API untuk sistem manajemen apotek yang dibangun dengan Node.js, Express, dan PostgreSQL.

## Teknologi yang Digunakan

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **Sequelize** - ORM
- **JWT** - Authentication
- **Bcrypt** - Password hashing

## Fitur Utama

- Authentication & Authorization
- User Management
- Master Data Management (Kategori Obat, Satuan, Supplier, dll)
- Medicine/Drug Management
- Transaction Management
- Purchase Management
- Stock History Tracking
- Activity Logging
- Employee Management
- Customer Management

## Instalasi

### Prerequisites

- Node.js (v14 atau lebih tinggi)
- PostgreSQL (v12 atau lebih tinggi)
- npm atau yarn

### Setup

1. Clone repository
```bash
git clone <repository-url>
cd backend-kfa
```

2. Install dependencies
```bash
npm install
```

3. Konfigurasi Database

Buat database PostgreSQL:
```sql
CREATE DATABASE kfa_db;
```

Edit file `src/config/database.json`:
```json
{
  "development": {
    "username": "your_username",
    "password": "your_password",
    "database": "kfa_db",
    "host": "127.0.0.1",
    "dialect": "postgres"
  }
}
```

4. Buat file `.env`:
```env
PORT=3000
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
```

5. Jalankan migrations
```bash
npx sequelize-cli db:migrate
```

6. Jalankan seeders (optional - untuk data demo)
```bash
npx sequelize-cli db:seed:all
```

## Menjalankan Aplikasi

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

Server akan berjalan di `http://localhost:3000`

## Data Demo (Seeders)

Jika Anda menjalankan seeders, berikut adalah credentials default:

| Username | Password | Role | Email |
|----------|----------|------|-------|
| admin | password123 | admin | admin@kfa.com |
| dokter | password123 | user | dokter@kfa.com |
| apoteker | password123 | user | apoteker@kfa.com |
| kasir | password123 | user | kasir@kfa.com |
| gudang | password123 | user | gudang@kfa.com |

---

# API Documentation

Base URL: `http://localhost:3000/api`

## Authentication

Semua endpoint (kecuali login dan register) memerlukan JWT token di header:
```
Authorization: Bearer <token>
```

### 1. Register

**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "username": "newuser",
  "email": "newuser@example.com",
  "password": "password123",
  "fullName": "New User",
  "role": "user"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 6,
    "username": "newuser",
    "email": "newuser@example.com",
    "fullName": "New User",
    "role": "user",
    "isActive": true
  }
}
```

### 2. Login

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "admin@kfa.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@kfa.com",
    "fullName": "Administrator",
    "role": "admin",
    "isActive": true,
    "pegawai": {
      "id": 1,
      "nip": "2024001",
      "nama": "Administrator",
      "jabatan": {
        "id": 1,
        "nama": "Direktur"
      },
      "unitKerja": {
        "id": 1,
        "nama": "Manajemen"
      }
    }
  }
}
```

### 3. Get Current User

**Endpoint:** `GET /api/auth/me`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": 1,
  "username": "admin",
  "email": "admin@kfa.com",
  "fullName": "Administrator",
  "role": "admin",
  "isActive": true,
  "pegawai": {
    "id": 1,
    "nip": "2024001",
    "nama": "Administrator",
    "jenisKelamin": "L",
    "jabatan": {
      "id": 1,
      "kode": "DIR",
      "nama": "Direktur"
    },
    "unitKerja": {
      "id": 1,
      "kode": "MNG",
      "nama": "Manajemen"
    }
  }
}
```

---

## Kategori Obat

### 1. Get All Kategori Obat

**Endpoint:** `GET /api/kategori-obat`

**Response (200):**
```json
[
  {
    "id": 1,
    "kode": "OBT-KRS",
    "nama": "Obat Keras",
    "deskripsi": "Obat yang hanya dapat diperoleh dengan resep dokter",
    "isActive": true,
    "createdAt": "2025-11-22T05:43:42.000Z",
    "updatedAt": "2025-11-22T05:43:42.000Z"
  }
]
```

### 2. Get Kategori Obat by ID

**Endpoint:** `GET /api/kategori-obat/:id`

**Response (200):**
```json
{
  "id": 1,
  "kode": "OBT-KRS",
  "nama": "Obat Keras",
  "deskripsi": "Obat yang hanya dapat diperoleh dengan resep dokter",
  "isActive": true,
  "createdAt": "2025-11-22T05:43:42.000Z",
  "updatedAt": "2025-11-22T05:43:42.000Z"
}
```

### 3. Create Kategori Obat

**Endpoint:** `POST /api/kategori-obat`

**Request Body:**
```json
{
  "kode": "OBT-NEW",
  "nama": "Kategori Baru",
  "deskripsi": "Deskripsi kategori baru",
  "isActive": true
}
```

**Response (201):**
```json
{
  "id": 8,
  "kode": "OBT-NEW",
  "nama": "Kategori Baru",
  "deskripsi": "Deskripsi kategori baru",
  "isActive": true,
  "createdAt": "2025-11-22T05:43:42.000Z",
  "updatedAt": "2025-11-22T05:43:42.000Z"
}
```

### 4. Update Kategori Obat

**Endpoint:** `PUT /api/kategori-obat/:id`

**Request Body:**
```json
{
  "nama": "Kategori Updated",
  "deskripsi": "Deskripsi yang diupdate"
}
```

**Response (200):**
```json
{
  "id": 8,
  "kode": "OBT-NEW",
  "nama": "Kategori Updated",
  "deskripsi": "Deskripsi yang diupdate",
  "isActive": true,
  "createdAt": "2025-11-22T05:43:42.000Z",
  "updatedAt": "2025-11-22T05:50:00.000Z"
}
```

### 5. Delete Kategori Obat

**Endpoint:** `DELETE /api/kategori-obat/:id`

**Response (200):**
```json
{
  "message": "Kategori obat deleted successfully"
}
```

---

## Satuan

Endpoint yang sama seperti Kategori Obat:
- `GET /api/satuan` - Get all
- `GET /api/satuan/:id` - Get by ID
- `POST /api/satuan` - Create
- `PUT /api/satuan/:id` - Update
- `DELETE /api/satuan/:id` - Delete

**Contoh Data:**
```json
{
  "id": 1,
  "kode": "STRIP",
  "nama": "Strip",
  "deskripsi": "Strip berisi 10 tablet/kapsul",
  "isActive": true
}
```

---

## Supplier

### 1. Get All Suppliers

**Endpoint:** `GET /api/supplier`

**Response (200):**
```json
[
  {
    "id": 1,
    "kode": "SUP001",
    "nama": "PT Kimia Farma Trading",
    "alamat": "Jl. Veteran No. 9, Jakarta Pusat",
    "kota": "Jakarta",
    "noTelp": "021-3841031",
    "email": "trading@kimiafarma.co.id",
    "kontak": "Divisi Trading",
    "isActive": true,
    "createdAt": "2025-11-22T05:43:42.000Z",
    "updatedAt": "2025-11-22T05:43:42.000Z"
  }
]
```

### 2. Create Supplier

**Endpoint:** `POST /api/supplier`

**Request Body:**
```json
{
  "kode": "SUP006",
  "nama": "PT Pharma Baru",
  "alamat": "Jl. Sudirman No. 123",
  "kota": "Jakarta",
  "noTelp": "021-1234567",
  "email": "info@pharmabaru.com",
  "kontak": "Sales Department",
  "isActive": true
}
```

---

## Golongan Obat

Endpoint yang sama seperti Kategori Obat:
- `GET /api/golongan-obat`
- `GET /api/golongan-obat/:id`
- `POST /api/golongan-obat`
- `PUT /api/golongan-obat/:id`
- `DELETE /api/golongan-obat/:id`

**Contoh Data:**
```json
{
  "id": 1,
  "kode": "ANLG",
  "nama": "Analgesik",
  "deskripsi": "Obat pereda nyeri",
  "isActive": true
}
```

---

## Bentuk Sediaan

Endpoint yang sama seperti Kategori Obat:
- `GET /api/bentuk-sediaan`
- `GET /api/bentuk-sediaan/:id`
- `POST /api/bentuk-sediaan`
- `PUT /api/bentuk-sediaan/:id`
- `DELETE /api/bentuk-sediaan/:id`

**Contoh Data:**
```json
{
  "id": 1,
  "kode": "TBL",
  "nama": "Tablet",
  "deskripsi": "Sediaan padat berbentuk tablet",
  "isActive": true
}
```

---

## Jabatan

Endpoint yang sama seperti Kategori Obat:
- `GET /api/jabatan`
- `GET /api/jabatan/:id`
- `POST /api/jabatan`
- `PUT /api/jabatan/:id`
- `DELETE /api/jabatan/:id`

**Contoh Data:**
```json
{
  "id": 1,
  "kode": "DIR",
  "nama": "Direktur",
  "deskripsi": "Direktur Apotek",
  "isActive": true
}
```

---

## Unit Kerja

Endpoint yang sama seperti Kategori Obat:
- `GET /api/unit-kerja`
- `GET /api/unit-kerja/:id`
- `POST /api/unit-kerja`
- `PUT /api/unit-kerja/:id`
- `DELETE /api/unit-kerja/:id`

**Contoh Data:**
```json
{
  "id": 1,
  "kode": "MNG",
  "nama": "Manajemen",
  "deskripsi": "Unit manajemen dan administrasi",
  "isActive": true
}
```

---

## Pegawai (Employee)

### 1. Get All Pegawai

**Endpoint:** `GET /api/pegawai`

**Response (200):**
```json
[
  {
    "id": 1,
    "userId": 1,
    "nip": "2024001",
    "nama": "Administrator",
    "jenisKelamin": "L",
    "tempatLahir": "Jakarta",
    "tanggalLahir": "1985-05-15",
    "alamat": "Jl. Merdeka No. 123, Jakarta",
    "noTelp": "081234567890",
    "email": "admin@kfa.com",
    "jabatanId": 1,
    "unitKerjaId": 1,
    "tanggalMasuk": "2020-01-01",
    "status": "aktif",
    "user": {
      "id": 1,
      "username": "admin",
      "email": "admin@kfa.com",
      "role": "admin",
      "isActive": true
    },
    "jabatan": {
      "id": 1,
      "nama": "Direktur"
    },
    "unitKerja": {
      "id": 1,
      "nama": "Manajemen"
    }
  }
]
```

### 2. Get Pegawai by ID

**Endpoint:** `GET /api/pegawai/:id`

### 3. Create Pegawai

**Endpoint:** `POST /api/pegawai`

**Request Body:**
```json
{
  "userId": 6,
  "nip": "2024006",
  "nama": "Pegawai Baru",
  "jenisKelamin": "L",
  "tempatLahir": "Bandung",
  "tanggalLahir": "1990-01-01",
  "alamat": "Jl. Contoh No. 123",
  "noTelp": "081234567890",
  "email": "pegawai@kfa.com",
  "jabatanId": 4,
  "unitKerjaId": 2,
  "tanggalMasuk": "2025-01-01",
  "status": "aktif"
}
```

### 4. Update Pegawai

**Endpoint:** `PUT /api/pegawai/:id`

**Request Body:**
```json
{
  "nama": "Nama Updated",
  "noTelp": "081234567899",
  "status": "non-aktif"
}
```

### 5. Delete Pegawai

**Endpoint:** `DELETE /api/pegawai/:id`

---

## Customer

### 1. Get All Customers

**Endpoint:** `GET /api/customer`

**Response (200):**
```json
[
  {
    "id": 1,
    "kode": "CUST001",
    "nama": "Budi Santoso",
    "noTelp": "081234567001",
    "alamat": "Jl. Raya Bogor No. 123, Jakarta",
    "email": "budi.santoso@email.com",
    "tanggalLahir": "1980-01-15",
    "jenisKelamin": "L",
    "isActive": true,
    "createdAt": "2025-11-22T05:43:42.000Z",
    "updatedAt": "2025-11-22T05:43:42.000Z"
  }
]
```

### 2. Create Customer

**Endpoint:** `POST /api/customer`

**Request Body:**
```json
{
  "kode": "CUST011",
  "nama": "Customer Baru",
  "noTelp": "081234567890",
  "alamat": "Jl. Contoh No. 123",
  "email": "customer@email.com",
  "tanggalLahir": "1990-01-01",
  "jenisKelamin": "L",
  "isActive": true
}
```

### 3. Update Customer

**Endpoint:** `PUT /api/customer/:id`

### 4. Delete Customer

**Endpoint:** `DELETE /api/customer/:id`

---

## Obat (Medicine/Drug)

### 1. Get All Obat

**Endpoint:** `GET /api/obat`

**Response (200):**
```json
[
  {
    "id": 1,
    "kodeObat": "OBT001",
    "namaObat": "Paracetamol 500mg",
    "kategoriObatId": 3,
    "satuanId": 1,
    "golonganObatId": 2,
    "bentukSediaanId": 1,
    "supplierId": null,
    "stok": 100,
    "stokMinimal": 20,
    "hargaBeli": "5000.00",
    "hargaJual": "7500.00",
    "tanggalKadaluarsa": "2026-12-31",
    "noBatch": null,
    "deskripsi": "Obat penurun panas dan pereda nyeri",
    "isActive": true,
    "kategoriObat": {
      "id": 3,
      "nama": "Obat Bebas"
    },
    "satuan": {
      "id": 1,
      "nama": "Strip"
    },
    "golonganObat": {
      "id": 2,
      "nama": "Antipiretik"
    },
    "bentukSediaan": {
      "id": 1,
      "nama": "Tablet"
    },
    "supplier": null
  }
]
```

### 2. Get Obat by ID

**Endpoint:** `GET /api/obat/:id`

### 3. Create Obat

**Endpoint:** `POST /api/obat`

**Request Body:**
```json
{
  "kodeObat": "OBT011",
  "namaObat": "Obat Baru 100mg",
  "kategoriObatId": 3,
  "satuanId": 1,
  "golonganObatId": 2,
  "bentukSediaanId": 1,
  "supplierId": 1,
  "stok": 50,
  "stokMinimal": 10,
  "hargaBeli": 10000,
  "hargaJual": 15000,
  "tanggalKadaluarsa": "2026-12-31",
  "noBatch": "BATCH001",
  "deskripsi": "Deskripsi obat baru",
  "isActive": true
}
```

### 4. Update Obat

**Endpoint:** `PUT /api/obat/:id`

**Request Body:**
```json
{
  "namaObat": "Obat Updated 100mg",
  "hargaJual": 16000,
  "stok": 60
}
```

### 5. Delete Obat

**Endpoint:** `DELETE /api/obat/:id`

---

## Transaksi (Sales Transaction)

### 1. Get All Transaksi

**Endpoint:** `GET /api/transaksi`

**Response (200):**
```json
[
  {
    "id": 1,
    "nomorTransaksi": "TRX-20251122-001",
    "tanggalTransaksi": "2025-11-22",
    "customerId": 1,
    "userId": 4,
    "totalHarga": "75000.00",
    "diskon": "0.00",
    "pajak": "7500.00",
    "totalBayar": "82500.00",
    "metodePembayaran": "cash",
    "statusTransaksi": "selesai",
    "keterangan": null,
    "customer": {
      "id": 1,
      "nama": "Budi Santoso"
    },
    "user": {
      "id": 4,
      "username": "kasir",
      "fullName": "Kasir Apotek"
    },
    "detailTransaksi": [
      {
        "id": 1,
        "obatId": 1,
        "jumlah": 10,
        "hargaSatuan": "7500.00",
        "subtotal": "75000.00",
        "obat": {
          "id": 1,
          "namaObat": "Paracetamol 500mg"
        }
      }
    ]
  }
]
```

### 2. Get Transaksi by ID

**Endpoint:** `GET /api/transaksi/:id`

### 3. Create Transaksi

**Endpoint:** `POST /api/transaksi`

**Request Body:**
```json
{
  "customerId": 1,
  "tanggalTransaksi": "2025-11-22",
  "metodePembayaran": "cash",
  "diskon": 0,
  "pajak": 7500,
  "keterangan": "Transaksi kasir",
  "detailTransaksi": [
    {
      "obatId": 1,
      "jumlah": 10,
      "hargaSatuan": 7500
    },
    {
      "obatId": 2,
      "jumlah": 5,
      "hargaSatuan": 22000
    }
  ]
}
```

**Response (201):**
```json
{
  "id": 2,
  "nomorTransaksi": "TRX-20251122-002",
  "tanggalTransaksi": "2025-11-22",
  "customerId": 1,
  "userId": 4,
  "totalHarga": "185000.00",
  "diskon": "0.00",
  "pajak": "7500.00",
  "totalBayar": "192500.00",
  "metodePembayaran": "cash",
  "statusTransaksi": "selesai",
  "detailTransaksi": [...]
}
```

**Note:** Stok obat akan otomatis dikurangi dan dicatat di riwayat stok.

### 4. Update Transaksi Status

**Endpoint:** `PUT /api/transaksi/:id`

**Request Body:**
```json
{
  "statusTransaksi": "dibatalkan",
  "keterangan": "Dibatalkan oleh customer"
}
```

### 5. Delete Transaksi

**Endpoint:** `DELETE /api/transaksi/:id`

---

## Pembelian Obat (Purchase)

### 1. Get All Pembelian

**Endpoint:** `GET /api/pembelian-obat`

**Response (200):**
```json
[
  {
    "id": 1,
    "nomorPembelian": "PO-20251122-001",
    "tanggalPembelian": "2025-11-22",
    "supplierId": 1,
    "userId": 5,
    "totalHarga": "500000.00",
    "statusPembelian": "selesai",
    "keterangan": "Pembelian rutin bulanan",
    "supplier": {
      "id": 1,
      "nama": "PT Kimia Farma Trading"
    },
    "user": {
      "id": 5,
      "username": "gudang",
      "fullName": "Staff Gudang"
    },
    "detailPembelian": [
      {
        "id": 1,
        "obatId": 1,
        "jumlah": 100,
        "hargaBeli": "5000.00",
        "subtotal": "500000.00",
        "obat": {
          "id": 1,
          "namaObat": "Paracetamol 500mg"
        }
      }
    ]
  }
]
```

### 2. Create Pembelian

**Endpoint:** `POST /api/pembelian-obat`

**Request Body:**
```json
{
  "supplierId": 1,
  "tanggalPembelian": "2025-11-22",
  "keterangan": "Pembelian stok obat",
  "detailPembelian": [
    {
      "obatId": 1,
      "jumlah": 50,
      "hargaBeli": 5000
    },
    {
      "obatId": 2,
      "jumlah": 30,
      "hargaBeli": 15000
    }
  ]
}
```

**Note:** Stok obat akan otomatis bertambah dan dicatat di riwayat stok.

### 3. Update Pembelian Status

**Endpoint:** `PUT /api/pembelian-obat/:id`

### 4. Delete Pembelian

**Endpoint:** `DELETE /api/pembelian-obat/:id`

---

## Riwayat Stok (Stock History)

### 1. Get All Riwayat Stok

**Endpoint:** `GET /api/riwayat-stok`

**Query Parameters:**
- `obatId` - Filter by obat ID
- `jenisTransaksi` - Filter by transaction type (masuk/keluar/penyesuaian)
- `tanggalDari` - Start date filter
- `tanggalSampai` - End date filter

**Response (200):**
```json
[
  {
    "id": 1,
    "obatId": 1,
    "jenisTransaksi": "keluar",
    "jumlah": 10,
    "stokSebelum": 100,
    "stokSesudah": 90,
    "keterangan": "Penjualan - TRX-20251122-001",
    "userId": 4,
    "tanggal": "2025-11-22T10:30:00.000Z",
    "obat": {
      "id": 1,
      "kodeObat": "OBT001",
      "namaObat": "Paracetamol 500mg"
    },
    "user": {
      "id": 4,
      "username": "kasir",
      "fullName": "Kasir Apotek"
    }
  }
]
```

### 2. Get Stock History by Obat

**Endpoint:** `GET /api/riwayat-stok?obatId=1`

---

## Activity Logs

### 1. Get All Activity Logs

**Endpoint:** `GET /api/activity-logs`

**Query Parameters:**
- `user_id` - Filter by user ID
- `method` - Filter by HTTP method (GET/POST/PUT/DELETE)
- `endpoint` - Filter by endpoint
- `date_from` - Start date
- `date_to` - End date
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 50)

**Response (200):**
```json
{
  "logs": [
    {
      "id": 1,
      "user_id": 1,
      "action": "Login",
      "method": "POST",
      "endpoint": "/api/auth/login",
      "ip_address": "127.0.0.1",
      "user_agent": "PostmanRuntime/7.26.8",
      "request_body": "{\"username\":\"admin\"}",
      "query_params": null,
      "response_status": 200,
      "response_time": 145,
      "error_message": null,
      "createdAt": "2025-11-22T10:30:00.000Z",
      "user": {
        "id": 1,
        "username": "admin",
        "fullName": "Administrator"
      }
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalLogs": 250,
    "limit": 50
  }
}
```

### 2. Get Activity Stats

**Endpoint:** `GET /api/activity-logs/stats`

**Response (200):**
```json
{
  "totalLogs": 1500,
  "logsByMethod": {
    "GET": 800,
    "POST": 400,
    "PUT": 200,
    "DELETE": 100
  },
  "logsByStatus": {
    "200": 1200,
    "201": 150,
    "400": 80,
    "401": 50,
    "500": 20
  },
  "mostActiveUsers": [
    {
      "user_id": 1,
      "username": "admin",
      "fullName": "Administrator",
      "count": 500
    }
  ],
  "recentErrors": [
    {
      "id": 100,
      "endpoint": "/api/obat",
      "method": "POST",
      "response_status": 500,
      "error_message": "Database connection error",
      "createdAt": "2025-11-22T10:30:00.000Z"
    }
  ]
}
```

### 3. Cleanup Old Logs

**Endpoint:** `DELETE /api/activity-logs/cleanup`

**Query Parameters:**
- `days` - Delete logs older than X days (default: 30)

**Response (200):**
```json
{
  "message": "Old activity logs deleted successfully",
  "deletedCount": 500
}
```

---

## User Management

### 1. Get All Users

**Endpoint:** `GET /api/users`

**Response (200):**
```json
[
  {
    "id": 1,
    "username": "admin",
    "email": "admin@kfa.com",
    "fullName": "Administrator",
    "role": "admin",
    "isActive": true,
    "createdAt": "2025-11-22T05:43:42.000Z",
    "updatedAt": "2025-11-22T05:43:42.000Z"
  }
]
```

### 2. Get User by ID

**Endpoint:** `GET /api/users/:id`

### 3. Create User

**Endpoint:** `POST /api/users`

**Request Body:**
```json
{
  "username": "newuser",
  "email": "newuser@kfa.com",
  "password": "password123",
  "fullName": "New User",
  "role": "user",
  "isActive": true
}
```

### 4. Update User

**Endpoint:** `PUT /api/users/:id`

**Request Body:**
```json
{
  "fullName": "Updated Name",
  "email": "updated@kfa.com",
  "isActive": false
}
```

### 5. Delete User

**Endpoint:** `DELETE /api/users/:id`

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Validation error",
  "errors": [
    "Username is required",
    "Email must be valid"
  ]
}
```

### 401 Unauthorized
```json
{
  "message": "Invalid credentials"
}
```

atau

```json
{
  "message": "No token provided"
}
```

### 403 Forbidden
```json
{
  "message": "Access denied. Admin only."
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Internal server error",
  "error": "Error details..."
}
```

---

## Status Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Authentication failed |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error - Server error |

---

## Notes

1. Semua endpoint yang memodifikasi data (POST, PUT, DELETE) memerlukan autentikasi
2. Activity logs akan otomatis dicatat untuk setiap request
3. Transaksi dan Pembelian akan otomatis mengupdate stok dan mencatat riwayat stok
4. Foreign key constraints dijaga untuk menjaga integritas data
5. Soft delete dapat diimplementasikan dengan menggunakan field `isActive`

---

## Development

### Format Code
```bash
npm run format
```

### Run Tests (jika sudah dibuat)
```bash
npm test
```

### Database Commands

Reset database:
```bash
npx sequelize-cli db:migrate:undo:all
npx sequelize-cli db:migrate
```

Reset seeders:
```bash
npx sequelize-cli db:seed:undo:all
npx sequelize-cli db:seed:all
```

---

## License

ISC

## Contact

Untuk pertanyaan atau bantuan, silakan hubungi tim development.
# be-kfa
