import { useParams } from "react-router-dom";
import Button from "../components/Button/Button";
import Container from "../components/Container/Container";

export default function ProductPage({
  products,
  isLoading,
  favorites,
  onAddToCart,
  onBuyNow,
  onToggleFavorite,
}) {
  const { id } = useParams();

  if (isLoading) {
    return (
      <Container>
        <p role="status">Loading product...</p>
      </Container>
    );
  }

  const product = products.find((item) => item.id === Number(id));

  if (!product) {
    return (
      <Container>
        <p role="status">Product not found</p>
      </Container>
    );
  }

  const isFavorite = favorites.includes(product.id);

  return (
    <Container>
      <main
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
          alignItems: "start",
          gap: "32px",
          padding: "32px 0",
        }}
      >
        <img
          src={product.image}
          alt={product.name}
          style={{
            width: "100%",
            maxHeight: "420px",
            objectFit: "contain",
            background: "var(--bg-surface)",
          }}
        />
        <article>
          <p style={{ color: "var(--text-secondary)" }}>{product.category}</p>
          <h1>{product.name}</h1>
          <p className="price" style={{ fontSize: "24px", fontWeight: 700 }}>
            {product.price.toLocaleString()} ₸
          </p>
          <p>{product.description}</p>
          <p>
            Рейтинг: {product.rating} / 5 ({product.reviewsCount} отзывов)
          </p>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Button
              text="Add to Cart"
              variant="outline"
              onClick={() => onAddToCart(product, 1)}
            />
            <Button
              text="Buy"
              variant="primary"
              onClick={() => onBuyNow(product, 1)}
            />
            <button
              type="button"
              onClick={() => onToggleFavorite(product.id)}
              aria-label={
                isFavorite ? "Remove from favorites" : "Add to favorites"
              }
              aria-pressed={isFavorite}
              style={{
                padding: "10px 18px",
                border: "1px solid var(--accent)",
                color: "var(--accent)",
                background: "transparent",
                fontSize: "14px",
                fontWeight: 600,
                transition: "all 0.2s",
              }}
            >
              {isFavorite ? "♥ In Favorites" : "♡ Add to Favorites"}
            </button>
          </div>
        </article>
      </main>
    </Container>
  );
}
