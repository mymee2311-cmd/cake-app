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

  /* ================= CART HANDLERS ================= */

  const handleAddToCart = (product) => {
    setCart((prev) => {
      const found = prev.find((p) => p.id === product.id);

      if (found) {
        const updated = prev.map((p) => {
          if (p.id === product.id) {
            return { ...p, quantity: p.quantity + 1 };
          }
          return p;
        });
        return updated;
      }

      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    setCart((prev) => {
      const updated = prev.map((item) => {
        if (item.id === productId) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
      return updated;
    });
  };

  const handleRemoveItem = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
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
        onConfirm={({ paymentMethod, address, total, cartItems }) => {
              const newOrder = {
            orderCode: 'MB' + Math.floor(100000 + Math.random() * 900000),
            createdAt: new Date().toISOString(),
            paymentMethod,
            address,
            total,
            cartItems,
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

  // 5. ORDER SUCCESS
  if (screen === 'orderSuccess') {
    return (
      <OrderSuccessScreen
        orderInfo={lastOrder}
        onGoHome={() => setScreen('home')}
        onViewOrders={() => setScreen('orderHistory')}   // ← ĐỔI
      />
    );
  }
  if (screen === 'orderHistory') {
    return (
      <OrderHistoryScreen
        orders={orders}
        onBack={() => setScreen('home')}
        onViewOrderDetail={(order) => {
          setLastOrder(order);
          Alert.alert(
            'Chi tiết đơn hàng',
            `Mã đơn: ${order.orderCode}\n` +
              `Tổng: ${order.total.toLocaleString('vi-VN')}đ\n` +
              `Trạng thái: ${order.status}\n` +
              `Địa chỉ: ${order.address}`
          );
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
        onProducts={() =>
          Alert.alert('Sắp ra mắt', 'Màn hình Quản lý sản phẩm')
        }
        onOrders={() =>
          Alert.alert('Sắp ra mắt', 'Màn hình Quản lý đơn hàng')
        }
        onCategories={() =>
          Alert.alert('Sắp ra mắt', 'Màn hình Quản lý danh mục')
        }
        onPromotions={() =>
          Alert.alert('Sắp ra mắt', 'Màn hình Quản lý khuyến mãi')
        }
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