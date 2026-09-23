import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { API_URL } from '../utils/api';
import {
  getProductEmoji,
  formatPrice,
  UI_EMOJI,
} from '../utils/emoji';


export default function HomeScreen({
  onOwnerLogin,
  cart = [],
  onAddToCart,
  onGoToCheckout,
  onGoToOrders,
  onGoToFavorite,
  onGoToProduct,
  favorites = [],              
  onToggleFavorite,            
}) {
  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`${API_URL}/api/products`);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Không thể lấy sản phẩm');
      }

      let data = result.data;
      if (!data) data = [];
      setProducts(data);
    } catch (err) {
      console.error('Lỗi lấy sản phẩm:', err);
      setError('Không thể kết nối đến máy chủ. Hãy kiểm tra Backend.');
    } finally {
      setLoading(false);
    }
  };

  const isFavorite = (productId) => {
    if (!favorites || favorites.length === 0) return false;
    return favorites.some((fav) => fav.id === productId);
  };

  const filteredProducts = products.filter((product) => {
    const keyword = searchText.toLowerCase().trim();
    if (!keyword) return true;

    const nameMatch = product.name
      ? product.name.toLowerCase().includes(keyword)
      : false;
    const descMatch = product.description
      ? product.description.toLowerCase().includes(keyword)
      : false;
    const catMatch = product.category_name
      ? product.category_name.toLowerCase().includes(keyword)
      : false;

    return nameMatch || descMatch || catMatch;
  });

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  let cartBadgeContent = cartCount;
  if (cartCount > 99) cartBadgeContent = '99+';

  let cartLabelStyle = styles.navText;
  if (cartCount > 0) cartLabelStyle = styles.navActive;

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* ================= HEADER ================= */}
        <View style={styles.header}>
          <View>
            <Text style={styles.smallTitle}>Chào mừng đến với</Text>
            <Text style={styles.logoText}>Mee Bakery</Text>
          </View>

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
          <Text style={styles.searchIcon}>{UI_EMOJI.search}</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm bánh..."
            placeholderTextColor="#9BB8BE"
            value={searchText}
            onChangeText={setSearchText}
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
          <View style={styles.banner}>
            <View style={styles.bannerText}>
              <Text style={styles.bannerSmall}>Sweet moments</Text>
              <Text style={styles.bannerTitle}>Made with love ♡</Text>
            </View>
            <Text style={styles.bannerCake}>🧁</Text>
          </View>

          <View style={styles.offer}>
            <View style={styles.offerContent}>
              <Text style={styles.offerTitle}>Ưu đãi hôm nay ✨</Text>
              <Text style={styles.offerText}>
                Giảm 10% cho đơn hàng đầu tiên
              </Text>
              <Text style={styles.offerCode}>MEE23</Text>
            </View>
            <Text style={styles.offerEmoji}>🎁</Text>
          </View>
        </ScrollView>

        {/* ================= CATEGORY ================= */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Danh mục</Text>
          <Text style={styles.seeAll}>Xem tất cả</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
        >
          <TouchableOpacity style={styles.category}>
            <Text style={styles.categoryIcon}>🌰</Text>
            <Text style={styles.categoryText}>Bánh hạt</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.category}>
            <Text style={styles.categoryIcon}>🍪</Text>
            <Text style={styles.categoryText}>Bánh quy</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.category}>
            <Text style={styles.categoryIcon}>🥐</Text>
            <Text style={styles.categoryText}>Bánh mì</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.category}>
            <Text style={styles.categoryIcon}>🍰</Text>
            <Text style={styles.categoryText}>Bánh kem</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* ================= PRODUCTS HEADER ================= */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Bánh nổi bật</Text>
          <Text style={styles.seeAll}>Xem tất cả</Text>
        </View>

        {/* ================= LOADING ================= */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#75B9C8" />
            <Text style={styles.loadingText}>Đang tải sản phẩm...</Text>
          </View>
        )}

        {/* ================= ERROR ================= */}
        {!loading && error !== '' && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorIcon}>{UI_EMOJI.retry}</Text>
            <Text style={styles.errorText}>{error}</Text>

            <TouchableOpacity
              style={styles.retryButton}
              onPress={fetchProducts}
            >
              <Text style={styles.retryText}>Thử lại</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ================= EMPTY ================= */}
        {!loading && error === '' && filteredProducts.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🍰</Text>
            <Text style={styles.emptyText}>
              Không tìm thấy bánh phù hợp
            </Text>
          </View>
        )}

        {/* ================= DANH SÁCH SẢN PHẨM  ================= */}
        {!loading && error === '' && filteredProducts.length > 0 && (
          <View style={styles.productRow}>
            {filteredProducts.map((product) => (
              <TouchableOpacity
                key={product.id}
                style={styles.productCard}
                activeOpacity={0.8}
                onPress={() => {
                  if (onGoToProduct) onGoToProduct(product);
                }}
              >
                {/* ẢNH + NÚT TIM  */}
                <View style={styles.productImageWrapper}>
                  <View style={styles.productImage}>
                    <Text style={styles.productEmoji}>
                      {getProductEmoji(product.category_name)}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.favoriteButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      if (onToggleFavorite) {
                        onToggleFavorite({
                          id: product.id,
                          name: product.name,
                          price: Number(product.price),
                          description: product.description,
                          category_name: product.category_name,
                        });
                      }
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.favoriteIcon}>
                      {isFavorite(product.id) ? '❤️' : '🤍'}
                    </Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.productName} numberOfLines={1}>
                  {product.name}
                </Text>

                <Text style={styles.productDescription} numberOfLines={1}>
                  {product.description}
                </Text>

                <View style={styles.priceRow}>
                  <Text style={styles.price}>
                    {formatPrice(product.price)}
                  </Text>

                  <TouchableOpacity
                    style={styles.addButton}
                    activeOpacity={0.7}
                    onPress={(e) => {
                      e.stopPropagation();
                      if (onAddToCart) {
                        onAddToCart({
                          id: product.id,
                          name: product.name,
                          price: Number(product.price),
                          emoji: getProductEmoji(product.category_name),
                        });
                      }
                    }}
                  >
                    <Text style={styles.addText}>{UI_EMOJI.plus}</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* ================= BOTTOM NAVIGATION ================= */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
          <Text style={styles.navIcon}>{UI_EMOJI.home}</Text>
          <Text style={styles.navActive}>Trang chủ</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          activeOpacity={0.7}
          onPress={onGoToFavorite}
        >
          <Text style={styles.navIcon}>{UI_EMOJI.favorite}</Text>
          <Text style={styles.navText}>Yêu thích</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          activeOpacity={0.7}
          onPress={onGoToCheckout}
        >
          <View style={styles.cartIconWrapper}>
            <Text style={styles.navIcon}>{UI_EMOJI.cart}</Text>

            {cartCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>
                  {cartBadgeContent}
                </Text>
              </View>
            )}
          </View>

          <Text style={cartLabelStyle}>Giỏ hàng</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          activeOpacity={0.7}
          onPress={onGoToOrders}
        >
          <Text style={styles.navIcon}>{UI_EMOJI.order}</Text>
          <Text style={styles.navText}>Đơn hàng</Text>
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
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 100,
  },

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

  bannerScroll: {
    marginBottom: 25,
  },

  bannerScrollContent: {
    gap: 12,
  },

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

  bannerCake: {
    fontSize: 65,
    marginLeft: 10,
  },

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

  productRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
    marginBottom: 14,
  },

  /* WRAPPER CHO ẢNH + NÚT TIM */
  productImageWrapper: {
    position: 'relative',
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

  /* NÚT TIM */
  favoriteButton: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 3,
  },

  favoriteIcon: {
    fontSize: 18,
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

  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },

  loadingText: {
    marginTop: 10,
    fontSize: 13,
    color: '#7D9FA7',
  },

  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
  },

  errorIcon: {
    fontSize: 35,
  },

  errorText: {
    fontSize: 13,
    color: '#7D9FA7',
    textAlign: 'center',
    marginTop: 8,
  },

  retryButton: {
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: '#75B9C8',
  },

  retryText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  emptyContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 30,
  },

  emptyIcon: {
    fontSize: 40,
  },

  emptyText: {
    marginTop: 8,
    fontSize: 13,
    color: '#8AA9AF',
  },

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

  cartIconWrapper: {
    position: 'relative',
  },

  cartBadge: {
    position: 'absolute',
    top: -6,
    right: -10,
    backgroundColor: '#FF5A5F',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },

  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
});