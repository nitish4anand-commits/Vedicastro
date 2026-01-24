# Vedic Astrology Kundli Website

A comprehensive, modern Vedic astrology (Kundli) website built with Next.js 14+, TypeScript, Tailwind CSS, and shadcn/ui.

## Features

- ✨ Free Kundli Generation with detailed birth chart analysis
- 💑 Kundli Matching (Gun Milan) for compatibility
- 🌟 Daily Horoscope for all zodiac signs
- 📅 Panchang (Hindu calendar) with auspicious timings
- 🔮 Dasha Predictions (Vimshottari & more)
- 🪐 Transit (Gochara) Predictions
- 🔢 Numerology Calculator
- 🎯 Dosha Analysis (Manglik, Kaal Sarp, etc.)
- 💎 Personalized Remedies & Gemstone Recommendations

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + shadcn/ui
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the website.

## Project Structure

```
├── app/                  # Next.js app directory
│   ├── (main)/          # Main site pages
│   ├── api/             # API routes
│   └── layout.tsx       # Root layout
├── components/          # Reusable components
│   ├── ui/             # shadcn/ui components
│   └── ...             # Feature components
├── lib/                # Utility functions
├── store/              # Zustand stores
└── types/              # TypeScript types
```

## API Integration

The website integrates with multiple free astrology APIs:
- VedicAstroAPI
- Prokerala API
- Free Astrology API
- AstrologyAPI.com

## Development

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## License

MIT

## Credits

Built with ❤️ using modern web technologies
