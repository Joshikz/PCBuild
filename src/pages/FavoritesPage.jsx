import Card from "../components/Card/Card";
import Container from "../components/Container/Container";
import SectionHeader from "../components/SectionHeader/SectionHeader";
import { Link } from "react-router-dom";

export default function FavoritesPage({
  products,
  isLoading,
  favorites,
  onAddToCart,
  onBuyNow,
  onToggleFavorite,
  onQuickView,
}) {
  const favoriteProducts = products.filter((product) =>
    favorites.includes(product.id),
  );

  return (
    <Container>
      <main className="favorites-page">
        <SectionHeader
          title="Your Favorites"
          subtitle="The components you have saved for your PC build."
        />
        {isLoading ? (
          <p role="status">Loading favorites...</p>
        ) : favoriteProducts.length > 0 ? (
          <div className="product-grid">
            {favoriteProducts.map((product) => (
              <Card
                key={product.id}
                product={product}
                isFavorite
                onAddToCart={onAddToCart}
                onBuyNow={onBuyNow}
                onToggleFavorite={onToggleFavorite}
                onQuickView={onQuickView}
              />
            ))}
          </div>
        ) : (
          <p role="status">
            You have not added any favorites yet.{" "}
            <Link to="/catalog">Browse the catalog</Link>
          </p>
        )}
      </main>
    </Container>
  );
}
