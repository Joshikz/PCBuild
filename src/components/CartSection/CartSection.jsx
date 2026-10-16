import { Link } from "react-router-dom";
import useCart from "../../context/useCart";

export default function CartSection() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalCount,
    totalPrice,
  } = useCart();

  return (
    <section className="cart-section" aria-labelledby="cart-title">
      <div className="cart-heading">
        <div>
          <p className="cart-eyebrow">YOUR BUILD</p>
          <h2 id="cart-title">Shopping cart</h2>
        </div>
        <span className="cart-count">
          {totalCount} {totalCount === 1 ? "item" : "items"}
        </span>
      </div>

      {cartItems.length === 0 ? (
        <div className="cart-empty">
          <span className="cart-empty-icon" aria-hidden="true">＋</span>
          <h3>Your cart is empty</h3>
          <p>Add components from the catalog to start your build.</p>
          <Link to="/catalog">Browse components</Link>
        </div>
      ) : (
        <div className="cart-content">
          <ul className="cart-items">
            {cartItems.map((item) => (
              <li className="cart-item" key={item.id}>
                {item.image ? (
                  <img className="cart-item-image" src={item.image} alt="" />
                ) : (
                  <span className="cart-item-image cart-item-placeholder" aria-hidden="true">
                    PC
                  </span>
                )}
                <div className="cart-item-details">
                  <span className="cart-item-category">{item.category}</span>
                  <h3>{item.name}</h3>
                  <span className="cart-item-unit-price">
                    {item.price.toLocaleString()} ₸ each
                  </span>
                </div>
                <div className="cart-item-actions">
                  <div className="cart-quantity" aria-label={`Quantity: ${item.quantity}`}>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      aria-label={`Decrease ${item.name} quantity`}
                    >
                      −
                    </button>
                    <span aria-live="polite">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      aria-label={`Increase ${item.name} quantity`}
                    >
                      +
                    </button>
                  </div>
                  <strong className="cart-item-total">
                    {(item.price * item.quantity).toLocaleString()} ₸
                  </strong>
                  <button
                    className="cart-remove"
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="cart-summary">
            <div className="cart-summary-copy">
              <span>Estimated total</span>
              <small>Price includes all items in your cart</small>
            </div>
            <strong>{totalPrice.toLocaleString()} ₸</strong>
          </div>
          <button className="cart-clear" type="button" onClick={clearCart}>
            Clear cart
          </button>
        </div>
      )}
    </section>
  );
}
