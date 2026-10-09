# PC Configurator

A React application for browsing PC components and planning a custom build. The current project includes an interactive product catalog, reusable UI components, sample reviews, and mock product data.

## Features

- Header with navigation, theme toggle, demo login, and user profile.
- Catalog search, category filtering, sorting, and pagination.
- Product cards with ratings, quantity controls, favorites, and cart actions.
- Product quick-view modal with add-to-cart and buy-now actions.
- Catalog statistics and customer review sections.
- Footer with social links.

Product data is static and stored in `src/data/products.js`. Authentication and checkout are demonstrations only; there is no backend or persistent storage. Product images and profile images use external URLs.

## Tech Stack

- React 19
- Vite 8
- JavaScript and JSX
- ESLint

## Getting Started

Install Node.js and npm. Run the commands from the project root, where `package.json` is located:

```bash
npm install
npm run dev
```

Vite prints the local development URL in the terminal.

## Scripts

| Command           | Description                           |
| ----------------- | ------------------------------------- |
| `npm run dev`     | Start the development server with HMR |
| `npm run build`   | Create a production build in `dist/`  |
| `npm run preview` | Preview the production build locally  |
| `npm run lint`    | Run ESLint                            |

## Project Structure

```text
src/
├── components/
│   ├── Badge/
│   ├── Button/
│   ├── Card/
│   ├── CategoryFilter/
│   ├── Container/
│   ├── Footer/
│   ├── HeroSection/
│   ├── Logo/
│   ├── Modal/
│   ├── Navigation/
│   ├── Pagination/
│   ├── RatingStars/
│   ├── SearchBar/
│   ├── SectionHeader/
│   ├── SortDropdown/
│   ├── StatCard/
│   ├── TestimonialCard/
│   └── UserProfile/
├── data/
│   └── products.js
├── App.jsx
├── App.css
├── index.css
└── main.jsx
```

`App.jsx` composes the page and manages its state. `main.jsx` mounts the React application. `App.css` and `index.css` contain application and base styles. `products.js` exports the product categories and sample catalog.

## Reusable Components

The application uses components for layout, buttons, badges, product cards, category filtering, the footer, hero section, logo, modal, navigation, pagination, ratings, search, section headings, sorting, statistics, testimonials, and the user profile.

## Product Data

`src/data/products.js` exports:

- `CATEGORIES` — product category names.
- `mockProducts` — sample products with `id`, `name`, `category`, `price`, `image`, `description`, `rating`, and `reviewsCount` fields.

Prices are displayed in Kazakhstani tenge (₸).
