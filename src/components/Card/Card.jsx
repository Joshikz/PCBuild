import { useState } from "react";
import Badge from "../Badge/Badge";
import Button from "../Button/Button";
import RatingStars from "../RatingStars/RatingStars";
import useTheme from "../../context/useTheme";
import useCart from "../../context/useCart";

export default function Card({
  product,
  isFavorite,
  onAddToCart,
  onBuyNow,
  onToggleFavorite,
  onQuickView,
}) {
  const [quantity, setQuantity] = useState(1);
  const { theme } = useTheme();
  const { cartItems } = useCart();
  const itemInCart = cartItems.find((item) => item.id === product.id);

  const increaseQty = () =>
    setQuantity((currentQuantity) => currentQuantity + 1);
  const decreaseQty = () =>
    setQuantity((currentQuantity) => Math.max(1, currentQuantity - 1));

  return (
    <article
      className={`product-card ${theme}-theme`}
      style={{
        position: "relative",
        border: "1px solid var(--border, #e7cdb3)",
        borderRadius: "8px",
        padding: "16px",
        background: "var(--surface, #fffaf3)",
        color: "var(--text, #2f241b)",
        cursor: "pointer",
      }}
    >
      <button
        type="button"
        onClick={() => onToggleFavorite(product.id)}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        aria-pressed={isFavorite}
        style={{
          position: "absolute",
          top: "24px",
          right: "24px",
          border: "none",
          background: "var(--bg-card, #fffaf3)",
          borderRadius: "50%",
          width: "36px",
          height: "36px",
          cursor: "pointer",
          color: isFavorite ? "#dc3545" : "var(--text-secondary)",
          display: "grid",
          placeItems: "center",
        }}
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          style={{
            width: "21px",
            height: "21px",
            fill: isFavorite ? "currentColor" : "none",
            stroke: "currentColor",
            strokeWidth: 1.7,
            strokeLinecap: "round",
            strokeLinejoin: "round",
          }}
        >
          <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
        </svg>
      </button>

      <div style={{ marginBottom: "12px" }}>
        <Badge label={product.category} colorScheme="green" />
      </div>

      <img
        src={product.image}
        alt={product.name}
        onClick={() => onQuickView(product)}
        style={{
          width: "100%",
          height: "180px",
          objectFit: "contain",
          background: "var(--bg-surface)",
          borderRadius: "6px",
          marginBottom: "12px",
          cursor: "pointer",
        }}
      />

      <h3
        onClick={() => onQuickView(product)}
        style={{ margin: "0 0 10px", cursor: "pointer" }}
      >
        {product.name}
      </h3>
      <RatingStars score={product.rating} reviewsCount={product.reviewsCount} />
      {product.description && (
        <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
          {product.description}
        </p>
      )}

      <div
        className="price"
        style={{ marginTop: "12px", fontWeight: 700, fontSize: "20px" }}
      >
        {product.price.toLocaleString()} ₸
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          marginTop: "16px",
        }}
      >
        <div className="product-quantity">
          <button
            type="button"
            className="product-quantity-button"
            onClick={decreaseQty}
            aria-label="Decrease quantity"
          >
            -
          </button>
          <span className="product-quantity-value" aria-live="polite">
            {quantity}
          </span>
          <button
            type="button"
            className="product-quantity-button"
            onClick={increaseQty}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <Button
            text={itemInCart ? `Add More (${itemInCart.quantity})` : "Add to Cart"}
            variant="outline"
            onClick={() => onAddToCart(product, quantity)}
          />
          <Button
            text="Buy Now"
            variant="primary"
            onClick={() => onBuyNow(product, quantity)}
          />
        </div>
      </div>
    </article>
  );
}
