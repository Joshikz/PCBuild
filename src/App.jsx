import { useState, useEffect, useRef } from "react";
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
import OfferCountdown from "./components/OfferCountdown/OfferCountdown";
import CartSection from "./components/CartSection/CartSection";

import { CATEGORIES, mockProducts } from "./data/products";
import logoAsset from "./assets/logo.svg";
import useTheme from "./context/useTheme";
import useAuth from "./context/useAuth";
import useCart from "./context/useCart";

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

const isValidFavoriteId = (productId) => Number.isInteger(productId);
const PRODUCTS_PER_PAGE = 8;

function readStoredArray(key, isValidItem) {
  try {
    const storedValue = window.localStorage.getItem(key);
    if (storedValue === null) return [];

    const parsedValue = JSON.parse(storedValue);
    if (!Array.isArray(parsedValue) || !parsedValue.every(isValidItem)) {
      console.error(`Stored ${key} data has an invalid format.`);
      return [];
    }

    return parsedValue;
  } catch (error) {
    console.error(`Failed to read ${key} from localStorage.`, error);
    return [];
  }
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
    return window.localStorage.getItem(key) === "true";
  } catch (error) {
    console.error(`Failed to read ${key} from localStorage.`, error);
    return false;
  }
}

function App() {
  // Состояние интерфейса, каталога, авторизации и покупок.
  const { theme } = useTheme();
  const { isAuthenticated, login, logout } = useAuth();
  const { addToCart, clearCart } = useCart();
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("price-asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthPromptOpen, setIsAuthPromptOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [paginatedProducts, setPaginatedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCatalogLoading, setIsCatalogLoading] = useState(true);
  const [isStorageLoaded, setIsStorageLoaded] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const hasMounted = useRef(false);
  const toastId = useRef(0);
  const debouncedSearchQueryRef = useRef("");

  // Восстанавливает сохраненные пользовательские данные при запуске.
  useEffect(() => {
    if (readStoredBoolean("isAuthenticated")) {
      setFavorites(readSavedFavorites());
    }

    setIsStorageLoaded(true);
  }, []);

  // Сохраняет изменения после завершения восстановления.
  useEffect(() => {
    if (!isStorageLoaded) return;

    if (isAuthenticated) {
      saveToStorage("favorites", favorites);
    }
  }, [
    favorites,
    isAuthenticated,
    isStorageLoaded,
  ]);

  // Отслеживает ширину окна для переключения на мобильное меню.
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Загружает каталог при первом монтировании.
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setProducts(mockProducts);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, []);

  // Откладывает применение поискового запроса до паузы во вводе.
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const searchDidNotChange =
        searchQuery === debouncedSearchQueryRef.current;
      debouncedSearchQueryRef.current = searchQuery;
      setDebouncedSearchQuery(searchQuery);
      if (searchDidNotChange) setIsCatalogLoading(false);
    }, 500);

    return () => window.clearTimeout(timeoutId);
  }, [searchQuery]);

  // Обновляет заголовок вкладки для выбранной категории или товара.
  useEffect(() => {
    const pageTitle = selectedProduct
      ? selectedProduct.name
      : selectedCategory === "All"
        ? "All Components"
        : selectedCategory;
    document.title = `${pageTitle} | PC Configurator`;

    return () => {
      document.title = "PC Configurator";
    };
  }, [selectedCategory, selectedProduct]);

  // Фильтрует каталог асинхронно; новая фильтрация отменяет предыдущую.
  useEffect(() => {
    if (isLoading) return undefined;

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => {
      if (controller.signal.aborted) return;

      const query = debouncedSearchQuery.trim().toLowerCase();
      const result = products
        .filter(
          (product) =>
            selectedCategory === "All" || product.category === selectedCategory,
        )
        .filter((product) => product.name.toLowerCase().includes(query))
        .sort((first, second) => {
          if (sortBy === "price-asc") return first.price - second.price;
          if (sortBy === "price-desc") return second.price - first.price;
          if (sortBy === "name-asc")
            return first.name.localeCompare(second.name);
          if (sortBy === "name-desc")
            return second.name.localeCompare(first.name);
          return 0;
        });

      const pageStart = (currentPage - 1) * PRODUCTS_PER_PAGE;
      setFilteredProducts(result);
      setPaginatedProducts(
        result.slice(pageStart, pageStart + PRODUCTS_PER_PAGE),
      );
      setIsCatalogLoading(false);
    }, 200);

    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [
    products,
    selectedCategory,
    debouncedSearchQuery,
    sortBy,
    currentPage,
    isLoading,
  ]);

  // Закрывает открытые модальные окна клавишей Escape.
  useEffect(() => {
    if (!isModalOpen && !isAuthPromptOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key !== "Escape") return;
      setIsModalOpen(false);
      setIsAuthPromptOpen(false);
      setSelectedProduct(null);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen, isAuthPromptOpen]);

  // При смене страницы каталога возвращает к началу каталога, а не сайта.
  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    document
      .getElementById("catalog")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [currentPage]);

  // Обновляет индикатор прокрутки страницы и снимает подписку при размонтировании.
  useEffect(() => {
    const handleScroll = () => {
      const scrollableHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress =
        scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
      setScrollProgress(Math.min(Math.max(progress, 0), 100));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    const frameId = window.requestAnimationFrame(handleScroll);
    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Автоматически скрывает уведомление о добавлении товара через 3 секунды.
  useEffect(() => {
    if (!toastMessage) return undefined;

    const timeoutId = window.setTimeout(() => setToastMessage(null), 3000);
    return () => window.clearTimeout(timeoutId);
  }, [toastMessage]);

  // Авторизация нужна для действий с корзиной и избранным.
  const requireAuthentication = () => {
    if (isAuthenticated) return true;

    setIsAuthPromptOpen(true);
    return false;
  };

  const handleLogin = () => {
    setFavorites(readSavedFavorites());
    login();
    setIsAuthPromptOpen(false);
  };

  const handleLogout = () => {
    logout();
    clearCart();
    setFavorites([]);
    setSearchQuery("");
    setDebouncedSearchQuery("");
    debouncedSearchQueryRef.current = "";
    setSelectedCategory("All");
    setSortBy("price-asc");
    setCurrentPage(1);
    setIsCatalogLoading(false);
    setIsModalOpen(false);
    setSelectedProduct(null);
    setToastMessage(null);
  };

  // Формирует текущую страницу уже отфильтрованного каталога.
  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE),
  );
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);
  const handleCategoryChange = (category) => {
    if (category === selectedCategory) return;
    setIsCatalogLoading(true);
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSortChange = (sort) => {
    if (sort === sortBy) return;
    setIsCatalogLoading(true);
    setSortBy(sort);
    setCurrentPage(1);
  };

  const handleSearchChange = (query) => {
    if (query === searchQuery) return;
    setIsCatalogLoading(true);
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handlePreviousPage = () => {
    setIsCatalogLoading(true);
    setCurrentPage((page) => Math.max(page - 1, 1));
  };

  const handleNextPage = () => {
    setIsCatalogLoading(true);
    setCurrentPage((page) => Math.min(page + 1, totalPages));
  };

  // Обработчики корзины и избранного.
  const handleAddToCart = (product, quantity) => {
    if (!requireAuthentication()) return false;

    addToCart(product, quantity);

    toastId.current += 1;
    setToastMessage({
      id: toastId.current,
      text: `${product.name} added to cart`,
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

  // Быстрая покупка не меняет содержимое корзины.
  const handleBuyNow = (product, quantity) => {
    if (!requireAuthentication()) return false;

    alert(`Purchase: ${quantity} × ${product.name}`);
    return true;
  };

  return (
    <div className={`app-root ${theme}-theme`}>
      <div
        className="scroll-progress"
        style={{ transform: `scaleX(${scrollProgress / 100})` }}
        aria-hidden="true"
      />
      {toastMessage && (
        <div className="toast-message" role="status">
          {toastMessage.text}
        </div>
      )}
      <Container>
        {/* Шапка сайта */}
        <Header
          key={isMobile ? "mobile" : "desktop"}
          logoSrc={logoAsset}
          onLogin={handleLogin}
          favoritesCount={favorites.length}
          isMobile={isMobile}
        />

        {/* Приветственный блок */}
        <OfferCountdown />
        <HeroSection
          heading="Find the right components for your PC"
          subheading="Explore processors, graphics cards, memory, storage, and more for your next build."
          buttonText="Explore components"
        />

        {isAuthenticated && <CartSection />}

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
          isLoading={isLoading || isCatalogLoading}
          searchQuery={searchQuery}
          setSearchQuery={handleSearchChange}
          sortBy={sortBy}
          setSortBy={handleSortChange}
          selectedCategory={selectedCategory}
          setSelectedCategory={handleCategoryChange}
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
          onPrev={handlePreviousPage}
          onNext={handleNextPage}
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
