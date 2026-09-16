import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';

export default function NotificationScreen({
  notifications = [],
  onBack,
  onMarkAllRead,
  onMarkRead,
  onClearAll,
  onGoToOrder,
}) {
  const [filter, setFilter] = useState('all');

  /* ===================== FORMAT THỜI GIAN ===================== */
  const formatTime = (dateString) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${day}/${month}/${date.getFullYear()}`;
  };

  /* ===================== LOẠI THÔNG BÁO ===================== */
  const getTypeInfo = (type) => {
    if (type === 'order') {
      return {
        icon: '📦',
        bg: '#E8F0FE',
        color: '#4A6DB5',
        label: 'Đơn hàng',
      };
    }
    if (type === 'promo') {
      return {
        icon: '🎁',
        bg: '#FFF3E8',
        color: '#D18C2F',
        label: 'Khuyến mãi',
      };
    }
    if (type === 'system') {
      return {
        icon: '⚙️',
        bg: '#F0F0F5',
        color: '#7C7C8A',
        label: 'Hệ thống',
      };
    }
    return {
      icon: '🔔',
      bg: '#E8F7FA',
      color: '#5C929E',
      label: 'Khác',
    };
  };

  /* ===================== FILTER ===================== */ 
  let filteredNotifications = notifications;

  if (filter !== 'all') {
    filteredNotifications = notifications.filter(
      (n) => n.type === filter
    );
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  /* ===================== TABS ===================== */
  const filters = [
    { key: 'all', label: 'Tất cả' },
    { key: 'order', label: 'Đơn hàng' },
    { key: 'promo', label: 'Khuyến mãi' },
    { key: 'system', label: 'Hệ thống' },
  ];

  /* ===================== XỬ LÝ ===================== */
  const handleClearAll = () => {
    Alert.alert(
      'Xóa tất cả thông báo?',
      'Hành động này không thể hoàn tác.',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () => {
            if (onClearAll) onClearAll();
          },
        },
      ]
    );
  };

  const handlePress = (item) => {
    if (!item.read && onMarkRead) {
      onMarkRead(item.id);
    }

    if (item.type === 'order' && item.orderCode && onGoToOrder) {
      onGoToOrder(item.orderCode);
    }
  };

  /* ===================== HEADER ===================== */
  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={onBack}
        activeOpacity={0.7}
      >
        <Text style={styles.backIcon}>‹</Text>
      </TouchableOpacity>

      <Text style={styles.headerTitle}>Thông báo</Text>

      <TouchableOpacity
        style={styles.markButton}
        onPress={() => {
          if (onMarkAllRead) onMarkAllRead();
        }}
        activeOpacity={0.7}
      >
        <Text style={styles.markIcon}>✓</Text>
      </TouchableOpacity>
    </View>
  );

  /* ===================== EMPTY ===================== */
  if (notifications.length === 0) {
    return (
      <View style={styles.container}>
        {renderHeader()}

        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🔔</Text>
          <Text style={styles.emptyTitle}>Chưa có thông báo nào</Text>
          <Text style={styles.emptyText}>
            Các thông báo về đơn hàng và khuyến mãi sẽ hiện ở đây
          </Text>
        </View>
      </View>
    );
  }

  /* ===================== MAIN ===================== */
  return (
    <View style={styles.container}>

      {renderHeader()}

      {/* STATS */}
      <View style={styles.statsBar}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{notifications.length}</Text>
          <Text style={styles.statLabel}>Tổng</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{unreadCount}</Text>
          <Text style={styles.statLabel}>Chưa đọc</Text>
        </View>

        <TouchableOpacity
          style={styles.clearButton}
          onPress={handleClearAll}
          activeOpacity={0.8}
        >
          <Text style={styles.clearText}>🗑️ Xóa tất cả</Text>
        </TouchableOpacity>
      </View>

      {/* FILTER TABS */}
      <View style={styles.filterWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContent}
        >
          {filters.map((f) => {
            let tabStyle = styles.filterTab;
            if (filter === f.key) {
              tabStyle = styles.filterTabActive;
            }

            let textStyle = styles.filterText;
            if (filter === f.key) {
              textStyle = styles.filterTextActive;
            }

            return (
              <TouchableOpacity
                key={f.key}
                style={tabStyle}
                onPress={() => setFilter(f.key)}
                activeOpacity={0.7}
              >
                <Text style={textStyle}>{f.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* DANH SÁCH */}
      {filteredNotifications.length === 0 && (
        <View style={styles.noResultContainer}>
          <Text style={styles.noResultIcon}>🔍</Text>
          <Text style={styles.noResultText}>
            Không có thông báo ở mục này
          </Text>
        </View>
      )}

      {filteredNotifications.length > 0 && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        >
          {filteredNotifications.map((item) => {
            const typeInfo = getTypeInfo(item.type);

            let cardStyle = styles.notifCard;
            if (!item.read) {
              cardStyle = styles.notifCardUnread;
            }

            return (
              <TouchableOpacity
                key={item.id}
                style={cardStyle}
                onPress={() => handlePress(item)}
                activeOpacity={0.8}
              >
                {/* ICON */}
                <View
                  style={[
                    styles.notifIcon,
                    { backgroundColor: typeInfo.bg },
                  ]}
                >
                  <Text style={styles.notifIconText}>
                    {typeInfo.icon}
                  </Text>
                </View>

                {/* NỘI DUNG */}
                <View style={styles.notifContent}>
                  <View style={styles.notifHeader}>
                    <Text style={styles.notifTitle} numberOfLines={1}>
                      {item.title}
                    </Text>

                    {!item.read && (
                      <View style={styles.unreadDot} />
                    )}
                  </View>

                  <Text style={styles.notifBody} numberOfLines={2}>
                    {item.body}
                  </Text>

                  <View style={styles.notifFooter}>
                    <View
                      style={[
                        styles.typeBadge,
                        { backgroundColor: typeInfo.bg },
                      ]}
                    >
                      <Text
                        style={[
                          styles.typeText,
                          { color: typeInfo.color },
                        ]}
                      >
                        {typeInfo.label}
                      </Text>
                    </View>

                    <Text style={styles.notifTime}>
                      {formatTime(item.createdAt)}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

    </View>
  );
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F8FDFF',
  },

  /* ================= HEADER ================= */

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

  markButton: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: '#E8F7FA',
    justifyContent: 'center',
    alignItems: 'center',
  },

  markIcon: {
    fontSize: 20,
    color: '#438A9C',
    fontWeight: '800',
  },

  /* ================= STATS ================= */

  statsBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    gap: 12,
    alignItems: 'center',
  },

  statBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D7EEF2',
  },

  statNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: '#438A9C',
  },

  statLabel: {
    fontSize: 11,
    color: '#7B9EA5',
    marginTop: 2,
  },

  clearButton: {
    flex: 1,
    height: 50,
    backgroundColor: '#FFF0F0',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFD6D6',
  },

  clearText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#D14B4B',
  },

  /* ================= FILTER ================= */

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

  /* ================= LIST ================= */

  listContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 30,
  },

  notifCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#D7EEF2',
    shadowColor: '#75AEB9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 2,
  },

  notifCardUnread: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#75B9C8',
    shadowColor: '#75AEB9',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },

  notifIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  notifIconText: {
    fontSize: 22,
  },

  notifContent: {
    flex: 1,
  },

  notifHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  notifTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '800',
    color: '#356F7C',
    marginRight: 8,
  },

  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF5A5F',
  },

  notifBody: {
    fontSize: 12,
    color: '#7B9EA5',
    lineHeight: 18,
    marginTop: 4,
  },

  notifFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },

  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },

  typeText: {
    fontSize: 10,
    fontWeight: '700',
  },

  notifTime: {
    fontSize: 11,
    color: '#B0CFD6',
  },

  /* ================= EMPTY ================= */

  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },

  emptyIcon: {
    fontSize: 80,
    marginBottom: 16,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#438A9C',
    marginBottom: 8,
    textAlign: 'center',
  },

  emptyText: {
    fontSize: 13,
    color: '#89A5AA',
    textAlign: 'center',
    lineHeight: 20,
  },

  /* ================= NO RESULT ================= */

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