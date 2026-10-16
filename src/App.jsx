import { useState, useEffect, useRef } from "react";
import {
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import "./App.css";

import MainLayout from "./components/MainLayout";
import CatalogSection from "./components/CatalogSection/CatalogSection";
import AuthPromptModal from "./components/AuthPromptModal/AuthPromptModal";
import ProductDetailsModal from "./components/ProductDetailsModal/ProductDetailsModal";
import AboutPage from "./pages/AboutPage";
import CartPage from "./pages/CartPage";
import CatalogPage from "./pages/CatalogPage";
import FavoritesPage from "./pages/FavoritesPage";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import ProductPage from "./pages/ProductPage";
import ProfileLayout from "./pages/ProfileLayout";
import ProfilePage from "./pages/ProfilePage";
import ProfileSettingsPage from "./pages/ProfileSettingsPage";

import { CATEGORIES, mockProducts } from "./data/products";
import logoAsset from "./assets/logo.svg";
import useTheme from "./context/useTheme";
import useAuth from "./context/useAuth";
import useCart from "./context/useCart";

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
const DEFAULT_CATEGORY = "All";
const DEFAULT_SORT = "price-asc";
const SORT_OPTIONS = ["price-asc", "price-desc", "name-asc", "name-desc"];

function readCatalogFilters(searchParams) {
  const category = searchParams.get("category");
  const sort = searchParams.get("sort");

  return {
    searchQuery: searchParams.get("q") ?? "",
    selectedCategory:
      category === DEFAULT_CATEGORY || CATEGORIES.includes(category)
        ? category
        : DEFAULT_CATEGORY,
    sortBy: SORT_OPTIONS.includes(sort) ? sort : DEFAULT_SORT,
  };
}

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

function ProtectedRoute() {
  const { isLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <p role="status">Checking your session...</p>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { theme } = useTheme();
  const { user, isAuthenticated, login, logout } = useAuth();
  const { addToCart, clearCart } = useCart();
  const initialCatalogFilters =
    location.pathname === "/catalog"
      ? readCatalogFilters(searchParams)
      : {
          searchQuery: "",
          selectedCategory: DEFAULT_CATEGORY,
          sortBy: DEFAULT_SORT,
        };
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const [searchQuery, setSearchQuery] = useState(
    initialCatalogFilters.searchQuery,
  );
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(
    initialCatalogFilters.searchQuery,
  );
  const [selectedCategory, setSelectedCategory] = useState(
    initialCatalogFilters.selectedCategory,
  );
  const [sortBy, setSortBy] = useState(initialCatalogFilters.sortBy);
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
  const debouncedSearchQueryRef = useRef(initialCatalogFilters.searchQuery);

  useEffect(() => {
    if (location.pathname !== "/catalog") return;

    const filters = readCatalogFilters(searchParams);
    const filtersChanged =
      filters.searchQuery !== searchQuery ||
      filters.selectedCategory !== selectedCategory ||
      filters.sortBy !== sortBy;

    if (filtersChanged) {
      setIsCatalogLoading(true);
      setCurrentPage(1);

      if (filters.searchQuery !== searchQuery) {
        setSearchQuery(filters.searchQuery);
        setDebouncedSearchQuery(filters.searchQuery);
        debouncedSearchQueryRef.current = filters.searchQuery;
      }
      if (filters.selectedCategory !== selectedCategory) {
        setSelectedCategory(filters.selectedCategory);
      }
      if (filters.sortBy !== sortBy) {
        setSortBy(filters.sortBy);
      }
    }

    const canonicalParams = new URLSearchParams(searchParams);
    canonicalParams.delete("q");
    canonicalParams.delete("category");
    canonicalParams.delete("sort");
    if (filters.searchQuery) canonicalParams.set("q", filters.searchQuery);
    if (filters.selectedCategory !== DEFAULT_CATEGORY) {
      canonicalParams.set("category", filters.selectedCategory);
    }
    if (filters.sortBy !== DEFAULT_SORT) {
      canonicalParams.set("sort", filters.sortBy);
    }

    if (canonicalParams.toString() !== searchParams.toString()) {
      setSearchParams(canonicalParams, { replace: true });
    }
  }, [
    location.pathname,
    searchParams,
    searchQuery,
    selectedCategory,
    sortBy,
    setSearchParams,
  ]);

  useEffect(() => {
    if (readStoredBoolean("isAuthenticated")) {
      setFavorites(readSavedFavorites());
    }

    setIsStorageLoaded(true);
  }, []);

  useEffect(() => {
    if (!isStorageLoaded) return;

    if (isAuthenticated) {
      saveToStorage("favorites", favorites);
    }
  }, [favorites, isAuthenticated, isStorageLoaded]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setProducts(mockProducts);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, []);

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

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    document
      .getElementById("catalog")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [currentPage]);

  useEffect(() => {
    if (location.pathname !== "/" || !location.hash) return undefined;

    const frameId = window.requestAnimationFrame(() => {
      document
        .getElementById(decodeURIComponent(location.hash.slice(1)))
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [location.pathname, location.hash]);

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

  useEffect(() => {
    if (!toastMessage) return undefined;

    const timeoutId = window.setTimeout(() => setToastMessage(null), 3000);
    return () => window.clearTimeout(timeoutId);
  }, [toastMessage]);

  const requireAuthentication = () => {
    if (isAuthenticated) return true;

    setIsAuthPromptOpen(true);
    return false;
  };

  const handleLogin = () => {
    setFavorites(readSavedFavorites());
    login();
    setIsAuthPromptOpen(false);

    const returnTo = location.state?.from;
    if (returnTo?.pathname) {
      navigate(
        `${returnTo.pathname}${returnTo.search ?? ""}${returnTo.hash ?? ""}`,
        { replace: true, state: null },
      );
    }
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

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE),
  );
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);
  const updateCatalogSearchParams = (filters, { replace = false } = {}) => {
    if (location.pathname !== "/catalog") return;

    setSearchParams(
      (currentParams) => {
        const nextParams = new URLSearchParams(currentParams);
        nextParams.delete("q");
        nextParams.delete("category");
        nextParams.delete("sort");
        if (filters.searchQuery) nextParams.set("q", filters.searchQuery);
        if (filters.selectedCategory !== DEFAULT_CATEGORY) {
          nextParams.set("category", filters.selectedCategory);
        }
        if (filters.sortBy !== DEFAULT_SORT) {
          nextParams.set("sort", filters.sortBy);
        }
        return nextParams;
      },
      { replace },
    );
  };

  const handleCategoryChange = (category) => {
    if (category === selectedCategory) return;
    setIsCatalogLoading(true);
    setSelectedCategory(category);
    setCurrentPage(1);
    updateCatalogSearchParams({
      searchQuery,
      selectedCategory: category,
      sortBy,
    });
  };

  const handleSortChange = (sort) => {
    if (sort === sortBy) return;
    setIsCatalogLoading(true);
    setSortBy(sort);
    setCurrentPage(1);
    updateCatalogSearchParams({
      searchQuery,
      selectedCategory,
      sortBy: sort,
    });
  };

  const handleSearchChange = (query) => {
    if (query === searchQuery) return;
    setIsCatalogLoading(true);
    setSearchQuery(query);
    setCurrentPage(1);
    const currentUrlQuery = searchParams.get("q") ?? "";
    updateCatalogSearchParams(
      {
        searchQuery: query,
        selectedCategory,
        sortBy,
      },
      { replace: Boolean(currentUrlQuery && query) },
    );
  };

  const handlePreviousPage = () => {
    setIsCatalogLoading(true);
    setCurrentPage((page) => Math.max(page - 1, 1));
  };

  const handleNextPage = () => {
    setIsCatalogLoading(true);
    setCurrentPage((page) => Math.min(page + 1, totalPages));
  };

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

  const handleBuyNow = (product, quantity) => {
    if (!requireAuthentication()) return false;

    alert(`Purchase: ${quantity} × ${product.name}`);
    return true;
  };

  const renderCatalog = () => (
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
  );

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
      <Routes>
        <Route
          element={
            <MainLayout
              logoSrc={logoAsset}
              onLogin={handleLogin}
              favoritesCount={favorites.length}
              isMobile={isMobile}
              copyrightText="© 2026 PC Configurator. All rights reserved."
              socialLinks={socialLinks}
            />
          }
        >
          <Route
            path="/"
            element={
              <HomePage
                isAuthenticated={isAuthenticated}
                productsCount={products.length}
                categoriesCount={CATEGORIES.length}
                favoritesCount={favorites.length}
                testimonials={testimonials}
                catalogSection={renderCatalog()}
              />
            }
          />
          <Route
            path="/catalog"
            element={<CatalogPage catalogSection={renderCatalog()} />}
          />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/favorites" element={<ProtectedRoute />}>
            <Route
              index
              element={
                <FavoritesPage
                  products={products}
                  isLoading={isLoading}
                  favorites={favorites}
                  onAddToCart={handleAddToCart}
                  onBuyNow={handleBuyNow}
                  onToggleFavorite={handleToggleFavorite}
                  onQuickView={(product) => {
                    setSelectedProduct(product);
                    setIsModalOpen(true);
                  }}
                />
              }
            />
          </Route>
          <Route
            path="/product/:id"
            element={
              <ProductPage
                products={products}
                isLoading={isLoading}
                favorites={favorites}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
                onToggleFavorite={handleToggleFavorite}
              />
            }
          />
          <Route
            path="/profile"
            element={<ProtectedRoute />}
          >
            <Route element={<ProfileLayout user={user} />}>
              <Route index element={<ProfilePage />} />
              <Route path="settings" element={<ProfileSettingsPage />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>

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
