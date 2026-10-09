import { useState, useEffect } from "react";
import "./App.css";

import Container from "./components/Container/Container";
import HeroSection from "./components/HeroSection/HeroSection";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import CatalogSection from "./components/CatalogSection/CatalogSection";
import StatsSection from "./components/StatsSection/StatsSection";
import ReviewsSection from "./components/ReviewsSection/ReviewsSection";
import AuthPromptModal from "./components/AuthPromptModal/AuthPromptModal";
import ProductDetailsModal from "./components/ProductDetailsModal/ProductDetailsModal";

import { CATEGORIES, mockProducts } from "./data/products";
import logoAsset from "./assets/logo.svg";

// Данные для подвала и блока отзывов.
const socialLinks = [
  { platform: "Instagram", url: "https://instagram.com", icon: "◎" },
  { platform: "Telegram", url: "https://t.me", icon: "➤" },
  { platform: "YouTube", url: "https://youtube.com", icon: "▶" },
];

const testimonials = [
  {
    id: 1,
    authorName: "Alex",
    authorRole: "Gamer",
    avatar: "https://i.pravatar.cc/80?img=12",
    text: "I found the components I needed for a balanced gaming PC.",
    date: "2026-09-20",
    rating: 5,
  },
  {
    id: 2,
    authorName: "Maria",
    authorRole: "Video Editor",
    avatar: "https://i.pravatar.cc/80?img=47",
    text: "The catalog made it easy to compare compatible components.",
    date: "2026-09-24",
    rating: 4,
  },
];

const isValidCartItem = (item) =>
  item !== null &&
  typeof item === "object" &&
  Number.isInteger(item.id) &&
  typeof item.name === "string" &&
  Number.isInteger(item.quantity) &&
  item.quantity > 0;

const isValidFavoriteId = (productId) => Number.isInteger(productId);

function readStoredArray(key, isValidItem) {
  try {
    const storedValue = window.localStorage.getItem(key);
    if (storedValue === null) return [];

    const parsedValue = JSON.parse(storedValue);
    if (
      !Array.isArray(parsedValue) ||
      !parsedValue.every(isValidItem)
    ) {
      console.error(`Stored ${key} data has an invalid format.`);
      return [];
    }

    return parsedValue;
  } catch (error) {
    console.error(`Failed to read ${key} from localStorage.`, error);
    return [];
  }
}

function readSavedCart() {
  return readStoredArray("cart", isValidCartItem);
}

function readSavedFavorites() {
  return readStoredArray("favorites", isValidFavoriteId);
}

function saveToStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to save ${key} to localStorage.`, error);
  }
}

function readStoredBoolean(key) {
  try {
    const storedValue = window.localStorage.getItem(key);
    return storedValue === "true";
  } catch (error) {
    console.error(`Failed to read ${key} from localStorage.`, error);
    return false;
  }
}

function App() {
  // Состояние интерфейса, каталога, авторизации и покупок.
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("price-asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthPromptOpen, setIsAuthPromptOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isStorageLoaded, setIsStorageLoaded] = useState(false);

  // Восстанавливает сохраненные настройки и данные пользователя при запуске.
  useEffect(() => {
    const hasActiveSession = readStoredBoolean("isAuthenticated");

    if (hasActiveSession) {
      setCartItems(readSavedCart());
      setFavorites(readSavedFavorites());
    }

    setIsDarkMode(readStoredBoolean("isDarkMode"));
    setIsAuthenticated(hasActiveSession);
    setIsStorageLoaded(true);
  }, []);

  // Сохраняет изменения после завершения восстановления.
  useEffect(() => {
    if (!isStorageLoaded) return;

    saveToStorage("isDarkMode", isDarkMode);
    saveToStorage("isAuthenticated", isAuthenticated);

    if (isAuthenticated) {
      saveToStorage("cart", cartItems);
      saveToStorage("favorites", favorites);
    }
  }, [
    cartItems,
    favorites,
    isDarkMode,
    isAuthenticated,
    isStorageLoaded,
  ]);

  // Имитация загрузки списка товаров.
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setProducts(mockProducts);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, []);

  // Авторизация нужна для действий с корзиной и избранным.
  const requireAuthentication = () => {
    if (isAuthenticated) return true;

    setIsAuthPromptOpen(true);
    return false;
  };

  const handleLogin = () => {
    setCartItems(readSavedCart());
    setFavorites(readSavedFavorites());
    setIsAuthenticated(true);
    setIsAuthPromptOpen(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCartItems([]);
    setFavorites([]);
    setSearchQuery("");
    setSelectedCategory("All");
    setSortBy("price-asc");
    setCurrentPage(1);
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // Поиск, фильтрация, сортировка и разбиение каталога на страницы.
  const filteredProducts = products
    .filter(
      (product) =>
        selectedCategory === "All" || product.category === selectedCategory,
    )
    .filter((product) =>
      product.name.toLowerCase().includes(searchQuery.trim().toLowerCase()),
    )
    .sort((first, second) => {
      if (sortBy === "price-asc") return first.price - second.price;
      if (sortBy === "price-desc") return second.price - first.price;
      if (sortBy === "name-asc") return first.name.localeCompare(second.name);
      if (sortBy === "name-desc") return second.name.localeCompare(first.name);
      return 0;
    });

  const productsPerPage = 8;
  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / productsPerPage),
  );
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);
  const paginatedProducts = filteredProducts.slice(
    (safeCurrentPage - 1) * productsPerPage,
    safeCurrentPage * productsPerPage,
  );

  // Обработчики корзины и избранного.
  const handleAddToCart = (product, quantity) => {
    if (!requireAuthentication()) return false;

    setCartItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id);

      if (!existingItem) {
        return [...currentItems, { ...product, quantity }];
      }

      return currentItems.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item,
      );
    });

    return true;
  };

  const handleToggleFavorite = (productId) => {
    if (!requireAuthentication()) return;

    setFavorites((currentFavorites) =>
      currentFavorites.includes(productId)
        ? currentFavorites.filter((id) => id !== productId)
        : [...currentFavorites, productId],
    );
  };

  // Быстрая покупка добавляет товар в корзину и показывает подтверждение.
  const handleBuyNow = (product, quantity) => {
    if (!handleAddToCart(product, quantity)) return false;

    alert(`Purchase: ${product.name}`);
    return true;
  };

  // Количество товаров в корзине для отображения в хедере.
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className={`app-root ${isDarkMode ? "dark-theme" : "light-theme"}`}>
      <Container>
        {/* Шапка сайта */}
        <Header
          logoSrc={logoAsset}
          isDarkMode={isDarkMode}
          onToggleTheme={() => setIsDarkMode((currentMode) => !currentMode)}
          isAuthenticated={isAuthenticated}
          onLogin={handleLogin}
          onLogout={handleLogout}
          favoritesCount={favorites.length}
          cartCount={cartCount}
        />

        {/* Приветственный блок */}
        <HeroSection
          heading="Build the perfect gaming and work setup"
          subheading="Curated hardware for creators, gamers, and productivity enthusiasts."
          buttonText="Customize build"
        />

        {/* Статистика каталога */}
        {isAuthenticated && (
          <StatsSection
            productsCount={products.length}
            categoriesCount={CATEGORIES.length}
            favoritesCount={favorites.length}
          />
        )}

        {/* Каталог товаров с поиском, фильтрами и пагинацией */}
        <CatalogSection
          categories={CATEGORIES}
          isLoading={isLoading}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortBy={sortBy}
          setSortBy={setSortBy}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          products={paginatedProducts}
          favorites={favorites}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
          onToggleFavorite={handleToggleFavorite}
          onQuickView={(product) => {
            setSelectedProduct(product);
            setIsModalOpen(true);
          }}
          currentPage={safeCurrentPage}
          totalPages={totalPages}
          onPrev={() =>
            setCurrentPage((page) =>
              Math.min(Math.max(page - 1, 1), totalPages),
            )
          }
          onNext={() =>
            setCurrentPage((page) =>
              Math.min(Math.max(page + 1, 1), totalPages),
            )
          }
        />

        {/* Отзывы покупателей */}
        <ReviewsSection testimonials={testimonials} />
      </Container>

      {/* Подвал сайта */}
      <Footer
        copyrightText="© 2026 PC Configurator. All rights reserved."
        socialLinks={socialLinks}
        logoSrc={logoAsset}
      />

      {/* Модальные окна авторизации и подробной информации о товаре */}
      <AuthPromptModal
        isOpen={isAuthPromptOpen}
        onClose={() => setIsAuthPromptOpen(false)}
        onLogin={handleLogin}
      />

      <ProductDetailsModal
        isOpen={isModalOpen}
        product={selectedProduct}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProduct(null);
        }}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
      />
    </div>
  );
}

export default App;
