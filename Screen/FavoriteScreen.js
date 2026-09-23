import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import {
  getProductEmoji,
  formatPrice,
  UI_EMOJI,
} from '../utils/emoji';
import { useApp } from '../context/AppContext';

export default function FavoriteScreen({ navigation }) {
  const {
    favorites,
    removeFavorite,
    addToCart,
    openProduct,
  } = useApp();

  const handleRemove = (item) => {
    removeFavorite(item.id);
  };

  const handleAddToCart = (item) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: Number(item.price),
      emoji: getProductEmoji(item.category_name),
    });
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('Home')}
        activeOpacity={0.7}
      >
        <Text style={styles.backIcon}>{UI_EMOJI.back}</Text>
      </TouchableOpacity>

      <Text style={styles.headerTitle}>Yêu thích</Text>

      <View style={styles.headerRight}>
        {favorites.length > 0 && (
          <View style={styles.countBadge}>
            <Text style={styles.countText}>
              {favorites.length}
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  if (favorites.length === 0) {
    return (
      <View style={styles.container}>
        {renderHeader()}

        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>{UI_EMOJI.favorite}</Text>

          <Text style={styles.emptyTitle}>
            Chưa có sản phẩm yêu thích
          </Text>

          <Text style={styles.emptyText}>
            Hãy thả tim cho những loại bánh bạn thích nhé.
          </Text>

          <TouchableOpacity
            style={styles.backToShopButton}
            onPress={() => navigation.navigate('Home')}
            activeOpacity={0.8}
          >
            <Text style={styles.backToShopText}>
              Khám phá tiệm bánh
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeader()}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      >
        {favorites.map((item) => (
          <View key={item.id} style={styles.itemCard}>
            {/* IMAGE */}
            <TouchableOpacity
              style={styles.itemImage}
              onPress={() => {
                openProduct(item);
                navigation.navigate('ProductDetail');
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.itemEmoji}>
                {getProductEmoji(item.category_name)}
              </Text>
            </TouchableOpacity>

            {/* INFO */}
            <View style={styles.itemInfo}>
              <Text style={styles.itemName} numberOfLines={1}>
                {item.name}
              </Text>

              <Text style={styles.itemDesc} numberOfLines={1}>
                {item.description}
              </Text>

              <Text style={styles.itemPrice}>
                {formatPrice(item.price)}
              </Text>
            </View>

            {/* ACTIONS */}
            <View style={styles.itemRight}>
              <TouchableOpacity
                style={styles.heartButton}
                onPress={() => handleRemove(item)}
                activeOpacity={0.7}
              >
                <Text style={styles.heartIcon}>
                  {UI_EMOJI.favoriteFull}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.addButton}
                onPress={() => handleAddToCart(item)}
                activeOpacity={0.7}
              >
                <Text style={styles.addIcon}>
                  {UI_EMOJI.cart}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
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
    backgroundColor: '#FF5A5F',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 7,
  },

  countText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },

  listContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 30,
  },

  itemCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#DDEFF3',
    shadowColor: '#75AEB9',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 2,
  },

  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 14,
    backgroundColor: '#EAF8FB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  itemEmoji: {
    fontSize: 36,
  },

  itemInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },

  itemName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#438A9C',
  },

  itemDesc: {
    fontSize: 11,
    color: '#89A5AA',
    marginTop: 2,
  },

  itemPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: '#438A9C',
    marginTop: 4,
  },

  itemRight: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 8,
  },

  heartButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#FFF0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },

  heartIcon: {
    fontSize: 15,
  },

  addButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#75B9C8',
    justifyContent: 'center',
    alignItems: 'center',
  },

  addIcon: {
    fontSize: 14,
  },

  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },

  emptyIcon: {
    fontSize: 90,
    color: '#FF5A5F',
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
    marginBottom: 24,
    lineHeight: 20,
  },

  backToShopButton: {
    paddingHorizontal: 28,
    paddingVertical: 12,
    backgroundColor: '#75B9C8',
    borderRadius: 14,
    shadowColor: '#5A9EAD',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },

  backToShopText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});