import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';

export default function HomeScreen({ onOwnerLogin }) {
  return (
    <View style={styles.container}>

      {/* ================= MAIN SCROLL ================= */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >

        {/* ================= HEADER ================= */}
        <View style={styles.header}>
          <View>
            <Text style={styles.smallTitle}>
              Chào mừng đến với
            </Text>

            <Text style={styles.logoText}>
              Mee Bakery
            </Text>
          </View>

          {/* Chủ quán */}
          <TouchableOpacity
            style={styles.ownerButton}
            onPress={onOwnerLogin}
            activeOpacity={0.7}
          >
            <Text style={styles.ownerIcon}>🔐</Text>
          </TouchableOpacity>
        </View>


        {/* ================= SEARCH ================= */}
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>
            🔍
          </Text>

          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm bánh..."
            placeholderTextColor="#9BB8BE"
          />
        </View>


        {/* ================= BANNER + OFFER ================= */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          style={styles.bannerScroll}
          contentContainerStyle={styles.bannerScrollContent}
        >

          {/* ---------- BANNER ---------- */}
          <View style={styles.banner}>

            <View style={styles.bannerText}>

              <Text style={styles.bannerSmall}>
                Sweet moments
              </Text>

              <Text style={styles.bannerTitle}>
                Made with love ♡
              </Text>
            </View>

            <Text style={styles.bannerCake}>
              🧁
            </Text>

          </View>


          {/* ---------- SPECIAL OFFER ---------- */}
          <View style={styles.offer}>

            <View style={styles.offerContent}>

              <Text style={styles.offerTitle}>
                Ưu đãi hôm nay ✨
              </Text>

              <Text style={styles.offerText}>
                Giảm 10% cho đơn hàng đầu tiên
              </Text>

              <Text style={styles.offerCode}>
                MEE10
              </Text>

            </View>

            <Text style={styles.offerEmoji}>
              🎁
            </Text>

          </View>

        </ScrollView>


        {/* ================= CATEGORY ================= */}
        <View style={styles.sectionHeader}>

          <Text style={styles.sectionTitle}>
            Danh mục
          </Text>

          <Text style={styles.seeAll}>
            Xem tất cả
          </Text>

        </View>


        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
        >

          {/* CATEGORY 1 */}
          <TouchableOpacity
            style={styles.category}
            activeOpacity={0.7}
          >
            <Text style={styles.categoryIcon}>
              🌰
            </Text>

            <Text style={styles.categoryText}>
              Bánh hạt
            </Text>
          </TouchableOpacity>


          {/* CATEGORY 2 */}
          <TouchableOpacity
            style={styles.category}
            activeOpacity={0.7}
          >
            <Text style={styles.categoryIcon}>
              🍪
            </Text>

            <Text style={styles.categoryText}>
              Bánh quy
            </Text>
          </TouchableOpacity>


          {/* CATEGORY 3 */}
          <TouchableOpacity
            style={styles.category}
            activeOpacity={0.7}
          >
            <Text style={styles.categoryIcon}>
              🥐
            </Text>

            <Text style={styles.categoryText}>
              Bánh mì
            </Text>
          </TouchableOpacity>


          {/* CATEGORY 4 */}
          <TouchableOpacity
            style={styles.category}
            activeOpacity={0.7}
          >
            <Text style={styles.categoryIcon}>
              🍰
            </Text>

            <Text style={styles.categoryText}>
              Bánh kem
            </Text>
          </TouchableOpacity>

        </ScrollView>


        {/* ================= PRODUCTS HEADER ================= */}
        <View style={styles.sectionHeader}>

          <Text style={styles.sectionTitle}>
            Bánh nổi bật
          </Text>

          <Text style={styles.seeAll}>
            Xem tất cả
          </Text>

        </View>


        {/* ================= PRODUCTS ================= */}
        <View style={styles.productRow}>

          {/* ---------- PRODUCT 1 ---------- */}
          <TouchableOpacity
            style={styles.productCard}
            activeOpacity={0.8}
          >

            <View style={styles.productImage}>
              <Text style={styles.categoryIcon}>
                🌰
              </Text>
            </View>

            <Text style={styles.productName}>
              Bánh hạnh nhân
            </Text>

            <Text style={styles.productDescription}>
              almond cookie
            </Text>

            <View style={styles.priceRow}>

              <Text style={styles.price}>
                135.000đ/1 hộp
              </Text>

              <View style={styles.addButton}>
                <Text style={styles.addText}>
                  +
                </Text>
              </View>

            </View>

          </TouchableOpacity>


          {/* ---------- PRODUCT 2 ---------- */}
          <TouchableOpacity
            style={styles.productCard}
            activeOpacity={0.8}
          >

            <View style={styles.productImage}>
              <Text style={styles.productEmoji}>
                🍞
              </Text>
            </View>

            <Text style={styles.productName}>
              Bánh chuối
            </Text>

            <Text style={styles.productDescription}>
              Banana cake
            </Text>

            <View style={styles.priceRow}>

              <Text style={styles.price}>
                60.000đ/1 ổ
              </Text>

              <View style={styles.addButton}>
                <Text style={styles.addText}>
                  +
                </Text>
              </View>

            </View>

          </TouchableOpacity>

        </View>

      </ScrollView>


      {/* ================= BOTTOM NAVIGATION ================= */}
      <View style={styles.bottomNav}>

        {/* HOME */}
        <TouchableOpacity
          style={styles.navItem}
          activeOpacity={0.7}
        >
          <Text style={styles.navIcon}>
            ⌂
          </Text>

          <Text style={styles.navActive}>
            Trang chủ
          </Text>
        </TouchableOpacity>


        {/* FAVORITE */}
        <TouchableOpacity
          style={styles.navItem}
          activeOpacity={0.7}
        >
          <Text style={styles.navIcon}>
            ♡
          </Text>

          <Text style={styles.navText}>
            Yêu thích
          </Text>
        </TouchableOpacity>


        {/* CART */}
        <TouchableOpacity
          style={styles.navItem}
          activeOpacity={0.7}
        >
          <Text style={styles.navIcon}>
            🛒
          </Text>

          <Text style={styles.navText}>
            Giỏ hàng
          </Text>
        </TouchableOpacity>


        {/* PROFILE */}
        <TouchableOpacity
          style={styles.navItem}
          activeOpacity={0.7}
        >
          <Text style={styles.navIcon}>
            ♙
          </Text>

          <Text style={styles.navText}>
            Hồ sơ
          </Text>
        </TouchableOpacity>

      </View>

    </View>
  );
}


/* =====================================================
   STYLES
===================================================== */

const styles = StyleSheet.create({

  /* ================= CONTAINER ================= */

  container: {
    flex: 1,
    backgroundColor: '#F8FDFF',
  },


  /* ================= CONTENT ================= */

  content: {
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 100,
  },


  /* ================= HEADER ================= */

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  smallTitle: {
    fontSize: 13,
    color: '#7D9FA7',
    marginBottom: 3,
  },

  logoText: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 1,
    color: '#438A9C',
  },

  ownerButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E5F7FB',
    width: 70,
    height: 58,
    borderRadius: 16,
  },

  ownerIcon: {
    fontSize: 20,
  },


  /* ================= SEARCH ================= */

  searchBox: {
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#D4EDF2',
    marginBottom: 20,
  },

  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#3F6670',
  },


  /* ================= BANNER CAROUSEL ================= */

  bannerScroll: {
    marginBottom: 25,
  },

  bannerScrollContent: {
    gap: 12,
  },


  /* ================= MAIN BANNER ================= */

  banner: {
    width: 320,
    minHeight: 145,
    backgroundColor: '#CDEFF7',
    borderRadius: 22,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  bannerText: {
    flex: 1,
  },

  bannerSmall: {
    fontSize: 13,
    color: '#5C929E',
  },

  bannerTitle: {
    fontSize: 21,
    fontWeight: '800',
    color: '#438A9C',
    marginTop: 4,
  },

  bannerDescription: {
    fontSize: 11,
    lineHeight: 17,
    color: '#648F98',
    marginTop: 8,
    paddingRight: 5,
  },

  bannerCake: {
    fontSize: 65,
    marginLeft: 10,
  },


  /* ================= OFFER ================= */

  offer: {
    width: 320,
    minHeight: 145,
    backgroundColor: '#E5F7FB',
    borderRadius: 22,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  offerContent: {
    flex: 1,
  },

  offerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#438A9C',
  },

  offerText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#71969E',
    marginTop: 7,
    paddingRight: 5,
  },

  offerCode: {
    alignSelf: 'flex-start',
    marginTop: 10,
    backgroundColor: '#FFFFFF',
    color: '#438A9C',
    fontSize: 11,
    fontWeight: '800',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },

  offerEmoji: {
    fontSize: 48,
    marginLeft: 10,
  },


  /* ================= SECTION ================= */

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#438A9C',
  },

  seeAll: {
    fontSize: 12,
    color: '#75B9C8',
    fontWeight: '700',
  },


  /* ================= CATEGORY ================= */

  categoryScroll: {
    marginBottom: 25,
  },

  category: {
    width: 82,
    height: 85,
    backgroundColor: '#FFFFFF',
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#D9EEF2',
  },

  categoryIcon: {
    fontSize: 28,
    marginBottom: 5,
  },

  categoryText: {
    fontSize: 11,
    color: '#587F88',
    fontWeight: '600',
  },


  /* ================= PRODUCT ================= */

  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },

  productCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 10,
    borderWidth: 1,
    borderColor: '#DDEFF3',
  },

  productImage: {
    height: 120,
    borderRadius: 14,
    backgroundColor: '#EAF8FB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },

  productEmoji: {
    fontSize: 55,
  },

  productName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#438A9C',
  },

  productDescription: {
    fontSize: 11,
    color: '#8AA9AF',
    marginTop: 3,
  },

  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },

  price: {
    fontSize: 12,
    fontWeight: '800',
    color: '#438A9C',
    flex: 1,
  },

  addButton: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: '#75B9C8',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },

  addText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
  },


  /* ================= BOTTOM NAV ================= */

  bottomNav: {
    height: 72,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0F0F3',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  navIcon: {
    fontSize: 22,
    color: '#8AA9AF',
    marginBottom: 3,
  },

  navActive: {
    fontSize: 10,
    color: '#438A9C',
    fontWeight: '700',
  },

  navText: {
    fontSize: 10,
    color: '#8AA9AF',
  },

});