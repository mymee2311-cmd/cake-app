import React, { useState } from 'react';
import { View, Alert } from 'react-native';

import SplashScreen from './Screen/SplashScreen';
import LoginScreen from './Screen/LoginScreen';
import HomeScreen from './Screen/HomeScreen';
import ProfileScreen from './Screen/ProfileScreen';
import OwnerHomeScreen from './Screen/OwnerHomeScreen';
import EditProfileScreen from './Screen/EditProfileScreen';
import CheckOutScreen from './Screen/CheckOutScreen';
import CartScreen from './Screen/CartScreen';
import OrderHistoryScreen from './Screen/OrderHistoryScreen';
import OrderSuccessScreen from './Screen/OrderSuccessScreen';
import OwnerProductManagementScreen from './Screen/OwnerProductManagementScreen';
import FavoriteScreen from './Screen/FavoriteScreen';
import AddProductScreen from './Screen/AddProductScreen';
import OwnerOrderManagementScreen from './Screen/OwnerOrderManagementScreen';

export default function App() {
  const [screen, setScreen] = useState('splash');

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

  const [productRefreshKey, setProductRefreshKey] = useState(0);

  /* ================= CART HANDLERS ================= */

  const handleAddToCart = (product) => {
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

  const handleUpdateQuantity = (productId, newQuantity) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleToggleFavorite = (product) => {
    setFavorites((prev) => {
      const found = prev.find((p) => p.id === product.id);
      if (found) return prev.filter((p) => p.id !== product.id);
      return [...prev, product];
    });
  };

  const handleRemoveFavorite = (productId) => {
    setFavorites((prev) => prev.filter((p) => p.id !== productId));
  };

  /* ================= NAVIGATION ================= */

  if (screen === 'splash') {
    return <SplashScreen onFinish={() => setScreen('home')} />;
  }

  if (screen === 'home') {
    return (
      <HomeScreen
        onOwnerLogin={() => setScreen('login')}
        cart={cart}
        onAddToCart={handleAddToCart}
        onGoToCheckout={() => setScreen('cart')}
        onGoToOrders={() => setScreen('orderHistory')}
        onGoToFavorite={() => setScreen('favorites')}
        onGoToProduct={(product) => {
          Alert.alert('Chi tiết sản phẩm', product.name);
        }}
        favorites={favorites}
        onToggleFavorite={handleToggleFavorite}
      />
    );
  }

  if (screen === 'cart') {
    return (
      <CartScreen
        cart={cart}
        onBack={() => setScreen('home')}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onGoToCheckout={() => setScreen('checkout')}
      />
    );
  }

  if (screen === 'checkout') {
    return (
      <CheckOutScreen
        cartItems={cart}
        onBack={() => setScreen('cart')}
        onConfirm={(orderData) => {
          const newOrder = {
            orderCode: orderData.orderCode,
            orderId: orderData.orderId,
            createdAt: new Date().toISOString(),
            paymentMethod: orderData.paymentMethod,
            address: orderData.address,
            name: orderData.name,
            phone: orderData.phone,
            total: orderData.total,
            cartItems: orderData.cartItems,
            status: 'pending',
          };

          setOrders((prev) => [newOrder, ...prev]);
          setLastOrder(newOrder);
          handleClearCart();
          setScreen('orderSuccess');
        }}
      />
    );
  }

  if (screen === 'orderSuccess') {
    return (
      <OrderSuccessScreen
        orderInfo={lastOrder}
        onGoHome={() => setScreen('home')}
        onViewOrders={() => setScreen('orderHistory')}
      />
    );
  }

  // ==================== ORDER HISTORY ====================
  if (screen === 'orderHistory') {
    return (
      <OrderHistoryScreen
        onBack={() => setScreen('home')}
        onViewOrderDetail={(order) => {
          setLastOrder(order);
          Alert.alert(
            'Chi tiết đơn hàng',
            `Mã đơn: ${order.order_code}\n` +
              `Tổng: ${Number(order.total).toLocaleString('vi-VN')}đ\n` +
              `Trạng thái: ${order.status}\n` +
              `Địa chỉ: ${order.address}`
          );
        }}
      />
    );
  }

  if (screen === 'favorites') {
    return (
      <FavoriteScreen
        favorites={favorites}
        onBack={() => setScreen('home')}
        onRemoveFavorite={handleRemoveFavorite}
        onAddToCart={handleAddToCart}
        onGoToProduct={(item) => {
          Alert.alert('Chi tiết sản phẩm', item.name);
        }}
      />
    );
  }

  if (screen === 'login') {
    return (
      <LoginScreen
        onLogin={() => setScreen('ownerHome')}
        onBack={() => setScreen('home')}
      />
    );
  }

  if (screen === 'ownerHome') {
    return (
      <OwnerHomeScreen
        onProfile={() => setScreen('profile')}
        onLogout={() => setScreen('login')}
        onProducts={() => setScreen('ownerProducts')}
        onOrders={() => setScreen('ownerOrders')}
        onCategories={() =>
          Alert.alert('Sắp ra mắt', 'Màn hình Quản lý danh mục')
        }
        onPromotions={() =>
          Alert.alert('Sắp ra mắt', 'Màn hình Quản lý khuyến mãi')
        }
      />
    );
  }

  if (screen === 'ownerProducts') {
    return (
      <OwnerProductManagementScreen
        key={productRefreshKey}
        onBack={() => setScreen('ownerHome')}
        onAddProduct={() => setScreen('addProduct')}
        onEditProduct={(product) => {
          Alert.alert('Sửa sản phẩm', `Bạn muốn sửa "${product.name}"?`);
        }}
      />
    );
  }

  if (screen === 'addProduct') {
    return (
      <AddProductScreen
        onBack={() => setScreen('ownerProducts')}
        onSuccess={() => setProductRefreshKey((k) => k + 1)}
      />
    );
  }

  if (screen === 'ownerOrders') {
    return (
      <OwnerOrderManagementScreen
        onBack={() => setScreen('ownerHome')}
      />
    );
  }

  if (screen === 'profile') {
    return (
      <ProfileScreen
        userInfo={userInfo}
        onBack={() => setScreen('ownerHome')}
        onEdit={() => setScreen('editProfile')}
        onLogout={() => setScreen('login')}
      />
    );
  }

  if (screen === 'editProfile') {
    return (
      <EditProfileScreen
        userInfo={userInfo}
        onBack={() => setScreen('profile')}
        onSave={(newInfo) => {
          setUserInfo(newInfo);
          setScreen('profile');
        }}
      />
    );
  }

  return <View />;
}