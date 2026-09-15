import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Easing,
} from 'react-native';

export default function OrderSuccessScreen({
  orderInfo,
  onGoHome,
  onViewOrders,
}) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 50,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const formatPrice = (price) => {
    return Number(price).toLocaleString('vi-VN') + 'đ';
  };

  const getPaymentLabel = (method) => {
    if (method === 'cash') return '💵 Tiền mặt';
    if (method === 'bank') return '🏦 Chuyển khoản';
    if (method === 'momo') return '📱 Momo';
    return method;
  };

  let orderCode = 'MB' + Math.floor(100000 + Math.random() * 900000);
  let cartItems = [];
  let address = '';
  let paymentMethod = '';
  let total = 0;

  if (orderInfo) {
    if (orderInfo.orderCode) {
      orderCode = orderInfo.orderCode;
    }
    if (orderInfo.cartItems) {
      cartItems = orderInfo.cartItems;
    }
    if (orderInfo.address) {
      address = orderInfo.address;
    }
    if (orderInfo.paymentMethod) {
      paymentMethod = orderInfo.paymentMethod;
    }
    if (orderInfo.total) {
      total = orderInfo.total;
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* SUCCESS ICON */}
        <Animated.View
          style={[
            styles.successCircle,
            { transform: [{ scale: scaleAnim }] },
          ]}
        >
          <Text style={styles.successIcon}>✓</Text>
        </Animated.View>

        {/* TITLE */}
        <Animated.View
          style={[
            styles.textBlock,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.title}>Đặt hàng thành công!</Text>
          <Text style={styles.subtitle}>
            Cảm ơn bạn đã tin tưởng  {'\n'}
            Đơn hàng đang được chuẩn bị.
          </Text>
        </Animated.View>

        {/* ORDER CARD */}
        <Animated.View
          style={[
            styles.orderCard,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.orderHeader}>
            <Text style={styles.orderHeaderLabel}>Mã đơn hàng</Text>
            <Text style={styles.orderCode}>{orderCode}</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionLabel}>Sản phẩm</Text>

          {cartItems.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <Text style={styles.itemName} numberOfLines={1}>
                {item.name} x {item.quantity}
              </Text>
              <Text style={styles.itemPrice}>
                {formatPrice(item.price * item.quantity)}
              </Text>
            </View>
          ))}

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>📍 Địa chỉ</Text>
            <Text style={styles.infoValue}>{address}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>💳 Thanh toán</Text>
            <Text style={styles.infoValue}>
              {getPaymentLabel(paymentMethod)}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tổng cộng</Text>
            <Text style={styles.totalValue}>{formatPrice(total)}</Text>
          </View>
        </Animated.View>

        {/* STATUS */}
        <Animated.View style={[styles.statusBox, { opacity: fadeAnim }]}>
          <Text style={styles.statusIcon}>⏳</Text>

          <View style={styles.statusText}>
            <Text style={styles.statusTitle}>Chờ xác nhận</Text>
            <Text style={styles.statusDesc}>
              Cửa hàng sẽ xác nhận đơn hàng trong vài phút
            </Text>
          </View>
        </Animated.View>
      </ScrollView>

      {/* BOTTOM BUTTONS */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={onGoHome}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryText}>Về trang chủ</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={onViewOrders}
          activeOpacity={0.8}
        >
          <Text style={styles.secondaryText}>Xem đơn hàng</Text>
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

  content: {
    paddingHorizontal: 24,
    paddingTop: 75,
    paddingBottom: 30,
    alignItems: 'center',
  },

  successCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#75B9C8',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#5A9EAD',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },

  successIcon: {
    fontSize: 58,
    color: '#FFFFFF',
    fontWeight: '800',
    marginTop: -4,
  },

  textBlock: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 28,
  },

  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#356F7C',
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 13,
    color: '#7B9EA5',
    textAlign: 'center',
    lineHeight: 20,
  },

  orderCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#D7EEF2',
    shadowColor: '#75AEB9',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },

  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  orderHeaderLabel: {
    fontSize: 13,
    color: '#7B9EA5',
  },

  orderCode: {
    fontSize: 16,
    fontWeight: '800',
    color: '#438A9C',
    letterSpacing: 1,
  },

  divider: {
    height: 1,
    backgroundColor: '#E7F2F4',
    marginVertical: 14,
  },

  sectionLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#356F7C',
    marginBottom: 10,
  },

  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  itemName: {
    fontSize: 13,
    color: '#416F78',
    flex: 1,
    marginRight: 10,
  },

  itemPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: '#438A9C',
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },

  infoLabel: {
    fontSize: 13,
    color: '#7B9EA5',
    flex: 1,
  },

  infoValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#416F78',
    flex: 1.5,
    textAlign: 'right',
  },

  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  totalLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: '#356F7C',
  },

  totalValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#438A9C',
  },

  statusBox: {
    width: '100%',
    backgroundColor: '#FFF8E8',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFE9B8',
    marginBottom: 20,
  },

  statusIcon: {
    fontSize: 26,
    marginRight: 12,
  },

  statusText: {
    flex: 1,
  },

  statusTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#B8871F',
    marginBottom: 3,
  },

  statusDesc: {
    fontSize: 12,
    color: '#C7A455',
    lineHeight: 17,
  },

  bottomBar: {
    paddingHorizontal: 24,
    paddingTop: 14,
    paddingBottom: 28,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E7F2F4',
    flexDirection: 'row',
    gap: 12,
  },

  primaryButton: {
    flex: 1,
    height: 52,
    backgroundColor: '#75B9C8',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#5A9EAD',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },

  primaryText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  secondaryButton: {
    flex: 1,
    height: 52,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#D7EEF2',
    justifyContent: 'center',
    alignItems: 'center',
  },

  secondaryText: {
    color: '#438A9C',
    fontSize: 15,
    fontWeight: '700',
  },

});