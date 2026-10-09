import { useState, useEffect } from "react";
import "./App.css";

import Container from "./components/Container/Container";
import Button from "./components/Button/Button";
import Logo from "./components/Logo/Logo";
import Navigation from "./components/Navigation/Navigation";
import UserProfile from "./components/UserProfile/UserProfile";
import HeroSection from "./components/HeroSection/HeroSection";
import StatCard from "./components/StatCard/StatCard";
import Modal from "./components/Modal/Modal";
import Footer from "./components/Footer/Footer";
import Card from "./components/Card/Card";
import SectionHeader from "./components/SectionHeader/SectionHeader";
import CategoryFilter from "./components/CategoryFilter/CategoryFilter";
import TestimonialCard from "./components/TestimonialCard/TestimonialCard";
import SearchBar from "./components/SearchBar/SearchBar";
import SortDropdown from "./components/SortDropdown/SortDropdown";
import Pagination from "./components/Pagination/Pagination";

import { CATEGORIES, mockProducts } from "./data/products";
import logoAsset from "./assets/logo.svg";

const navItems = [
  { id: 1, label: "Catalog", link: "#catalog" },
  { id: 2, label: "Builds", link: "#builds" },
  { id: 3, label: "Support", link: "#support" },
];

const socialLinks = [
  { platform: "Instagram", url: "https://instagram.com", icon: "◎" },
  { platform: "Telegram", url: "https://t.me", icon: "➤" },
  { platform: "YouTube", url: "https://youtube.com", icon: "▶" },
];

const user = {
  name: "Ilim Shomorov",
  role: "Gaming Setup Planner",
  email: "ilim@example.com",
  avatarUrl:
    "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=1174&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
};

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

function Header({
  isDarkMode,
  onToggleTheme,
  isAuthenticated,
  onLogin,
  onLogout,
  favoritesCount,
  cartCount,
}) {
  return (
    <header className="app-header">
      <Logo src={logoAsset} altText="PC Build" width="160px" />
      <Navigation navItems={navItems} />
      <div className="header-actions">
        {isAuthenticated ? (
          <UserProfile
            cartCount={cartCount}
            favoritesCount={favoritesCount}
            user={user}
            onClick={onLogout}
          />
        ) : (
          <Button text="Log in" onClick={onLogin} />
        )}
        <Button
          text={isDarkMode ? "Light theme" : "Dark theme"}
          variant="secondary"
          onClick={onToggleTheme}
        />
      </div>
    </header>
  );
}

function App() {
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

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setProducts(mockProducts);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, []);

  const requireAuthentication = () => {
    if (isAuthenticated) return true;

    setIsAuthPromptOpen(true);
    return false;
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    setIsAuthPromptOpen(false);
  };

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

  const handleBuyNow = (product, quantity) => {
    if (!handleAddToCart(product, quantity)) return;

    alert(`Purchase: ${product.name}`);
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className={`app-root ${isDarkMode ? "dark-theme" : "light-theme"}`}>
      <Container>
        <Header
          isDarkMode={isDarkMode}
          onToggleTheme={() => setIsDarkMode((currentMode) => !currentMode)}
          isAuthenticated={isAuthenticated}
          onLogin={handleLogin}
          onLogout={() => setIsAuthenticated(false)}
          favoritesCount={favorites.length}
          cartCount={cartCount}
        />

        <HeroSection
          heading="Build the perfect gaming and work setup"
          subheading="Curated hardware for creators, gamers, and productivity enthusiasts."
          buttonText="Customize build"
        />

        <section className="stats-section">
          <SectionHeader
            title="Catalog Statistics"
            subtitle="Current store metrics"
            align="center"
          />
          <div className="stats-grid">
            <StatCard title="Products in Catalog" value={products.length} />
            <StatCard title="Hardware Categories" value={CATEGORIES.length} />
            <StatCard title="Favorite Products" value={favorites.length} />
          </div>
        </section>

        <section className="catalog-section">
          <SectionHeader
            title="Hardware Catalog"
            subtitle="Find components for your next PC build."
          />

          {isLoading ? (
            <p role="status">Loading Catalog...</p>
          ) : (
            <>
              <div className="catalog-tools">
                <SearchBar
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                />
                <SortDropdown sortBy={sortBy} setSortBy={setSortBy} />
              </div>

              <CategoryFilter
                categories={["All", ...CATEGORIES]}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
              />

              {paginatedProducts.length > 0 ? (
                <div className="product-grid">
                  {paginatedProducts.map((product) => (
                    <Card
                      key={product.id}
                      product={product}
                      isFavorite={favorites.includes(product.id)}
                      onAddToCart={handleAddToCart}
                      onBuyNow={handleBuyNow}
                      onToggleFavorite={handleToggleFavorite}
                      onQuickView={(prod) => {
                        setSelectedProduct(prod);
                        setIsModalOpen(true);
                      }}
                    />
                  ))}
                </div>
              ) : (
                <p role="status">No products found for your search.</p>
              )}

              <Pagination
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
            </>
          )}
        </section>

        <section className="reviews-section">
          <SectionHeader
            title="Customer Reviews"
            subtitle="Feedback from people who have built their PCs."
          />
          <div className="testimonial-grid">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} {...testimonial} />
            ))}
          </div>
        </section>
      </Container>

      <Footer
        copyrightText="© 2026 PC Configurator. All rights reserved."
        socialLinks={socialLinks}
        logoSrc={logoAsset}
      />

      <Modal
        isOpen={isAuthPromptOpen}
        title="Log in required"
        onClose={() => setIsAuthPromptOpen(false)}
      >
        <p>
          You need to log in before using favorites, the cart, or purchase
          actions.
        </p>
        <Button text="Log in" onClick={handleLogin} />
      </Modal>

      <Modal
        isOpen={isModalOpen}
        title={selectedProduct?.name ?? "Product"}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProduct(null);
        }}
      >
        {selectedProduct && (
          <div>
            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              style={{
                width: "100%",
                height: "260px",
                objectFit: "contain",
                background: "var(--bg-surface)",
              }}
            />
            <h3>{selectedProduct.name}</h3>
            <p>Category: {selectedProduct.category}</p>
            <p className="price">
              Price: {selectedProduct.price.toLocaleString()} ₸
            </p>
            <p>{selectedProduct.description}</p>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Button
                text="Add to Cart"
                variant="outline"
                onClick={() => {
                  if (handleAddToCart(selectedProduct, 1)) {
                    setIsModalOpen(false);
                  }
                }}
              />
              <Button
                text="Buy Now"
                variant="primary"
                onClick={() => {
                  if (handleAddToCart(selectedProduct, 1)) {
                    alert(`Purchase: ${selectedProduct.name}`);
                    setIsModalOpen(false);
                  }
                }}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default App;
