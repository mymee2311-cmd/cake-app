import React, { useState, useMemo } from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';

import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { API_URL } from '../utils/api';


{/* ==================== API ==================== */}

const fetchOrdersApi = async () => {
  const response = await fetch(`${API_URL}/api/orders`);
  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.error || 'Không thể lấy đơn hàng');
  }

  return result.data || [];
};


const updateStatusApi = async ({ orderId, newStatus }) => {
  const response = await fetch(
    `${API_URL}/api/orders/${orderId}/status`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    }
  );

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.error || 'Không thể cập nhật');
  }

  return result;
};


const confirmPaymentApi = async (orderId) => {
  const response = await fetch(
    `${API_URL}/api/orders/${orderId}/confirm-payment`,
    { method: 'PUT' }
  );

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.error || 'Không thể xác nhận');
  }

  return result;
};


{/* ==================== HELPERS ==================== */}

const getStatusInfo = (status) => {
  switch (status) {
    case 'pending_payment':
      return {
        label: '💰 Chờ nhận tiền',
        bg: '#FFE8F0',
        color: '#D6336C',
      };

    case 'pending':
      return {
        label: 'Chờ xác nhận',
        bg: '#FFF8E8',
        color: '#B8871F',
      };

    case 'confirmed':
      return {
        label: 'Đã xác nhận',
        bg: '#E3F0FF',
        color: '#3B7BBF',
      };

    case 'delivering':
      return {
        label: 'Đang giao',
        bg: '#E8F0FE',
        color: '#4A6DB5',
      };

    case 'completed':
      return {
        label: 'Hoàn thành',
        bg: '#E3F7EA',
        color: '#4D9B68',
      };

    case 'cancelled':
      return {
        label: 'Đã hủy',
        bg: '#FFEAEA',
        color: '#D14B4B',
      };

    default:
      return {
        label: 'Không rõ',
        bg: '#F0F0F0',
        color: '#888888',
      };
  }
};


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


const getPaymentLabel = (m) => {
  if (m === 'cash') return 'Tiền mặt';
  if (m === 'bank') return 'Chuyển khoản';
  if (m === 'momo') return 'Momo';
  return m || 'Không rõ';
};


const FILTERS = [
  { key: 'all', label: 'Tất cả' },
  { key: 'pending_payment', label: 'Chờ nhận tiền' },
  { key: 'pending', label: 'Chờ xác nhận' },
  { key: 'confirmed', label: 'Đã xác nhận' },
  { key: 'delivering', label: 'Đang giao' },
  { key: 'completed', label: 'Hoàn thành' },
  { key: 'cancelled', label: 'Đã hủy' },
];


{/*==================== SCREEN ==================== */}

