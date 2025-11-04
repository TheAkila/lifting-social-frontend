# Lifting Social - Frontend

🏋️ **A lifestyle brand fusing Olympic weightlifting culture, Sri Lankan athletic pride, and modern fitness fashion.**

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-ff0055)

## 🌟 Features

### 🏠 Home Page
- Animated hero section with call-to-action
- Featured products carousel
- Athlete highlight reel with video backgrounds
- Statistics showcase
- Latest stories section

### 🛍️ E-Commerce Shop
- Product listing with advanced filters
- Product detail pages with size charts
- Shopping cart & wishlist
- Secure checkout with PayHere integration
- Order tracking & history
- Admin dashboard for inventory management

### 📰 Media & Stories
- Blog system with markdown support
- Athlete interviews & profiles
- Event coverage & highlights
- YouTube embed support
- Social media integration

### 👥 Community & Athletes
- Athlete profile pages (bio, stats, achievements)
- Featured lifters gallery
- Event calendar
- Ambassador signup forms

### 🎓 Coaching Section
- Coach profiles & specializations
- Booking/inquiry system
- Training programs showcase

### 🔐 Authentication
- JWT-based login/signup
- User dashboard (orders, profile, saved items)
- Admin dashboard (products, posts, athletes)

### 📱 Additional Pages
- About Us (brand story & mission)
- Contact form
- Partnership application
- Privacy policy & terms

## 🚀 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **State Management:** Zustand
- **Forms:** React Hook Form + Zod
- **HTTP Client:** Axios
- **Icons:** React Icons
- **Markdown:** React Markdown

## 📦 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/TheAkila/lifting-social-frontend.git
   cd lifting-social-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your actual values
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (routes)/          # Route groups
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── home/             # Home page components
│   ├── shop/             # E-commerce components
│   ├── layout/           # Layout components (Navbar, Footer)
│   └── ui/               # Reusable UI components
├── contexts/             # React Context providers
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── types/                # TypeScript type definitions
└── styles/               # Additional styles
```

## 🎨 Design System

### Brand Colors
- **Primary:** `#E63946` (Bold Red - Energy & Power)
- **Secondary:** `#1D3557` (Deep Navy - Sophistication)
- **Accent:** `#F4A261` (Sri Lankan Gold/Saffron)
- **Dark:** `#0A0E27` (Background)
- **Light:** `#F8F9FA` (Text)

### Typography
- **Display Font:** Montserrat (headings)
- **Body Font:** Inter (content)

## 🔧 Development Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Linting
npm run lint
```

## 🌐 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Manual Deployment
```bash
# Build the project
npm run build

# The output will be in the .next folder
# Deploy the .next folder to your hosting service
```

## 📝 Environment Variables

See `.env.example` for all required environment variables.

Key variables:
- `NEXT_PUBLIC_API_URL` - Backend API URL
- `NEXT_PUBLIC_PAYHERE_MERCHANT_ID` - PayHere payment gateway credentials
- Firebase configuration (if using Firebase for media storage)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is proprietary and confidential.

## 📞 Contact

**Lifting Social**
- Website: [liftingsocial.lk](https://liftingsocial.lk)
- Email: info@liftingsocial.lk
- Instagram: [@liftingsocial](https://instagram.com/liftingsocial)

---

Built with 💪 in Sri Lanka
