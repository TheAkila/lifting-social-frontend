# 🚀 Lifting Social Frontend - Installation & Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** package manager
- **Git** - [Download](https://git-scm.com/)

## 📥 Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/TheAkila/lifting-social-frontend.git
cd lifting-social-frontend
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- Axios
- React Hook Form
- Zod
- And more...

### 3. Environment Configuration

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your actual configuration values:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# PayHere Payment Gateway
NEXT_PUBLIC_PAYHERE_MERCHANT_ID=your_merchant_id_here
PAYHERE_MERCHANT_SECRET=your_secret_here

# Optional: Firebase for media storage
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
```

### 4. Run Development Server

```bash
npm run dev
```

The application will start at: **http://localhost:3000**

### 5. Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
lifting-social-frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   ├── providers.tsx      # Context providers
│   │   ├── globals.css        # Global styles
│   │   └── shop/              # Shop pages
│   ├── components/            # React components
│   │   ├── home/             # Home page components
│   │   ├── shop/             # Shop components
│   │   └── layout/           # Layout components
│   ├── contexts/             # React Context
│   │   ├── AuthContext.tsx
│   │   └── CartContext.tsx
│   ├── lib/                  # Utilities
│   │   ├── api.ts           # API client
│   │   └── utils.ts         # Helper functions
│   └── types/                # TypeScript types
│       └── index.ts
├── public/                    # Static assets
├── .env.example              # Environment template
├── .gitignore
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

## 🎨 Key Features Implemented

### ✅ Home Page
- Animated hero section with gradient effects
- Featured products carousel
- Athlete highlights section
- Statistics showcase
- Latest stories section
- Call-to-action sections

### ✅ E-Commerce Shop
- Product listing page
- Advanced filtering system (category, size, price)
- Product grid with hover effects
- Sorting options
- Wishlist functionality
- Quick add to cart

### ✅ Layout Components
- Responsive navigation bar with cart indicator
- Footer with social media links
- Mobile menu with animations

### ✅ Context & State Management
- Authentication context (login, signup, logout)
- Shopping cart context (add, remove, update)
- Persistent cart storage (localStorage)

### ✅ Design System
- Custom Tailwind configuration
- Brand color palette
- Reusable component classes
- Responsive typography
- Animation utilities

## 🛠️ Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run type checking
npm run type-check

# Run linting
npm run lint
```

## 🔗 Key Technologies

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library
- **Axios**: HTTP client
- **React Hook Form**: Form validation
- **Zod**: Schema validation
- **Zustand**: State management (if needed)

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Mobile devices (320px+)
- Tablets (768px+)
- Desktop (1024px+)
- Large screens (1280px+)

## 🎯 Next Steps

### To Complete the Application:

1. **Backend API Integration**
   - Connect to actual backend endpoints
   - Implement real authentication
   - Add product data fetching

2. **Additional Pages**
   - Product detail page
   - Shopping cart page
   - Checkout page
   - User dashboard
   - Admin dashboard
   - Stories/blog pages
   - Athlete profiles
   - Coaching section
   - About/Contact pages

3. **Payment Integration**
   - PayHere payment gateway
   - Order processing
   - Payment confirmation

4. **Media Features**
   - Image upload to Firebase
   - Video embeds (YouTube)
   - Story/blog content management

5. **Advanced Features**
   - Search functionality
   - User reviews
   - Email notifications
   - Order tracking
   - Social sharing

## 🐛 Troubleshooting

### Dependencies Installation Issues
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors
The project uses strict TypeScript. Some errors are expected until dependencies are installed:
```bash
npm install
```

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev
```

## 📞 Support

For issues or questions:
- GitHub Issues: [Create an issue](https://github.com/TheAkila/lifting-social-frontend/issues)
- Email: info@liftingsocial.lk

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/NewFeature`)
3. Commit your changes (`git commit -m 'Add NewFeature'`)
4. Push to branch (`git push origin feature/NewFeature`)
5. Open a Pull Request

---

**Built with 💪 in Sri Lanka for the Olympic Weightlifting Community**
