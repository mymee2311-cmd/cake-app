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
  Modal,
} from 'react-native';
import { API_URL } from '../utils/api';

const CATEGORIES = [
  { id: 1, name: 'Bánh hạt', emoji: '🌰' },
  { id: 2, name: 'Bánh quy', emoji: '🍪' },
  { id: 3, name: 'Bánh mì', emoji: '🥐' },
  { id: 4, name: 'Bánh kem', emoji: '🍰' },
];

export default function OwnerProductManagementScreen({
  onBack,
  onAddProduct,
  onEditProduct,
}) {
  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [editingProduct, setEditingProduct] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editStock, setEditStock] = useState('');
  const [editImage, setEditImage] = useState('');
  const [editCategoryId, setEditCategoryId] = useState(1);
  const [saving, setSaving] = useState(false);

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

  // ===== FILTER =====
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

  // ===== DELETE =====
  const handleDelete = (product) => {
    Alert.alert(
      'Xóa sản phẩm',
      `Bạn có chắc muốn xóa "${product.name}"?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(
                `${API_URL}/api/products/${product.id}`,
                { method: 'DELETE' }
              );

              const result = await response.json();

              if (!response.ok || !result.success) {
                throw new Error(result.error || 'Không thể xóa');
              }

              Alert.alert('Thành công', 'Đã xóa sản phẩm');
              fetchProducts();
            } catch (err) {
              console.error('Lỗi xóa:', err);
              Alert.alert('Lỗi', err.message || 'Không thể kết nối');
            }
          },
        },
      ]
    );
  };

  // ===== EDIT  =====
  const handleEdit = (product) => {
    setEditingProduct(product);
    setEditName(product.name || '');
    setEditDescription(product.description || '');
    setEditPrice(String(product.price || ''));
    setEditStock(String(product.stock || ''));
    setEditImage(product.image || '');
    setEditCategoryId(product.category_id || 1);

    if (onEditProduct) onEditProduct(product);
  };

  const closeEditModal = () => {
    setEditingProduct(null);
  };

  // ===== SAVE EDIT =====
  const handleSaveEdit = async () => {
    if (!editName.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập tên sản phẩm');
      return;
    }
    if (!editPrice.trim() || isNaN(Number(editPrice)) || Number(editPrice) <= 0) {
      Alert.alert('Giá không hợp lệ', 'Vui lòng nhập giá sản phẩm');
      return;
    }
    if (!editStock.trim() || isNaN(Number(editStock)) || Number(editStock) < 0) {
      Alert.alert('Số lượng không hợp lệ', 'Vui lòng nhập số lượng tồn kho');
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        `${API_URL}/api/products/${editingProduct.id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: editName.trim(),
            description: editDescription.trim(),
            price: Number(editPrice),
            stock: Number(editStock),
            image: editImage.trim(),
            category_id: editCategoryId,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Không thể cập nhật');
      }

      Alert.alert('Thành công', 'Đã cập nhật sản phẩm!');
      closeEditModal();
      fetchProducts();
    } catch (err) {
      console.error('Lỗi cập nhật:', err);
      Alert.alert('Lỗi', err.message || 'Không thể kết nối máy chủ');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
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

      {/* STATS */}
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

      {/* SEARCH */}
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

      {/* LOADING */}
      {loading && (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#75B9C8" />
          <Text style={styles.loadingText}>Đang tải sản phẩm...</Text>
        </View>
      )}

      {/* ERROR */}
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

      {/* EMPTY */}
      {!loading && error === '' && filteredProducts.length === 0 && (
        <View style={styles.centerBox}>
          <Text style={styles.emptyIcon}>📦</Text>
          <Text style={styles.emptyText}>
            Không tìm thấy sản phẩm nào
          </Text>
        </View>
      )}

      {/* LIST */}
      {!loading && error === '' && filteredProducts.length > 0 && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        >
          {filteredProducts.map((product) => (
            <View key={product.id} style={styles.productCard}>
              <View style={styles.productImage}>
                <Text style={styles.productEmoji}>
                  {getProductEmoji(product.category_name)}
                </Text>
              </View>

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

      {/* ================= MODAL SỬA SẢN PHẨM ================= */}
      <Modal
        visible={editingProduct !== null}
        animationType="slide"
        transparent
        onRequestClose={closeEditModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={closeEditModal}
                activeOpacity={0.7}
              >
                <Text style={styles.modalCloseIcon}>✕</Text>
              </TouchableOpacity>

              <Text style={styles.modalTitle}>Sửa sản phẩm</Text>

              <View style={{ width: 42 }} />
            </View>

            <ScrollView
              contentContainerStyle={styles.modalBody}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Tên sản phẩm *</Text>
                <TextInput
                  style={styles.input}
                  value={editName}
                  onChangeText={setEditName}
                  placeholder="VD: Bánh hạnh nhân"
                  placeholderTextColor="#9BB8BE"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Mô tả</Text>
                <TextInput
                  style={[styles.input, styles.textarea]}
                  value={editDescription}
                  onChangeText={setEditDescription}
                  placeholder="Mô tả sản phẩm"
                  placeholderTextColor="#9BB8BE"
                  multiline
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Giá (VNĐ) *</Text>
                <TextInput
                  style={styles.input}
                  value={editPrice}
                  onChangeText={setEditPrice}
                  placeholder="VD: 135000"
                  placeholderTextColor="#9BB8BE"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Số lượng tồn kho *</Text>
                <TextInput
                  style={styles.input}
                  value={editStock}
                  onChangeText={setEditStock}
                  placeholder="VD: 20"
                  placeholderTextColor="#9BB8BE"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Tên file ảnh (tùy chọn)</Text>
                <TextInput
                  style={styles.input}
                  value={editImage}
                  onChangeText={setEditImage}
                  placeholder="VD: banh_hanh_nhan.png"
                  placeholderTextColor="#9BB8BE"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Danh mục *</Text>
                <View style={styles.categoryRow}>
                  {CATEGORIES.map((cat) => {
                    const isActive = editCategoryId === cat.id;
                    return (
                      <TouchableOpacity
                        key={cat.id}
                        style={[
                          styles.categoryChip,
                          isActive && styles.categoryChipActive,
                        ]}
                        onPress={() => setEditCategoryId(cat.id)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
                        <Text
                          style={[
                            styles.categoryText,
                            isActive && styles.categoryTextActive,
                          ]}
                        >
                          {cat.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={closeEditModal}
                  activeOpacity={0.8}
                >
                  <Text style={styles.cancelText}>Hủy</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.saveButton,
                    saving && styles.saveButtonDisabled,
                  ]}
                  onPress={handleSaveEdit}
                  disabled={saving}
                  activeOpacity={0.8}
                >
                  {saving ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.saveText}>Lưu thay đổi</Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FDFF' },

  /* HEADER */
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
     marginTop: -3 },
  headerTitle: { 
    fontSize: 18, 
    fontWeight: '800', 
    color: '#356F7C'
 },
  headerRight: {
     width: 42 
  },

  /* STATS */
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
    color: '#438A9C' 
  },
  statLabel: { 
    fontSize: 11, 
    color: '#7B9EA5', 
    marginTop: 2 
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
    fontWeight: '700'
 },

  /* SEARCH */
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
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, color: '#3F6670' },

  /* LIST */
  listContent: { paddingHorizontal: 20, paddingBottom: 30 },
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
    fontSize: 30 
  },
  productInfo: { 
    flex: 1, 
    justifyContent: 'space-between' 
  },
  productName: { 
    fontSize: 14, 
    fontWeight: '800', 
    Color: '#438A9C'
   },
  productDesc: { 
    fontSize: 11, 
    color: '#89A5AA', 
    marginTop: 2 
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
    color: '#438A9C'
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
     color: '#5C929E' 
  },
  actions: {
     justifyContent: 'space-between',
     marginLeft: 8
 },
  editButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#E8F7FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIcon: { fontSize: 14 },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#FFF0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteIcon: { fontSize: 14 },

  /* STATES */
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  loadingText: {
     marginTop: 10, 
     fontSize: 13, 
     color: '#7D9FA7'
  },
  errorIcon: { 
    fontSize: 40,
    marginBottom: 8 ,
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
     marginBottom: 12 
  },
  emptyText: {
     fontSize: 14, 
     color: '#89A5AA', 
     textAlign: 'center'
 },

  /* ================= MODAL ================= */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#F8FDFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingTop: 8,
  },
  modalHeader: {
    height: 60,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#EEF7F9',
  },
  modalCloseButton: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D7EEF2',
  },
  modalCloseIcon: {
     fontSize: 20, 
     color: '#438A9C', 
     fontWeight: '700' 
  },
  modalTitle: {
     fontSize: 18, 
     fontWeight: '800', 
     color: '#356F7C'
  },
  modalBody: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 30,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  cancelButton: {
    flex: 1,
    height: 52,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D7EEF2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelText: { 
    color: '#438A9C', 
    fontSize: 15, 
    fontWeight: '700'
  },
  saveButton: {
    flex: 1.5,
    height: 52,
    borderRadius: 15,
    backgroundColor: '#75B9C8',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#5A9EAD',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  saveButtonDisabled: { 
    opacity: 0.6 
  },
  saveText: {
     color: '#FFFFFF', 
     fontSize: 15, 
     fontWeight: '700' 
  },

  inputGroup: { 
    marginBottom: 16 
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#356F7C',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    minHeight: 50,
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 14,
    color: '#3F6670',
    borderWidth: 1,
    borderColor: '#D5E9ED',
  },
  textarea: {
    minHeight: 80, 
    paddingTop: 14,
    textAlignVertical: 'top'
  },
  categoryRow: {
    flexDirection: 'row', 
    flexWrap: 'wrap',
    gap: 8
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D7EEF2',
  },
  categoryChipActive: { 
    backgroundColor: '#75B9C8',
    borderColor: '#75B9C8' 
  },
  categoryEmoji: { 
    fontSize: 16, 
    marginRight: 6 
  },
  categoryText: { 
    fontSize: 13, 
    color: '#438A9C', 
    fontWeight: '600'
  },
  categoryTextActive: { 
    color: '#FFFFFF' 
  },
});