import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

export default function OwnerHomeScreen({
  onProducts,
  onOrders,
  onCategories,
  onPromotions,
  onProfile,
  onLogout,
}) {
  return (
      <View style={styles.container}>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >

          {/* ================= HEADER ================= */}
          <View style={styles.header}>

            <View>
              <Text style={styles.welcome}>
                Xin chào 👋
              </Text>

              <Text style={styles.ownerName}>
                My
              </Text>
            </View>

            <TouchableOpacity
              style={styles.avatar}
              onPress={onProfile}
              activeOpacity={0.8}
            >
              <Text style={styles.avatarText}>
                👩‍🍳
              </Text>
            </TouchableOpacity>

          </View>


          {/* ================= TITLE ================= */}
          <View style={styles.titleSection}>

            <Text style={styles.title}>
              Tổng quan cửa hàng
            </Text>

            <Text style={styles.subtitle}>
              Quản lý Mee Bakery của bạn
            </Text>

          </View>


          {/* ================= STATISTICS ================= */}

          <View style={styles.statsRow}>

            <View style={styles.statCard}>

              <View style={styles.statIcon}>
                <Text>💰</Text>
              </View>

              <Text style={styles.statNumber}>
                0đ
              </Text>

              <Text style={styles.statLabel}>
                Doanh thu
              </Text>

            </View>


            <View style={styles.statCard}>

              <View style={styles.statIcon}>
                <Text>📦</Text>
              </View>

              <Text style={styles.statNumber}>
                2
              </Text>

              <Text style={styles.statLabel}>
                Đơn hàng
              </Text>

            </View>

          </View>


          <View style={styles.statsRow}>

            <View style={styles.statCard}>

              <View style={styles.statIcon}>
                <Text>🍰</Text>
              </View>

              <Text style={styles.statNumber}>
                10
              </Text>

              <Text style={styles.statLabel}>
                Sản phẩm
              </Text>

            </View>


            <View style={styles.statCard}>

              <View style={styles.statIcon}>
                <Text>👥</Text>
              </View>

              <Text style={styles.statNumber}>
                2
              </Text>

              <Text style={styles.statLabel}>
                Khách hàng
              </Text>

            </View>

          </View>


          {/* ================= QUICK MANAGEMENT ================= */}

          <Text style={styles.sectionTitle}>
            Quản lý cửa hàng
          </Text>


          <View style={styles.managementGrid}>

            {/* PRODUCTS */}
            <TouchableOpacity
              style={styles.managementCard}
              onPress={onProducts}
              activeOpacity={0.8}
            >

              <View style={styles.managementIcon}>
                <Text style={styles.iconText}>
                  🍰
                </Text>
              </View>

              <Text style={styles.managementTitle}>
                Sản phẩm
              </Text>

              <Text style={styles.managementDescription}>
                Quản lý bánh
              </Text>

            </TouchableOpacity>


            {/* ORDERS */}
            <TouchableOpacity
              style={styles.managementCard}
              onPress={onOrders}
              activeOpacity={0.8}
            >

              <View style={styles.managementIcon}>
                <Text style={styles.iconText}>
                  📦
                </Text>
              </View>

              <Text style={styles.managementTitle}>
                Đơn hàng
              </Text>

              <Text style={styles.managementDescription}>
                Quản lý đơn
              </Text>

            </TouchableOpacity>


            {/* CATEGORIES */}
            <TouchableOpacity
              style={styles.managementCard}
              onPress={onCategories}
              activeOpacity={0.8}
            >

              <View style={styles.managementIcon}>
                <Text style={styles.iconText}>
                  🏷️
                </Text>
              </View>

              <Text style={styles.managementTitle}>
                Danh mục
              </Text>

              <Text style={styles.managementDescription}>
                Phân loại bánh
              </Text>

            </TouchableOpacity>


            {/* PROMOTIONS */}
            <TouchableOpacity
              style={styles.managementCard}
              onPress={onPromotions}
              activeOpacity={0.8}
            >

              <View style={styles.managementIcon}>
                <Text style={styles.iconText}>
                  🎁
                </Text>
              </View>

              <Text style={styles.managementTitle}>
                Khuyến mãi
              </Text>

              <Text style={styles.managementDescription}>
                Mã giảm giá
              </Text>

            </TouchableOpacity>

          </View>


          {/* ================= NEW ORDERS ================= */}

          <View style={styles.sectionHeader}>

            <Text style={styles.sectionTitle}>
              Đơn hàng mới
            </Text>

            <TouchableOpacity onPress={onOrders}>
              <Text style={styles.viewAll}>
                Xem tất cả
              </Text>
            </TouchableOpacity>

          </View>


          {/* ================= ORDER 1 ================= */}

          <TouchableOpacity
            style={styles.orderCard}
            onPress={onOrders}
            activeOpacity={0.8}
          >

            <View style={styles.orderLeft}>

              <View style={styles.orderIcon}>
                <Text>🧁</Text>
              </View>

              <View>

                <Text style={styles.orderName}>
                  Đơn hàng #001
                </Text>

                <Text style={styles.orderCustomer}>
                  My
                </Text>

                <Text style={styles.orderPrice}>
                  215.000đ
                </Text>

              </View>

            </View>


            <View style={styles.pendingBadge}>
              <Text style={styles.pendingText}>
                Chờ xác nhận
              </Text>
            </View>

          </TouchableOpacity>


          {/* ================= ORDER 2 ================= */}

          <TouchableOpacity
            style={styles.orderCard}
            onPress={onOrders}
            activeOpacity={0.8}
          >

            <View style={styles.orderLeft}>

              <View style={styles.orderIcon}>
                <Text>🍪</Text>
              </View>

              <View>

                <Text style={styles.orderName}>
                  Đơn hàng #002
                </Text>

                <Text style={styles.orderCustomer}>
                  H
                </Text>

                <Text style={styles.orderPrice}>
                  155.000đ
                </Text>

              </View>

            </View>


            <View style={styles.confirmedBadge}>
              <Text style={styles.confirmedText}>
                Đã xác nhận
              </Text>
            </View>

          </TouchableOpacity>

        </ScrollView>

      </View>
  );
}


const styles = StyleSheet.create({

  /* ================= SAFE AREA ================= */

  safeArea: {
    flex: 1,
    backgroundColor: '#EAF8FB',
  },


  /* ================= CONTAINER ================= */

  container: {
    flex: 1,
    backgroundColor: '#EAF8FB',
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 35,
  },


  /* ================= HEADER ================= */

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


  /* ================= TITLE ================= */

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


  /* ================= STATISTICS ================= */

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


  /* ================= MANAGEMENT ================= */

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


  /* ================= ORDERS ================= */

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


  /* ================= PENDING ================= */

  pendingBadge: {
    backgroundColor: '#FFF3D8',

    paddingHorizontal: 9,
    paddingVertical: 6,

    borderRadius: 10,
  },

  pendingText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#C28A32',
  },


  /* ================= CONFIRMED ================= */

  confirmedBadge: {
    backgroundColor: '#E3F7EA',

    paddingHorizontal: 9,
    paddingVertical: 6,

    borderRadius: 10,
  },

  confirmedText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4D9B68',
  },

});