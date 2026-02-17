import { createContext, useState, useContext } from "react";
import { getProductById } from "../data/products";

// Create Cart Context
const CartContext = createContext(null);

// Cart Provider wraps the app and provides cart state + functions
export default function CartProvider({ children }) {
  // Stores cart items in the format:
  // [{ id: productId, quantity: number }]
  const [cartItems, setCartItems] = useState([]);

  /**
   * Add product to cart
   * - If product already exists → increase quantity
   * - Otherwise → add new item with quantity = 1
   */
  function addToCart(productId) {
    const existing = cartItems.find((item) => item.id === productId);

    if (existing) {
      const currentQuantity = existing.quantity;

      const updatedCartItems = cartItems.map((item) =>
        item.id === productId
          ? { id: productId, quantity: currentQuantity + 1 }
          : item
      );

      setCartItems(updatedCartItems);
    } else {
      setCartItems([...cartItems, { id: productId, quantity: 1 }]);
    }
  }

  /**
   * Returns cart items enriched with full product data
   * Example output:
   * [{ id, quantity, product }]
   */
  function getCartItemsWithProducts() {
    return cartItems
      .map((item) => ({
        ...item,
        product: getProductById(item.id),
      }))
      // Remove items whose product no longer exists
      .filter((item) => item.product);
  }

  /**
   * Remove a product completely from the cart
   */
  function removeFromCart(productId) {
    setCartItems(cartItems.filter((item) => item.id !== productId));
  }

  /**
   * Update quantity of a specific product
   * - If quantity <= 0 → remove item
   */
  function updateQuantity(productId, quantity) {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems(
      cartItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  }

  /**
   * Calculate total cart price
   * Loops through items and multiplies price × quantity
   */
  function getCartTotal() {
    const total = cartItems.reduce((total, item) => {
      const product = getProductById(item.id);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);

    return total;
  }

  /**
   * Clear entire cart
   */
  function clearCart() {
    setCartItems([]);
  }

  // Provide cart state and actions to children components
  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        getCartItemsWithProducts,
        removeFromCart,
        updateQuantity,
        getCartTotal,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

/**
 * Custom hook for accessing cart context
 * Usage: const cart = useCart();
 */
export function useCart() {
  const context = useContext(CartContext);
  return context;
}
