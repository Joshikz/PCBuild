import Button from "../Button/Button";
import Modal from "../Modal/Modal";

export default function ProductDetailsModal({
  isOpen,
  product,
  onClose,
  onAddToCart,
  onBuyNow,
}) {
  return (
    <Modal
      isOpen={isOpen}
      title={product?.name ?? "Product"}
      onClose={onClose}
    >
      {product && (
        <div>
          <img
            src={product.image}
            alt={product.name}
            style={{
              width: "100%",
              height: "260px",
              objectFit: "contain",
              background: "var(--bg-surface)",
            }}
          />
          <h3>{product.name}</h3>
          <p>Category: {product.category}</p>
          <p className="price">Price: {product.price.toLocaleString()} ₸</p>
          <p>{product.description}</p>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Button
              text="Add to Cart"
              variant="outline"
              onClick={() => {
                if (onAddToCart(product, 1)) onClose();
              }}
            />
            <Button
              text="Buy Now"
              variant="primary"
              onClick={() => {
                if (onBuyNow(product, 1)) onClose();
              }}
            />
          </div>
        </div>
      )}
    </Modal>
  );
}
