import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';

import { formatPrice, UI_EMOJI } from '../utils/emoji';
import { useApp } from '../context/AppContext';
import { API_URL } from '../utils/api'; 

export default function CartScreen({ navigation }) {
  const { cart, updateQuantity, removeItem, setCart } = useApp();

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const totalItems = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  useEffect(() => {
    const refreshStock = async () => {
      if (cart.length === 0) return;
      try {
        const response = await fetch(`${API_URL}/api/products`); 
        const result = await response.json();
        const latestProducts = result.data || result;

        setCart((prevCart) =>
          prevCart.map((item) => {
            const latest = latestProducts.find((p) => p.id === item.id);
            if (latest) {
              return { ...item, stock: Number(latest.stock || 0) };
            }
            return item;
          })
        );
      } catch (error) {
        console.log('Lỗi cập nhật stock:', error.message);
      }
    };

    refreshStock();
  }, []);

  /* ============ XỬ LÝ ============= */
  const handleIncrease = (item) => {
    if (item.stock && item.quantity >= item.stock) {
      Alert.alert(
        'Đã đạt giới hạn',
        `Sản phẩm "${item.name}" chỉ còn ${item.stock} trong kho.`,
        [{ text: 'Đã hiểu' }]
      );
      return;
    }
    updateQuantity(item.id, item.quantity + 1);
  };

  const handleDecrease = (item) => {
    if (item.quantity <= 1) {
      handleRemove(item);
      return;
    }
    updateQuantity(item.id, item.quantity - 1);
  };

  const handleRemove = (item) => {
    Alert.alert(
      'Xóa sản phẩm',
      `Bạn có chắc muốn xóa "${item.name}" khỏi giỏ hàng?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () => removeItem(item.id),
        },
      ]
    );
  };

  const handleCheckout = () => {
    const outOfStockItems = cart.filter(
      (item) => !item.stock || item.stock <= 0
    );

    if (outOfStockItems.length > 0) {
      Alert.alert(
        'Không thể thanh toán',
        `Các sản phẩm sau đã hết hàng:\n${outOfStockItems
          .map((i) => `• ${i.name}`)
          .join('\n')}\n\nVui lòng xóa chúng khỏi giỏ hàng.`,
        [{ text: 'Đã hiểu' }]
      );
      return;
    }

    const overStockItems = cart.filter(
      (item) => item.stock && item.quantity > item.stock
    );

    if (overStockItems.length > 0) {
      Alert.alert(
        'Không thể thanh toán',
        `Các sản phẩm sau không đủ hàng:\n${overStockItems
          .map(
            (i) => `• ${i.name} (còn ${i.stock}, bạn chọn ${i.quantity})`
          )
          .join('\n')}\n\nVui lòng giảm số lượng.`,
        [{ text: 'Đã hiểu' }]
      );
      return;
    }

    navigation.navigate('Checkout');
  };

  /* ============ HEADER ============ */
  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
      >
        <Text style={styles.backIcon}>{UI_EMOJI.back}</Text>
      </TouchableOpacity>

      <Text style={styles.headerTitle}>Giỏ hàng</Text>

      <View style={styles.headerRight}>
        {totalItems > 0 && (
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{totalItems}</Text>
          </View>
        )}
      </View>
    </View>
  );

  /* ============ EMPTY CART ============ */
  if (cart.length === 0) {
    return (
      <View style={styles.container}>
        {renderHeader()}

        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>{UI_EMOJI.cart}</Text>

          <Text style={styles.emptyTitle}>Giỏ hàng đang trống</Text>

          <Text style={styles.emptyText}>
            Hãy thêm vài chiếc bánh xinh xắn nhé!
          </Text>

          <TouchableOpacity
            style={styles.backToShopButton}
            onPress={() => navigation.navigate('Home')}
            activeOpacity={0.8}
          >
            <Text style={styles.backToShopText}>Tiếp tục mua sắm</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  /* ============ CART LIST ============ */
  return (
    <View style={styles.container}>
      {renderHeader()}

      <View style={styles.listWrapper}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        >
          {cart.map((item) => {
            const isOutOfStock = !item.stock || item.stock <= 0;
            const isOverStock = item.stock && item.quantity > item.stock;

            return (
              <View
                key={item.id}
                style={[
                  styles.itemCard,
                  isOutOfStock && styles.itemCardOutOfStock,
                ]}
              >
            
                <View style={styles.itemImage}>
                  <Text style={styles.itemEmoji}>
                    {item.emoji || UI_EMOJI.cake}
                  </Text>
                </View>

                <View style={styles.itemInfo}>
                  <Text style={styles.itemName} numberOfLines={1}>
                    {item.name}
                  </Text>

                  <Text style={styles.itemPrice}>
                    {formatPrice(item.price)}
                  </Text>

                  {isOutOfStock && (
                    <Text style={styles.outOfStockWarning}>
                      ⚠️ Sản phẩm đã hết hàng
                    </Text>
                  )}
                  {isOverStock && !isOutOfStock && (
                    <Text style={styles.outOfStockWarning}>
                      ⚠️ Chỉ còn {item.stock} trong kho
                    </Text>
                  )}

                  <View style={styles.quantityRow}>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => handleDecrease(item)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.quantityButtonText}>
                        {UI_EMOJI.minus}
                      </Text>
                    </TouchableOpacity>

                    <Text style={styles.quantityValue}>
                      {item.quantity}
                    </Text>

                    <TouchableOpacity
                      style={[
                        styles.quantityButton,
                        (isOutOfStock || item.quantity >= item.stock) &&
                          styles.quantityButtonDisabled,
                      ]}
                      onPress={() => handleIncrease(item)}
                      disabled={isOutOfStock || item.quantity >= item.stock}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.quantityButtonText}>
                        {UI_EMOJI.plus}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.itemRight}>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemove(item)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.removeIcon}>
                      {UI_EMOJI.trash}
                    </Text>
                  </TouchableOpacity>

                  <Text style={styles.subtotal}>
                    {formatPrice(item.price * item.quantity)}
                  </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.bottomBar}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>
            Tạm tính ({totalItems} sản phẩm)
          </Text>
          <Text style={styles.summaryValue}>{formatPrice(total)}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Phí vận chuyển</Text>
          <Text style={styles.summaryValue}>Miễn phí</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>Tổng cộng</Text>
          <Text style={styles.totalValue}>{formatPrice(total)}</Text>
        </View>

        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={handleCheckout}
          activeOpacity={0.8}
        >
          <Text style={styles.checkoutText}>Tiến hành thanh toán</Text>
          <Text style={styles.checkoutArrow}>›</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FDFF',
  },

  header: {
    height: 65,
    paddingTop: 44,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FDFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEF7F9',
    marginBottom: 8,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D7EEF2',
  },

  backIcon: {
    fontSize: 30,
    color: '#438A9C',
    marginTop: -3,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#356F7C',
  },

  headerRight: {
    width: 42,
    alignItems: 'flex-end',
  },

  countBadge: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#75B9C8',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 7,
  },

  countText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },

  listWrapper: {
    flex: 1,
  },

  listContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },

  itemCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#DDEFF3',
    shadowColor: '#75AEB9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 2,
  },

  itemCardOutOfStock: {
    borderColor: '#FFB3B3',
    backgroundColor: '#FFF8F8',
  },

  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 14,
    backgroundColor: '#EAF8FB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  itemEmoji: {
    fontSize: 36,
  },

  itemInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },

  itemName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#438A9C',
  },

  itemPrice: {
    fontSize: 12,
    color: '#89A5AA',
    marginTop: 2,
  },

  outOfStockWarning: {
    fontSize: 11,
    color: '#FF5A5F',
    fontWeight: '700',
    marginTop: 4,
  },

  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },

  quantityButton: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: '#E8F7FA',
    justifyContent: 'center',
    alignItems: 'center',
  },

  quantityButtonDisabled: {
    opacity: 0.4,
  },

  quantityButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#438A9C',
    marginTop: -2,
  },

  quantityValue: {
    minWidth: 36,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '800',
    color: '#416F78',
    marginHorizontal: 10,
  },

  itemRight: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginLeft: 8,
  },

  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#FFF0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },

  removeIcon: {
    fontSize: 15,
  },

  subtotal: {
    fontSize: 13,
    fontWeight: '800',
    color: '#438A9C',
  },

  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },

  emptyIcon: {
    fontSize: 70,
    marginBottom: 16,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#438A9C',
    marginBottom: 8,
  },

  emptyText: {
    fontSize: 13,
    color: '#89A5AA',
    textAlign: 'center',
    marginBottom: 24,
  },

  backToShopButton: {
    paddingHorizontal: 28,
    paddingVertical: 12,
    backgroundColor: '#75B9C8',
    borderRadius: 14,
    shadowColor: '#5A9EAD',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },

  backToShopText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  bottomBar: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderColor: '#E7F2F4',
    shadowColor: '#75AEB9',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  summaryLabel: {
    fontSize: 13,
    color: '#7B9EA5',
  },

  summaryValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#416F78',
  },

  divider: {
    height: 1,
    backgroundColor: '#E7F2F4',
    marginVertical: 10,
  },

  totalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: '#356F7C',
  },

  totalValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#438A9C',
  },

  checkoutButton: {
    height: 54,
    borderRadius: 15,
    backgroundColor: '#75B9C8',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 14,
    shadowColor: '#5A9EAD',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },

  checkoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  checkoutArrow: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    marginLeft: 8,
    marginTop: -3,
  },
});