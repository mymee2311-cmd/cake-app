import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';

import { useQuery } from '@tanstack/react-query';

import { API_URL } from '../utils/api';

export default function OwnerHomeScreen({ navigation }) {
  const {
    data: orders = [],
    isLoading: loadingOrders,
    error: errorOrders,
  } = useQuery({
    queryKey: ['owner-orders'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/orders`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      return json.data || [];
    },
  });

  const {
    data: products = [],
    isLoading: loadingProducts,
    error: errorProducts,
  } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/products`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      return json.data || [];
    },
  });

  const loading = loadingOrders || loadingProducts;
  const error = errorOrders || errorProducts;

  const revenue = orders
    .filter((o) => o.status === 'completed')
    .reduce((sum, o) => sum + Number(o.total || 0), 0);

  const orderCount = orders.length;

  const productCount = products.length;

  const uniqueCustomers = new Set(
    orders.map((o) => o.customer_phone).filter(Boolean)
  );
  const customerCount = uniqueCustomers.size;

  const recentOrders = orders.slice(0, 3);

  const formatPrice = (p) => {
    return Number(p).toLocaleString('vi-VN') + 'đ';
  };

  const formatDate = (d) => {
    if (!d) return '';
    const date = new Date(d);
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const mi = String(date.getMinutes()).padStart(2, '0');
    return `${dd}/${mm} ${hh}:${mi}`;
  };

  const getStatusInfo = (status) => {
    if (status === 'pending_payment') {
      return {
        label: '💰 Chờ nhận tiền',
        bg: '#FFE8F0',
        color: '#D6336C',
      };
    }
    if (status === 'pending') {
      return {
        label: 'Chờ xác nhận',
        bg: '#FFF3D8',
        color: '#C28A32',
      };
    }
    if (status === 'confirmed') {
      return {
        label: 'Đã xác nhận',
        bg: '#E3F7EA',
        color: '#4D9B68',
      };
    }
    if (status === 'delivering') {
      return {
        label: 'Đang giao',
        bg: '#E8F0FE',
        color: '#4A6DB5',
      };
    }
    if (status === 'completed') {
      return {
        label: 'Hoàn thành',
        bg: '#E3F7EA',
        color: '#4D9B68',
      };
    }
    if (status === 'cancelled') {
      return {
        label: 'Đã hủy',
        bg: '#FFEAEA',
        color: '#D14B4B',
      };
    }
    return {
      label: status,
      bg: '#F0F0F0',
      color: '#888',
    };
  };

  const getOrderEmoji = (index) => {
    const emojis = ['🧁', '🍪', '🎂', '🥐', '🍰'];
    return emojis[index % emojis.length];
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcome}>Xin chào 👋</Text>
            <Text style={styles.ownerName}>My</Text>
          </View>

          <TouchableOpacity
            style={styles.avatar}
            onPress={() => navigation.navigate('Profile')}
            activeOpacity={0.8}
          >
            <Text style={styles.avatarText}>👩‍🍳</Text>
          </TouchableOpacity>
        </View>

        {/* TITLE */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Tổng quan cửa hàng</Text>
          <Text style={styles.subtitle}>Quản lý Mee Bakery của bạn</Text>
        </View>

        {/* STATS */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Text>💰</Text>
            </View>
            <Text style={styles.statNumber} numberOfLines={1}>
              {formatPrice(revenue)}
            </Text>
            <Text style={styles.statLabel}>Doanh thu</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Text>📦</Text>
            </View>
            <Text style={styles.statNumber}>{orderCount}</Text>
            <Text style={styles.statLabel}>Đơn hàng</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Text>🍰</Text>
            </View>
            <Text style={styles.statNumber}>{productCount}</Text>
            <Text style={styles.statLabel}>Sản phẩm</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Text>👥</Text>
            </View>
            <Text style={styles.statNumber}>{customerCount}</Text>
            <Text style={styles.statLabel}>Khách hàng</Text>
          </View>
        </View>

        {/* QUẢN LÝ */}
        <Text style={styles.sectionTitle}>Quản lý cửa hàng</Text>

        <View style={styles.managementGrid}>
          <TouchableOpacity
            style={styles.managementCard}
            onPress={() => navigation.navigate('OwnerProducts')}
            activeOpacity={0.8}
          >
            <View style={styles.managementIcon}>
              <Text style={styles.iconText}>🍰</Text>
            </View>
            <Text style={styles.managementTitle}>Sản phẩm</Text>
            <Text style={styles.managementDescription}>Quản lý bánh</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.managementCard}
            onPress={() => navigation.navigate('OwnerOrders')}
            activeOpacity={0.8}
          >
            <View style={styles.managementIcon}>
              <Text style={styles.iconText}>📦</Text>
            </View>
            <Text style={styles.managementTitle}>Đơn hàng</Text>
            <Text style={styles.managementDescription}>Quản lý đơn</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.managementCard}
            onPress={() =>
              Alert.alert('Sắp ra mắt', 'Màn hình Quản lý danh mục')
            }
            activeOpacity={0.8}
          >
            <View style={styles.managementIcon}>
              <Text style={styles.iconText}>🏷️</Text>
            </View>
            <Text style={styles.managementTitle}>Danh mục</Text>
            <Text style={styles.managementDescription}>Phân loại bánh</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.managementCard}
            onPress={() =>
              Alert.alert('Sắp ra mắt', 'Màn hình Quản lý khuyến mãi')
            }
            activeOpacity={0.8}
          >
            <View style={styles.managementIcon}>
              <Text style={styles.iconText}>🎁</Text>
            </View>
            <Text style={styles.managementTitle}>Khuyến mãi</Text>
            <Text style={styles.managementDescription}>Mã giảm giá</Text>
          </TouchableOpacity>
        </View>

        {/* ĐƠN HÀNG MỚI */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Đơn hàng mới</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('OwnerOrders')}
          >
            <Text style={styles.viewAll}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>

        {/* LOADING */}
        {loading && (
          <View style={styles.centerBox}>
            <ActivityIndicator size="small" color="#75B9C8" />
            <Text style={styles.loadingText}>Đang tải...</Text>
          </View>
        )}

        {/* ERROR */}
        {!loading && error && (
          <View style={styles.centerBox}>
            <Text style={styles.emptyIcon}>⚠️</Text>
            <Text style={styles.emptyText}>
              {error.message || 'Không thể kết nối máy chủ'}
            </Text>
          </View>
        )}

        {/* EMPTY */}
        {!loading && !error && recentOrders.length === 0 && (
          <View style={styles.centerBox}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.emptyText}>Chưa có đơn hàng nào</Text>
          </View>
        )}

        {/* DANH SÁCH ĐƠN */}
        {!loading &&
          !error &&
          recentOrders.map((order, index) => {
            const statusInfo = getStatusInfo(order.status);
            return (
              <TouchableOpacity
                key={order.id}
                style={styles.orderCard}
                onPress={() => navigation.navigate('OwnerOrders')}
                activeOpacity={0.8}
              >
                <View style={styles.orderLeft}>
                  <View style={styles.orderIcon}>
                    <Text>{getOrderEmoji(index)}</Text>
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={styles.orderName}>
                      {order.order_code || `#${order.id}`}
                    </Text>
                    <Text style={styles.orderCustomer}>
                      {order.customer_name || 'Khách'}
                    </Text>
                    <Text style={styles.orderPrice}>
                      {formatPrice(order.total)}
                    </Text>
                    <Text style={styles.orderDate}>
                      {formatDate(order.created_at)}
                    </Text>
                  </View>
                </View>

                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: statusInfo.bg },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      { color: statusInfo.color },
                    ]}
                  >
                    {statusInfo.label}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAF8FB',
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 35,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 35,
    paddingBottom: 30,
  },

  welcome: {
    fontSize: 14,
    color: '#6B969E',
    marginBottom: 2,
  },

  ownerName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#438A9C',
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1EDF2',
  },

  avatarText: {
    fontSize: 25,
  },

  titleSection: {
    marginBottom: 18,
  },

  title: {
    fontSize: 21,
    fontWeight: '800',
    color: '#356F7C',
  },

  subtitle: {
    marginTop: 5,
    fontSize: 13,
    color: '#7B9EA5',
  },

  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },

  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 15,
    borderWidth: 1,
    borderColor: '#D7EEF2',
    shadowColor: '#75AEB9',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },

  statIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#E8F7FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },

  statNumber: {
    fontSize: 17,
    fontWeight: '800',
    color: '#438A9C',
  },

  statLabel: {
    marginTop: 4,
    fontSize: 12,
    color: '#7C9BA1',
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#356F7C',
    marginTop: 18,
    marginBottom: 13,
  },

  managementGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },

  managementCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 17,
    borderWidth: 1,
    borderColor: '#D7EEF2',
    shadowColor: '#75AEB9',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },

  managementIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: '#E8F7FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  iconText: {
    fontSize: 24,
  },

  managementTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#438A9C',
  },

  managementDescription: {
    marginTop: 4,
    fontSize: 12,
    color: '#89A5AA',
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  viewAll: {
    color: '#438A9C',
    fontSize: 13,
    fontWeight: '700',
  },

  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 15,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D7EEF2',
    shadowColor: '#75AEB9',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },

  orderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  orderIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#E8F7FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  orderName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#416F78',
  },

  orderCustomer: {
    fontSize: 12,
    color: '#89A5AA',
    marginTop: 3,
  },

  orderPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: '#438A9C',
    marginTop: 4,
  },

  orderDate: {
    fontSize: 10,
    color: '#B0CFD6',
    marginTop: 3,
  },

  statusBadge: {
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 10,
  },

  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },

  centerBox: {
    alignItems: 'center',
    paddingVertical: 20,
  },

  loadingText: {
    marginTop: 8,
    fontSize: 12,
    color: '#7D9FA7',
  },

  emptyIcon: {
    fontSize: 40,
    marginBottom: 8,
  },

  emptyText: {
    fontSize: 13,
    color: '#89A5AA',
  },
});