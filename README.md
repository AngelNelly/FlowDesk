# Flowdesk - Business Management Platform

> **"Built for Africans, by Africans"** - A comprehensive digital record-keeping and business management tool for African SMEs.

## 🌍 Overview

Flowdesk is a full-stack SaaS platform designed specifically for Small and Medium Enterprises (SMEs) in Africa. It provides a complete business management solution with offline-first capabilities, mobile responsiveness, and features tailored for African business needs.

## ✨ Features

### 🏢 Core Business Management
- **Inventory Management** - Track products, stock levels, categories, and variants
- **Sales Tracking** - Record sales, manage transactions, and track performance
- **Invoice Management** - Create, send, and track invoices with customizable templates
- **Customer Relationship Management** - Manage customer profiles, purchase history, and loyalty
- **Appointment Scheduling** - Calendar-based booking system with reminders
- **Expense Tracking** - Record and categorize business expenses

### 📊 Analytics & Reporting
- Real-time dashboard with key business metrics
- Sales trends and performance analytics
- Inventory reports and low-stock alerts
- Customer insights and purchase patterns
- Financial reports and profit/loss tracking
- Exportable reports (PDF, CSV, Excel)

### 🎨 Customization & Branding
- Custom business branding (logo, colors, themes)
- Multiple invoice templates
- Dark/Light mode support
- Multi-language support (English, Swahili, Hausa, Yoruba, Igbo)
- Multi-currency support (NGN, KES, GHS, ZAR, USD, EUR)

### 📱 Mobile & Offline Support
- Progressive Web App (PWA) with offline functionality
- Mobile-first responsive design
- Offline data sync with IndexedDB
- Service Worker for background sync
- Push notifications support

### 🔐 Security & Authentication
- JWT-based authentication
- Role-based access control (Owner, Admin, Staff)
- Data encryption and secure API endpoints
- Rate limiting and security headers

## 🛠️ Technology Stack

### Frontend
- **React.js** - Modern UI framework
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icons
- **Recharts** - Data visualization
- **React Router** - Client-side routing

### Backend
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing

### Additional Tools
- **IndexedDB** - Offline storage
- **Service Workers** - Background sync
- **Stripe/Paystack** - Payment processing
- **Nodemailer** - Email services
- **Multer** - File uploads

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/flowdesk.git
cd flowdesk
```

2. **Install dependencies**
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
```

3. **Environment Setup**
```bash
# Copy environment file
cp server/.env.example server/.env

# Edit the .env file with your configuration
```

4. **Start the application**
```bash
# Start backend server (from server directory)
npm run dev

# Start frontend (from root directory)
npm run dev
```

5. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Health Check: http://localhost:5000/api/health

## 📁 Project Structure

```
flowdesk/
├── src/                    # Frontend source code
│   ├── components/         # Reusable UI components
│   ├── pages/             # Page components
│   ├── contexts/          # React contexts
│   ├── hooks/             # Custom hooks
│   ├── services/          # API services
│   ├── utils/             # Utility functions
│   └── types/             # TypeScript types
├── server/                # Backend source code
│   ├── controllers/       # Route controllers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── config/           # Configuration files
│   └── server.js         # Server entry point
├── public/               # Static assets
└── docs/                 # Documentation
```

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```env
# Database
MONGODB_URI=mongodb://localhost:27017/flowdesk

# JWT
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d

# Server
PORT=5000
NODE_ENV=development

# Payment Gateways
STRIPE_SECRET_KEY=sk_test_your_stripe_key
PAYSTACK_SECRET_KEY=sk_test_your_paystack_key

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

**Frontend (.env)**
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Flowdesk
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
VITE_PAYSTACK_PUBLIC_KEY=pk_test_your_paystack_key
```

## 📱 PWA Features

Flowdesk is built as a Progressive Web App with:

- **Offline Functionality** - Works without internet connection
- **App-like Experience** - Can be installed on mobile devices
- **Background Sync** - Syncs data when connection is restored
- **Push Notifications** - Real-time business alerts
- **Responsive Design** - Optimized for all screen sizes

## 🌍 Localization

Supported languages and currencies:

**Languages:**
- English (en)
- Swahili (sw)
- Hausa (ha)
- Yoruba (yo)
- Igbo (ig)

**Currencies:**
- Nigerian Naira (NGN)
- Kenyan Shilling (KES)
- Ghanaian Cedi (GHS)
- South African Rand (ZAR)
- US Dollar (USD)
- Euro (EUR)

## 🔒 Security Features

- **Authentication** - JWT-based secure authentication
- **Authorization** - Role-based access control
- **Data Protection** - Encrypted sensitive data
- **Rate Limiting** - API request rate limiting
- **CORS** - Cross-origin resource sharing protection
- **Helmet** - Security headers middleware

## 📊 API Documentation

### Authentication Endpoints
```
POST /api/auth/register    # User registration
POST /api/auth/login       # User login
GET  /api/auth/me          # Get current user
PUT  /api/auth/updatedetails # Update user profile
POST /api/auth/forgotpassword # Password reset
```

### Business Endpoints
```
GET    /api/products       # Get all products
POST   /api/products       # Create product
PUT    /api/products/:id   # Update product
DELETE /api/products/:id   # Delete product

GET    /api/customers      # Get all customers
POST   /api/customers      # Create customer
PUT    /api/customers/:id  # Update customer

GET    /api/invoices       # Get all invoices
POST   /api/invoices       # Create invoice
PUT    /api/invoices/:id   # Update invoice

GET    /api/sales          # Get all sales
POST   /api/sales          # Create sale
GET    /api/sales/analytics # Get sales analytics
```

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)
```bash
# Build the frontend
npm run build

# Deploy to Vercel
vercel --prod

# Or deploy to Netlify
netlify deploy --prod --dir=dist
```

### Backend Deployment (Render/DigitalOcean)
```bash
# Set environment variables
# Deploy using your preferred platform
```

### Database (MongoDB Atlas)
1. Create a MongoDB Atlas cluster
2. Get connection string
3. Update MONGODB_URI in environment variables

## 🧪 Testing

```bash
# Run frontend tests
npm test

# Run backend tests
cd server && npm test

# Run e2e tests
npm run test:e2e
```

## 📈 Performance Optimization

- **Code Splitting** - Lazy loading of components
- **Image Optimization** - Compressed and responsive images
- **Caching** - Service Worker caching strategies
- **Bundle Optimization** - Tree shaking and minification
- **Database Indexing** - Optimized MongoDB queries

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with love for African SMEs
- Inspired by the need for accessible business tools
- Community-driven development approach

## 📞 Support

- **Email**: support@flowdesk.com
- **Documentation**: https://docs.flowdesk.com
- **Community**: https://community.flowdesk.com

---

**Flowdesk** - *Digitize. Grow. Succeed.*