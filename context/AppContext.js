import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [userInfo, setUserInfo] = useState({
    name: ' ',
    phone: ' ',
    mail: ' ',
    address: ' ',
  });

  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [lastOrder, setLastOrder] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productRefreshKey, setProductRefreshKey] = useState(0);

  /* ================= CART ================= */

  const addToCart = (product) => {
    setCart((prev) => {
      const found = prev.find((p) => p.id === product.id);

      if (found) {
        return prev.map((p) => {
          if (p.id === product.id) {
            return { ...p, quantity: p.quantity + 1 };
          }
          return p;
        });
      }

      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  /* ================= FAVORITES ================= */

  const toggleFavorite = (product) => {
    setFavorites((prev) => {
      const found = prev.find((p) => p.id === product.id);
      if (found) return prev.filter((p) => p.id !== product.id);
      return [...prev, product];
    });
  };

  const removeFavorite = (productId) => {
    setFavorites((prev) => prev.filter((p) => p.id !== productId));
  };

  /* ================= ORDERS ================= */

  const addOrder = (order) => {
    setOrders((prev) => [order, ...prev]);
    setLastOrder(order);
  };

  /* ================= PRODUCT ================= */

  const openProduct = (product) => {
    setSelectedProduct(product);
  };

  /* ================= VALUE ================= */

  const value = {
    userInfo,
    cart,
    orders,
    lastOrder,
    favorites,
    selectedProduct,
    productRefreshKey,

    setUserInfo,
    setLastOrder,
    setProductRefreshKey,

    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    toggleFavorite,
    removeFavorite,
    addOrder,
    openProduct,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}