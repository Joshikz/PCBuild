import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import CartContext from "./CartContext";
import useAuth from "./useAuth";

function readSavedCart() {
  try {
    const storedCart = window.localStorage.getItem("cart");
    if (!storedCart) return [];

    const cartItems = JSON.parse(storedCart);
    if (
      !Array.isArray(cartItems) ||
      !cartItems.every(
        (item) =>
          item &&
          Number.isInteger(item.id) &&
          typeof item.name === "string" &&
          Number.isFinite(item.price) &&
          Number.isInteger(item.quantity) &&
          item.quantity > 0,
      )
    ) {
      console.error("Stored cart data has an invalid format.");
      return [];
    }

    return cartItems;
  } catch (error) {
    console.error("Failed to read cart from localStorage.", error);
    return [];
  }
}

export default function CartProvider({ children }) {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const skipNextSave = useRef(false);

  useEffect(() => {
    if (isAuthLoading) return;

    skipNextSave.current = true;
    setCartItems(isAuthenticated ? readSavedCart() : []);
  }, [isAuthenticated, isAuthLoading]);

  useEffect(() => {
    if (isAuthLoading || !isAuthenticated) return;
    if (skipNextSave.current) {
      skipNextSave.current = false;
      return;
    }

    try {
      window.localStorage.setItem("cart", JSON.stringify(cartItems));
    } catch (error) {
      console.error("Failed to save cart to localStorage.", error);
    }
  }, [cartItems, isAuthenticated, isAuthLoading]);

  const addToCart = useCallback((item, quantity = 1) => {
    if (
      !item ||
      !Number.isInteger(item.id) ||
      typeof item.name !== "string" ||
      !Number.isFinite(item.price) ||
      !Number.isInteger(quantity) ||
      quantity < 1
    ) {
      console.error("Cannot add an invalid item or quantity to the cart.");
      return;
    }

    setCartItems((currentItems) => {
      const existingItem = currentItems.find(
        (cartItem) => cartItem.id === item.id,
      );

      return existingItem
        ? currentItems.map((cartItem) =>
            cartItem.id === item.id
              ? { ...cartItem, quantity: cartItem.quantity + quantity }
              : cartItem,
          )
        : [...currentItems, { ...item, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((itemId) => {
    setCartItems((currentItems) =>
      currentItems.filter((item) => item.id !== itemId),
    );
  }, []);

  const updateQuantity = useCallback((itemId, newQty) => {
    if (!Number.isInteger(newQty) || newQty < 1) {
      console.error("Cart quantity must be a positive integer.");
      return;
    }

    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQty } : item,
      ),
    );
  }, []);

  const clearCart = useCallback(() => setCartItems([]), []);

  const value = useMemo(() => {
    const totalCount = cartItems.reduce(
      (total, item) => total + item.quantity,
      0,
    );
    const totalPrice = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );

    return {
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalCount,
      totalPrice,
    };
  }, [
    addToCart,
    cartItems,
    clearCart,
    removeFromCart,
    updateQuantity,
  ]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
