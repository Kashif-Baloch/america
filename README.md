bun dev

# America Working

A modern, multilingual web application built with Next.js, designed to provide information and services related to working in America. The project supports English, Spanish, and Portuguese, and features a modular, scalable architecture.

## Features

- **Next.js 15+**: App Router, server components, and modern React features.
- **Multilingual Support**: English, Spanish, and Portuguese translations.
- **Authentication**: Modular auth system (see `src/app/[locale]/(auth)`).
- **Responsive UI**: Custom components and reusable UI elements.
- **Data-driven Pages**: Dynamic content for About, Contact, FAQ, Pricing, Visa Process, and more.
- **Custom Fonts**: SF Pro font family included.
- **Image Optimization**: Uses Next.js image optimization for fast loading.

## Project Structure

```
america-working/
├── messages/           # Translation files (en, es, pt)
├── public/images/      # Static images
├── src/
│   ├── app/            # Next.js app directory (routing, layouts, pages)
│   ├── components/     # UI and page components
│   ├── Data/           # Data for cards, FAQ, pricing, etc.
│   ├── Fonts/          # Custom font files
│   ├── Forms/          # Form components (Contact, Login, Signup)
│   ├── hooks/          # Custom React hooks
│   ├── i18n/           # Internationalization logic
│   ├── lib/            # Utility functions
│   ├── styles/         # Global and component styles
│   └── utils/          # Icons and constants
├── package.json        # Project metadata and scripts
├── next.config.ts      # Next.js configuration
├── tsconfig.json       # TypeScript configuration
└── ...
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [pnpm](https://pnpm.io/) (or npm/yarn)

### Installation

```powershell
# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

The app will be available at `http://localhost:3000`.

### Build for Production

```powershell
pnpm build
pnpm start
```

## Scripts

- `pnpm dev` – Start the development server
- `pnpm build` – Build for production
- `pnpm start` – Start the production server
- `pnpm lint` – Run ESLint

## Internationalization

Translation files are located in `messages/` and i18n logic in `src/i18n/`.

## Customization

- **Add new pages**: Create a new folder in `src/app/[locale]/(main)/`.
- **Add translations**: Update the corresponding JSON file in `messages/`.
- **Update UI**: Edit or add components in `src/components/`.

## License

This project is for demonstration and educational purposes. For commercial use, please contact the author.

---

**America Working** – Empowering your journey to work in America.

```

```