export default function OwnerOrderManagementScreen({ navigation }) {
  const [filter, setFilter] = useState('all');

  const queryClient = useQueryClient();

  const {
    data: orders = [],
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['owner-orders'],
    queryFn: fetchOrdersApi,
  });

  const updateStatusMutation = useMutation({
    mutationFn: updateStatusApi,

    onSuccess: () => {
      Alert.alert('Thành công', 'Đã cập nhật trạng thái');
      queryClient.invalidateQueries({ queryKey: ['owner-orders'] });
    },

    onError: (err) => {
      Alert.alert('Lỗi', err.message);
    },
  });


  const confirmPaymentMutation = useMutation({
    mutationFn: confirmPaymentApi,

    onSuccess: () => {
      Alert.alert('Thành công', 'Đã xác nhận nhận tiền!');
      queryClient.invalidateQueries({ queryKey: ['owner-orders'] });
    },

    onError: (err) => {
      Alert.alert('Lỗi', err.message);
    },
  });

  const handleUpdateStatus = (orderId, newStatus) => {
    updateStatusMutation.mutate({ orderId, newStatus });
  };


  const handleConfirmPayment = (orderId) => {
    Alert.alert(
      'Xác nhận đã nhận tiền',
      'Bạn chắc chắn đã nhận được tiền chuyển khoản từ khách?',
      [
        { text: 'Hủy', style: 'cancel' },

        {
          text: 'Đã nhận tiền',
          onPress: () => confirmPaymentMutation.mutate(orderId),
        },
      ]
    );
  };

  const filteredOrders = useMemo(() => {
    if (filter === 'all') return orders;
    return orders.filter((o) => o.status === filter);
  }, [orders, filter]);


  const pendingPaymentCount = useMemo(
    () => orders.filter((o) => o.status === 'pending_payment').length,
    [orders]
  );


  const isBusy =
    updateStatusMutation.isPending || confirmPaymentMutation.isPending;


  return (
    <View style={styles.container}>

      {/* ============ HEADER ============ */}

      <View style={styles.header}>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>


        <Text style={styles.headerTitle}>Quản lý đơn hàng</Text>


        <View style={styles.headerRight}>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{orders.length}</Text>
          </View>
        </View>

      </View>


      {/* ============ ALERT ============ */}

      {pendingPaymentCount > 0 && (
        <View style={styles.alertBox}>

          <Text style={styles.alertIcon}>💰</Text>

          <Text style={styles.alertText}>
            Có <Text style={styles.alertBold}>{pendingPaymentCount}</Text> đơn
            chờ xác nhận nhận tiền
          </Text>

        </View>
      )}


      {/* ============ FILTER TABS ============ */}

      <View style={styles.filterWrapper}>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContent}
        >

          {FILTERS.map((f) => {
            const active = filter === f.key;
            const isPendingPayment = f.key === 'pending_payment';
            const showAlert =
              isPendingPayment && pendingPaymentCount > 0 && !active;

            return (
              <TouchableOpacity
                key={f.key}
                style={[
                  styles.filterTab,
                  active && styles.filterTabActive,
                  showAlert && styles.filterTabAlert,
                ]}
                onPress={() => setFilter(f.key)}
                activeOpacity={0.7}
              >

                <Text
                  style={[
                    styles.filterText,
                    active && styles.filterTextActive,
                    showAlert && styles.filterTextAlert,
                  ]}
                >
                  {f.label}
                  {isPendingPayment && pendingPaymentCount > 0
                    ? ` (${pendingPaymentCount})`
                    : ''}
                </Text>

              </TouchableOpacity>
            );
          })}

        </ScrollView>

      </View>


      {/* ============ LOADING ============ */}

      {isLoading && (
        <View style={styles.centerBox}>

          <ActivityIndicator size="large" color="#75B9C8" />

          <Text style={styles.loadingText}>Đang tải đơn hàng...</Text>

        </View>
      )}


      {/* ============ ERROR ============ */}

      {!isLoading && isError && (
        <View style={styles.centerBox}>

          <Text style={styles.errorIcon}>⚠️</Text>

          <Text style={styles.errorText}>
            {error?.message || 'Không thể kết nối máy chủ'}
          </Text>

          <TouchableOpacity
            style={styles.retryButton}
            onPress={refetch}
          >
            <Text style={styles.retryText}>Thử lại</Text>
          </TouchableOpacity>

        </View>
      )}


      {/* ============ EMPTY ============ */}

      {!isLoading && !isError && filteredOrders.length === 0 && (
        <View style={styles.centerBox}>

          <Text style={styles.emptyIcon}>📦</Text>

          <Text style={styles.emptyText}>
            {orders.length === 0
              ? 'Chưa có đơn hàng nào'
              : 'Không có đơn ở trạng thái này'}
          </Text>

        </View>
      )}


      {/* ============ LIST ============ */}

      {!isLoading && !isError && filteredOrders.length > 0 && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              colors={['#75B9C8']}
              tintColor="#75B9C8"
            />
          }
        >

          {filteredOrders.map((order) => {
            const info = getStatusInfo(order.status);

            return (
              <View key={order.id} style={styles.orderCard}>

                {/* ============ HEADER  ============ */}

                <View style={styles.orderHeader}>

                  <View>
                    <Text style={styles.orderCode}>
                      {order.order_code}
                    </Text>

                    <Text style={styles.orderDate}>
                      {formatDate(order.created_at)}
                    </Text>
                  </View>


                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: info.bg },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        { color: info.color },
                      ]}
                    >
                      {info.label}
                    </Text>
                  </View>

                </View>


                <View style={styles.divider} />


                {/* ============ INFO ============ */}

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>👤 Khách:</Text>
                  <Text style={styles.infoValue}>
                    {order.customer_name || 'Khách'}
                  </Text>
                </View>


                {order.customer_phone ? (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>📱 SĐT:</Text>
                    <Text style={styles.infoValue}>
                      {order.customer_phone}
                    </Text>
                  </View>
                ) : null}


                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>📍 Địa chỉ:</Text>
                  <Text style={styles.infoValue} numberOfLines={2}>
                    {order.address}
                  </Text>
                </View>


                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>💳 Thanh toán:</Text>
                  <Text style={styles.infoValue}>
                    {getPaymentLabel(order.payment_method)}
                  </Text>
                </View>


                <View style={styles.divider} />


                {/* ============ TOTAL ============ */}

                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Tổng cộng</Text>
                  <Text style={styles.totalValue}>
                    {formatPrice(order.total)}
                  </Text>
                </View>


                {/* ============ ACTIONS ============ */}

                {order.status === 'pending_payment' && (
                  <View style={styles.actionsRow}>

                    <TouchableOpacity
                      style={[styles.actionBtn, styles.cancelBtn]}
                      onPress={() =>
                        handleUpdateStatus(order.id, 'cancelled')
                      }
                      disabled={isBusy}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.cancelText}>Hủy đơn</Text>
                    </TouchableOpacity>


                    <TouchableOpacity
                      style={[styles.actionBtn, styles.paymentBtn]}
                      onPress={() => handleConfirmPayment(order.id)}
                      disabled={isBusy}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.paymentBtnText}>
                        💰 Đã nhận tiền
                      </Text>
                    </TouchableOpacity>

                  </View>
                )}


                {order.status === 'pending' && (
                  <View style={styles.actionsRow}>

                    <TouchableOpacity
                      style={[styles.actionBtn, styles.cancelBtn]}
                      onPress={() =>
                        handleUpdateStatus(order.id, 'cancelled')
                      }
                      disabled={isBusy}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.cancelText}>Hủy đơn</Text>
                    </TouchableOpacity>


                    <TouchableOpacity
                      style={[styles.actionBtn, styles.confirmBtn]}
                      onPress={() =>
                        handleUpdateStatus(order.id, 'confirmed')
                      }
                      disabled={isBusy}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.confirmBtnText}>Xác nhận</Text>
                    </TouchableOpacity>

                  </View>
                )}


                {order.status === 'confirmed' && (
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.deliverBtn]}
                    onPress={() =>
                      handleUpdateStatus(order.id, 'delivering')
                    }
                    disabled={isBusy}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.deliverText}>Bắt đầu giao</Text>
                  </TouchableOpacity>
                )}


                {order.status === 'delivering' && (
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.completeBtn]}
                    onPress={() =>
                      handleUpdateStatus(order.id, 'completed')
                    }
                    disabled={isBusy}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.completeText}>Hoàn thành</Text>
                  </TouchableOpacity>
                )}

              </View>
            );
          })}

        </ScrollView>
      )}

    </View>
  );
}


