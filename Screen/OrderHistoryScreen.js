import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ActivityIndicator,
} from 'react-native';

import { API_URL } from '../utils/api';

export default function OrderHistoryScreen({
  onBack,
  onViewOrderDetail,
}) {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`${API_URL}/api/orders`);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Không thể lấy đơn');
      }

      setOrders(result.data || []);
    } catch (err) {
      console.error('Lỗi lấy đơn:', err);
      setError('Không thể kết nối máy chủ');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return Number(price).toLocaleString('vi-VN') + 'đ';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const getStatusInfo = (status) => {
    if (status === 'pending_payment') {
      return {
        label: 'Chờ shop nhận tiền',
        bg: '#FFE8F0',
        color: '#D6336C',
        icon: '💰',
      };
    }
    if (status === 'pending') {
      return {
        label: 'Chờ xác nhận',
        bg: '#FFF8E8',
        color: '#B8871F',
        icon: '⏳',
      };
    }
    if (status === 'confirmed') {
      return {
        label: 'Đã xác nhận',
        bg: '#E3F0FF',
        color: '#3B7BBF',
        icon: '✅',
      };
    }
    if (status === 'delivering') {
      return {
        label: 'Đang giao',
        bg: '#E8F0FE',
        color: '#4A6DB5',
        icon: '🚚',
      };
    }
    if (status === 'completed') {
      return {
        label: 'Hoàn thành',
        bg: '#E3F7EA',
        color: '#4D9B68',
        icon: '🎉',
      };
    }
    if (status === 'cancelled') {
      return {
        label: 'Đã hủy',
        bg: '#FFEAEA',
        color: '#D14B4B',
        icon: '❌',
      };
    }
    return {
      label: 'Không xác định',
      bg: '#F0F0F0',
      color: '#888888',
      icon: '❓',
    };
  };

  let filteredOrders = orders;
  if (filter !== 'all') {
    filteredOrders = orders.filter((order) => order.status === filter);
  }

  const filters = [
    { key: 'all', label: 'Tất cả' },
    { key: 'pending_payment', label: 'Chờ nhận tiền' },
    { key: 'pending', label: 'Chờ xác nhận' },
    { key: 'confirmed', label: 'Đã xác nhận' },
    { key: 'delivering', label: 'Đang giao' },
    { key: 'completed', label: 'Hoàn thành' },
    { key: 'cancelled', label: 'Đã hủy' },
  ];

  const renderOrderItem = ({ item }) => {
    const statusInfo = getStatusInfo(item.status);

    return (
      <TouchableOpacity
        style={styles.orderCard}
        onPress={() => {
          if (onViewOrderDetail) onViewOrderDetail(item);
        }}
        activeOpacity={0.8}
      >
        <View style={styles.orderHeader}>
          <View>
            <Text style={styles.orderCode}>
              {item.order_code || 'MB000000'}
            </Text>
            <Text style={styles.orderDate}>
              {formatDate(item.created_at)}
            </Text>
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
              {statusInfo.icon} {statusInfo.label}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.previewRow}>
          <Text style={styles.previewIcon}>🧁</Text>

          <View style={styles.previewInfo}>
            <Text style={styles.previewText}>
              {item.customer_name || 'Khách'}
            </Text>
            <Text style={styles.previewPrice}>
              {formatPrice(item.total || 0)}
            </Text>
          </View>

          <Text style={styles.arrow}>›</Text>
        </View>
      </TouchableOpacity>
    );
  };

  /* HEADER */
  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={onBack}
        activeOpacity={0.7}
      >
        <Text style={styles.backIcon}>‹</Text>
      </TouchableOpacity>

      <Text style={styles.headerTitle}>Đơn hàng của tôi</Text>

      <View style={styles.headerRight}>
        {orders.length > 0 && (
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{orders.length}</Text>
          </View>
        )}
      </View>
    </View>
  );

  /* LOADING */
  if (loading) {
    return (
      <View style={styles.container}>
        {renderHeader()}
        <View style={styles.noResultContainer}>
          <ActivityIndicator size="large" color="#75B9C8" />
          <Text style={styles.noResultText}>
            Đang tải đơn hàng...
          </Text>
        </View>
      </View>
    );
  }

  /* ERROR */
  if (error !== '') {
    return (
      <View style={styles.container}>
        {renderHeader()}
        <View style={styles.noResultContainer}>
          <Text style={styles.noResultIcon}>⚠️</Text>
          <Text style={styles.noResultText}>{error}</Text>

          <TouchableOpacity
            style={styles.backToShopButton}
            onPress={fetchOrders}
          >
            <Text style={styles.backToShopText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  /* EMPTY */
  if (orders.length === 0) {
    return (
      <View style={styles.container}>
        {renderHeader()}

        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📦</Text>
          <Text style={styles.emptyTitle}>
            Chưa có đơn hàng nào
          </Text>
          <Text style={styles.emptyText}>
            Hãy đặt bánh để xem lịch sử đơn hàng nhé!
          </Text>

          <TouchableOpacity
            style={styles.backToShopButton}
            onPress={onBack}
            activeOpacity={0.8}
          >
            <Text style={styles.backToShopText}>Mua bánh ngay</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  /* MAIN */
  return (
    <View style={styles.container}>
      {renderHeader()}

      {/* FILTER TABS */}
      <View style={styles.filterWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContent}
        >
          {filters.map((f) => {
            const active = filter === f.key;
            return (
              <TouchableOpacity
                key={f.key}
                style={[
                  styles.filterTab,
                  active && styles.filterTabActive,
                ]}
                onPress={() => setFilter(f.key)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.filterText,
                    active && styles.filterTextActive,
                  ]}
                >
                  {f.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* DANH SÁCH */}
      {filteredOrders.length === 0 && (
        <View style={styles.noResultContainer}>
          <Text style={styles.noResultIcon}>🔍</Text>
          <Text style={styles.noResultText}>
            Không có đơn hàng ở trạng thái này
          </Text>
        </View>
      )}

      {filteredOrders.length > 0 && (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item, index) => String(item.id || index)}
          renderItem={renderOrderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FDFF',
  },

  /* HEADER */
  header: {
    height: 65,
    paddingTop: 44,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FDFF',
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

  /* FILTER */
  filterWrapper: {
    paddingVertical: 12,
    marginBottom: 8,
  },

  filterContent: {
    paddingHorizontal: 20,
    gap: 8,
    alignItems: 'center',
  },

  filterTab: {
    paddingHorizontal: 14,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D7EEF2',
  },

  filterTabActive: {
    paddingHorizontal: 14,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#75B9C8',
    justifyContent: 'center',
    alignItems: 'center',
  },

  filterText: {
    fontSize: 13,
    color: '#7B9EA5',
    fontWeight: '600',
  },

  filterTextActive: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '700',
  },

  /* LIST */
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 30,
  },

  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#D7EEF2',
    shadowColor: '#75AEB9',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },

  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  orderCode: {
    fontSize: 15,
    fontWeight: '800',
    color: '#438A9C',
    letterSpacing: 0.5,
  },

  orderDate: {
    fontSize: 11,
    color: '#89A5AA',
    marginTop: 4,
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },

  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },

  divider: {
    height: 1,
    backgroundColor: '#E7F2F4',
    marginVertical: 12,
  },

  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  previewIcon: {
    fontSize: 30,
    marginRight: 12,
  },

  previewInfo: {
    flex: 1,
  },

  previewText: {
    fontSize: 13,
    color: '#7B9EA5',
  },

  previewPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: '#438A9C',
    marginTop: 3,
  },

  arrow: {
    fontSize: 26,
    color: '#B0CFD6',
    fontWeight: '700',
  },

  /* EMPTY */
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

  /* NO RESULT */
  noResultContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },

  noResultIcon: {
    fontSize: 45,
    marginBottom: 10,
  },

  noResultText: {
    fontSize: 13,
    color: '#89A5AA',
    textAlign: 'center',
  },
});