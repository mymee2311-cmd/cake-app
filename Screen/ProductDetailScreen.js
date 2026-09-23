import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

import {
  getProductEmoji,
  formatPrice,
  UI_EMOJI,
} from '../utils/emoji';
import { useApp } from '../context/AppContext';

export default function ProductDetailScreen({ navigation }) {
  const {
    selectedProduct: product,
    favorites,
    addToCart,
    toggleFavorite,
  } = useApp();

  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const isFavorite = product
    ? favorites.some((f) => f.id === product.id)
    : false;

  if (!product) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chi tiết sản phẩm</Text>
          <View style={styles.headerRight} />
        </View>

        <View style={styles.centerBox}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>
            Không tìm thấy sản phẩm
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.retryText}>Quay lại</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const handleIncrease = () => {
    setQuantity((q) => q + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
    }
  };

  const handleAddToCart = () => {
    setAdding(true);

    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        emoji: getProductEmoji(product.category_name),
      });
    }

    setTimeout(() => {
      setAdding(false);
      setAdded(true);

      setTimeout(() => setAdded(false), 2000);
    }, 300);
  };

  const handleToggleFav = () => {
    toggleFavorite({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      description: product.description,
      category_name: product.category_name,
    });
  };

  const stock = Number(product.stock || 0);
  const outOfStock = stock <= 0;

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Chi tiết sản phẩm</Text>

        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => navigation.navigate('Cart')}
          activeOpacity={0.7}
        >
          <Text style={styles.cartIcon}>{UI_EMOJI.cart}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* IMAGE */}
        <View style={styles.imageWrapper}>
          <View style={styles.image}>
            <Text style={styles.emoji}>
              {getProductEmoji(product.category_name)}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={handleToggleFav}
            activeOpacity={0.8}
          >
            <Text style={styles.favoriteIcon}>
              {isFavorite ? '❤️' : '🤍'}
            </Text>
          </TouchableOpacity>

          {outOfStock && (
            <View style={styles.outOfStockBadge}>
              <Text style={styles.outOfStockText}>Hết hàng</Text>
            </View>
          )}
        </View>

        {/* CATEGORY */}
        {product.category_name && (
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>
              {product.category_name}
            </Text>
          </View>
        )}

        {/* NAME */}
        <Text style={styles.name}>{product.name}</Text>

        {/* PRICE */}
        <View style={styles.priceRow}>
          <Text style={styles.price}>
            {formatPrice(product.price)}
          </Text>

          {stock > 0 && (
            <View style={styles.stockBadge}>
              <Text style={styles.stockText}>
                Kho: {stock}
              </Text>
            </View>
          )}
        </View>

        {/* MÔ TẢ */}
        {product.description ? (
          <>
            <Text style={styles.sectionTitle}>Mô tả sản phẩm</Text>
            <View style={styles.descBox}>
              <Text style={styles.desc}>
                {product.description}
              </Text>
            </View>
          </>
        ) : null}

        {/* SỐ LƯỢNG */}
        <Text style={styles.sectionTitle}>Số lượng</Text>
        <View style={styles.quantityBox}>
          <TouchableOpacity
            style={[
              styles.qtyButton,
              quantity <= 1 && styles.qtyButtonDisabled,
            ]}
            onPress={handleDecrease}
            disabled={quantity <= 1}
            activeOpacity={0.7}
          >
            <Text style={styles.qtyButtonText}>−</Text>
          </TouchableOpacity>

          <Text style={styles.qtyValue}>{quantity}</Text>

          <TouchableOpacity
            style={[
              styles.qtyButton,
              quantity >= stock && styles.qtyButtonDisabled,
            ]}
            onPress={handleIncrease}
            disabled={quantity >= stock}
            activeOpacity={0.7}
          >
            <Text style={styles.qtyButtonText}>+</Text>
          </TouchableOpacity>

          <Text style={styles.qtySubtotal}>
            = {formatPrice(Number(product.price) * quantity)}
          </Text>
        </View>

        {/* THÔNG TIN */}
        <Text style={styles.sectionTitle}>Thông tin</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>🏪 Cửa hàng</Text>
            <Text style={styles.infoValue}>Mee Bakery</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>🏷️ Danh mục</Text>
            <Text style={styles.infoValue}>
              {product.category_name || 'Khác'}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>📦 Tồn kho</Text>
            <Text
              style={[
                styles.infoValue,
                outOfStock && { color: '#FF5A5F' },
              ]}
            >
              {stock > 0 ? `${stock} sản phẩm` : 'Hết hàng'}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* BOTTOM BAR */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomPrice}>
          <Text style={styles.bottomLabel}>Tổng cộng</Text>
          <Text style={styles.bottomValue}>
            {formatPrice(Number(product.price) * quantity)}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.addButton,
            outOfStock && styles.addButtonDisabled,
            added && styles.addButtonSuccess,
          ]}
          onPress={handleAddToCart}
          disabled={adding || outOfStock}
          activeOpacity={0.8}
        >
          {adding ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : added ? (
            <Text style={styles.addButtonText}>✓ Đã thêm</Text>
          ) : (
            <Text style={styles.addButtonText}>
              {outOfStock ? 'Hết hàng' : 'Thêm vào giỏ'}
            </Text>
          )}
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
    fontSize: 18,
    fontWeight: '800',
    color: '#356F7C',
  },

  headerRight: {
    width: 42,
  },

  cartButton: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: '#E8F7FA',
    justifyContent: 'center',
    alignItems: 'center',
  },

  cartIcon: {
    fontSize: 20,
  },

  content: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },

  imageWrapper: {
    position: 'relative',
    marginTop: 16,
  },

  image: {
    height: 280,
    borderRadius: 24,
    backgroundColor: '#EAF8FB',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDEFF3',
  },

  emoji: {
    fontSize: 130,
  },

  favoriteButton: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },

  favoriteIcon: {
    fontSize: 24,
  },

  outOfStockBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FF5A5F',
    borderRadius: 10,
  },

  outOfStockText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },

  categoryBadge: {
    alignSelf: 'flex-start',
    marginTop: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#E8F7FA',
    borderRadius: 10,
  },

  categoryText: {
    fontSize: 12,
    color: '#438A9C',
    fontWeight: '700',
  },

  name: {
    fontSize: 24,
    fontWeight: '800',
    color: '#356F7C',
    marginTop: 12,
    lineHeight: 32,
  },

  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },

  price: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FF5A5F',
  },

  stockBadge: {
    backgroundColor: '#E3F7EA',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },

  stockText: {
    fontSize: 12,
    color: '#4D9B68',
    fontWeight: '700',
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#356F7C',
    marginTop: 24,
    marginBottom: 10,
  },

  descBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#D7EEF2',
  },

  desc: {
    fontSize: 14,
    color: '#416F78',
    lineHeight: 22,
  },

  quantityBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#D7EEF2',
    gap: 12,
  },

  qtyButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#E8F7FA',
    justifyContent: 'center',
    alignItems: 'center',
  },

  qtyButtonDisabled: {
    opacity: 0.4,
  },

  qtyButtonText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#438A9C',
    marginTop: -2,
  },

  qtyValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#356F7C',
    minWidth: 40,
    textAlign: 'center',
  },

  qtySubtotal: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#FF5A5F',
    textAlign: 'right',
  },

  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#D7EEF2',
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },

  infoLabel: {
    fontSize: 13,
    color: '#7B9EA5',
    fontWeight: '600',
  },

  infoValue: {
    fontSize: 13,
    color: '#416F78',
    fontWeight: '700',
  },

  divider: {
    height: 1,
    backgroundColor: '#E7F2F4',
  },

  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#E7F2F4',
    shadowColor: '#75AEB9',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },

  bottomPrice: {
    flex: 1,
  },

  bottomLabel: {
    fontSize: 11,
    color: '#7B9EA5',
    marginBottom: 4,
  },

  bottomValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FF5A5F',
  },

  addButton: {
    flex: 1.5,
    height: 54,
    borderRadius: 15,
    backgroundColor: '#75B9C8',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#5A9EAD',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },

  addButtonDisabled: {
    backgroundColor: '#B0CFD6',
  },

  addButtonSuccess: {
    backgroundColor: '#4D9B68',
  },

  addButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },

  errorIcon: {
    fontSize: 60,
    marginBottom: 12,
  },

  errorText: {
    fontSize: 15,
    color: '#89A5AA',
    marginBottom: 20,
  },

  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#75B9C8',
    borderRadius: 12,
  },

  retryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});