# BrindaRani Backend API

## Setup

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Create `.env` file** (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

3. **Configure MongoDB Atlas:**
   - Go to [MongoDB Atlas](https://cloud.mongodb.com/)
   - Create a free cluster
   - Create a database user
   - Get your connection string and paste it in `.env` as `MONGODB_URI`
   - Add your IP to the whitelist (or allow all: `0.0.0.0/0`)

4. **Create uploads folder:**
   ```bash
   mkdir uploads
   ```

5. **Seed categories:**
   ```bash
   node seed.js
   ```

6. **Start the server:**
   ```bash
   npm run dev
   ```

## API Endpoints

### Auth
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register user | No |
| POST | `/api/auth/login` | Login user | No |
| POST | `/api/auth/admin-login` | Admin login | No |
| GET | `/api/auth/me` | Get current user | Yes |
| PUT | `/api/auth/profile` | Update profile | Yes |

### Products
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/products` | Get all products | No |
| GET | `/api/products/:id` | Get single product | No |
| POST | `/api/products` | Create product | Admin |
| PUT | `/api/products/:id` | Update product | Admin |
| DELETE | `/api/products/:id` | Delete product | Admin |

**Query params:** `?category=Puja Items&search=mala&trending=true&latest=true&sort=price-low`

### Categories
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/categories` | Get all categories | No |
| POST | `/api/categories` | Create category | Admin |
| PUT | `/api/categories/:id` | Update category | Admin |
| DELETE | `/api/categories/:id` | Delete category | Admin |

### Orders
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/orders` | Get orders (user's own or all for admin) | Yes |
| POST | `/api/orders` | Create order | Yes |
| PUT | `/api/orders/:id/status` | Update order status | Admin |

### Users (Admin)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/users` | Get all users | Admin |
| PUT | `/api/users/:id/toggle-block` | Toggle block | Admin |

### Upload
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/upload` | Upload images (multipart) | Admin |

## Frontend Configuration

Set your backend URL in the frontend:
```
src/services/api.ts → API_BASE_URL = 'http://localhost:5000/api'
```