{/* ==================== STYLES ==================== */}
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
    borderBottomWidth: 1,
    borderBottomColor: '#EEF7F9',
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
    fontSize: 18,
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


  /* ============ ALERT ============ */

  alertBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 10,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#FFE8F0',
    borderWidth: 1,
    borderColor: '#FFB8D0',
    gap: 8,
  },

  alertIcon: {
    fontSize: 18,
  },

  alertText: {
    flex: 1,
    fontSize: 13,
    color: '#D6336C',
    fontWeight: '600',
  },

  alertBold: {
    fontWeight: '800',
    fontSize: 15,
  },


  /* ============ FILTER ============ */

  filterWrapper: {
    paddingVertical: 12,
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
    backgroundColor: '#75B9C8',
    borderColor: '#75B9C8',
  },

  filterTabAlert: {
    backgroundColor: '#FFF0F5',
    borderColor: '#FFB8D0',
  },

  filterText: {
    fontSize: 13,
    color: '#7B9EA5',
    fontWeight: '600',
  },

  filterTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  filterTextAlert: {
    color: '#D6336C',
    fontWeight: '800',
  },


  /* ============ LIST ============ */

  listContent: {
    paddingHorizontal: 20,
    paddingTop: 4,
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

  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },

  infoLabel: {
    fontSize: 12,
    color: '#7B9EA5',
    marginRight: 6,
  },

  infoValue: {
    flex: 1,
    fontSize: 12,
    color: '#416F78',
    fontWeight: '600',
  },

  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },

  totalLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#356F7C',
  },

  totalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#438A9C',
  },


  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },

  actionBtn: {
    flex: 1,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },

  cancelBtn: {
    backgroundColor: '#FFF0F0',
    borderWidth: 1,
    borderColor: '#FFD6D6',
    marginTop: 0,
  },

  cancelText: {
    color: '#D14B4B',
    fontSize: 13,
    fontWeight: '700',
  },

  confirmBtn: {
    backgroundColor: '#75B9C8',
    marginTop: 0,
  },

  confirmBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  paymentBtn: {
    backgroundColor: '#D6336C',
    marginTop: 0,
  },

  paymentBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  deliverBtn: {
    backgroundColor: '#4A6DB5',
  },

  deliverText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  completeBtn: {
    backgroundColor: '#4D9B68',
  },

  completeText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },


  /* ============ STATES ============ */

  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },

  loadingText: {
    marginTop: 10,
    fontSize: 13,
    color: '#7D9FA7',
  },

  errorIcon: {
    fontSize: 40,
    marginBottom: 8,
  },

  errorText: {
    fontSize: 13,
    color: '#7D9FA7',
    textAlign: 'center',
    marginBottom: 16,
  },

  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#75B9C8',
  },

  retryText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  emptyIcon: {
    fontSize: 60,
    marginBottom: 12,
  },

  emptyText: {
    fontSize: 14,
    color: '#89A5AA',
    textAlign: 'center',
  },

});