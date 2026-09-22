import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { API_URL } from '../utils/api';  

export default function OwnerProductManagementScreen({
  onBack,
  onAddProduct,
  onEditProduct,
}) {
  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {0
      setLoading(true);
      setError('');

      const response = await fetch(`${API_URL}/api/products`);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Không thể lấy sản phẩm');
      }

      let data = result.data;
      if (!data) {
        data = [];
      }
      setProducts(data);
    } catch (err) {
      console.error('Lỗi lấy sản phẩm:', err);
      setError('Không thể kết nối máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return Number(price).toLocaleString('vi-VN') + 'đ';
  };

  const getProductEmoji = (categoryName) => {
    if (!categoryName) return '🌰';
    if (categoryName.includes('Cookies')) return '🍪';
    if (categoryName.includes('chuối')) return '🍞';
    if (categoryName.includes('Croissant')) return '🥐';
    return '🌰';
  };

  {/* ===== Lọc sản phẩm theo từ khoá ===== */}
  let filteredProducts = products;
  const keyword = searchText.toLowerCase().trim();

  if (keyword) {
    filteredProducts = products.filter((product) => {
      let nameMatch = false;
      let descMatch = false;

      if (product.name) {
        nameMatch = product.name.toLowerCase().includes(keyword);
      }
      if (product.description) {
        descMatch = product.description.toLowerCase().includes(keyword);
      }

      return nameMatch || descMatch;
    });
  }

  const handleDelete = (product) => {
    Alert.alert(
      'Xóa sản phẩm',
      `Bạn có chắc muốn xóa "${product.name}"?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () => {
            setProducts((prev) =>
              prev.filter((p) => p.id !== product.id)
            );
          },
        },
      ]
    );
  };

  const handleEdit = (product) => {
    if (onEditProduct) {
      onEditProduct(product);
    } else {
      Alert.alert(
        'Sửa sản phẩm',
        `Bạn muốn sửa "${product.name}"?\n\n` +
          `Giá: ${formatPrice(product.price)}\n` +
          `Tồn kho: ${product.stock}`
      );
    }
  };

  return (
    <View style={styles.container}>

      {/* ================= HEADER ================= */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          activeOpacity={0.7}
        >
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Quản lý sản phẩm</Text>

        <View style={styles.headerRight} />
      </View>


      {/* ================= STATS ================= */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{products.length}</Text>
          <Text style={styles.statLabel}>Sản phẩm</Text>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={onAddProduct}
          activeOpacity={0.8}
        >
          <Text style={styles.addButtonIcon}>＋</Text>
          <Text style={styles.addButtonText}>Thêm sản phẩm</Text>
        </TouchableOpacity>
      </View>


      {/* ================= SEARCH ================= */}
      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm sản phẩm..."
          placeholderTextColor="#9BB8BE"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>


      {/* ================= LOADING ================= */}
      {loading && (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#75B9C8" />
          <Text style={styles.loadingText}>Đang tải sản phẩm...</Text>
        </View>
      )}


      {/* ================= ERROR ================= */}
      {!loading && error !== '' && (
        <View style={styles.centerBox}>
          <Text style={styles.errorIcon}>⚠️</Text>
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
        <View style={styles.centerBox}>
          <Text style={styles.emptyIcon}>📦</Text>
          <Text style={styles.emptyText}>
            Không tìm thấy sản phẩm nào
          </Text>
        </View>
      )}


      {/* ================= DANH SÁCH ================= */}
      {!loading && error === '' && filteredProducts.length > 0 && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        >
          {filteredProducts.map((product) => (
            <View key={product.id} style={styles.productCard}>

              {/* ẢNH / EMOJI */}
              <View style={styles.productImage}>
                <Text style={styles.productEmoji}>
                  {getProductEmoji(product.category_name)}
                </Text>
              </View>

              {/* THÔNG TIN */}
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={1}>
                  {product.name}
                </Text>

                <Text style={styles.productDesc} numberOfLines={1}>
                  {product.description}
                </Text>

                <View style={styles.productMeta}>
                  <Text style={styles.productPrice}>
                    {formatPrice(product.price)}
                  </Text>

                  <View style={styles.stockBadge}>
                    <Text style={styles.stockText}>
                      Kho: {product.stock}
                    </Text>
                  </View>
                </View>
              </View>

              {/* NÚT SỬA / XÓA */}
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleEdit(product)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.editIcon}>✏️</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(product)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.deleteIcon}>🗑️</Text>
                </TouchableOpacity>
              </View>

            </View>
          ))}
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
    height: 60,
    paddingHorizontal: 20,
    paddingTop: 43,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FDFF',
    zIndex: 10,
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
  },

  /* ================= STATS ================= */

  statsContainer: {
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
    fontSize: 20,
    fontWeight: '800',
    color: '#438A9C',
  },

  statLabel: {
    fontSize: 11,
    color: '#7B9EA5',
    marginTop: 2,
  },

  addButton: {
    flex: 1,
    flexDirection: 'row',
    height: 54,
    backgroundColor: '#75B9C8',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    shadowColor: '#5A9EAD',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },

  addButtonIcon: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    marginTop: -2,
  },

  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  /* ================= SEARCH ================= */

  searchBox: {
    height: 46,
    marginHorizontal: 20,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#D4EDF2',
  },

  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#3F6670',
  },

  /* ================= LIST ================= */

  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },

  productCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
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

  productImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#EAF8FB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  productEmoji: {
    fontSize: 30,
  },

  productInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },

  productName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#438A9C',
  },

  productDesc: {
    fontSize: 11,
    color: '#89A5AA',
    marginTop: 2,
  },

  productMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 8,
  },

  productPrice: {
    fontSize: 13,
    fontWeight: '800',
    color: '#438A9C',
  },

  stockBadge: {
    backgroundColor: '#E8F7FA',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },

  stockText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#5C929E',
  },

  actions: {
    justifyContent: 'space-between',
    marginLeft: 8,
  },

  editButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#E8F7FA',
    justifyContent: 'center',
    alignItems: 'center',
  },

  editIcon: {
    fontSize: 14,
  },

  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#FFF0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },

  deleteIcon: {
    fontSize: 14,
  },

  /* ================= STATE ================= */

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