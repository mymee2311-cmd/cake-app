import React from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TochableOpacity,
} from 'react - native';
import { ImageBackground } from "react-native-web";


export default function FavoriteScreen ({
    favorites= [],
    onBack,
    onPress,
    onAddToCart,
    onGoToProduct,
}) {
    const formatPrice = (price) => {
        return Number(price).toLocaleString('vi-VN')  + 'đ'; 
    };

    const getProductEmoji= (categoryName)=> {
        if (!categoryName) return ' ';
        if (categoryName.includes('Cookies')) return ' ';
        if (categoryName.includes('Chuối')) return ' ';
        if (categoryName.includes('Croissant')) return ' ';
        return ' ';
    };

    const handleRemove= (item) => {
        if (onRemoveFavorite) {
            onRemoveFavorite(item.id);
        }
    };

    const handleAddToCart= (item) => {
        if (onAddToCart){
            onAddToCart({
                id: item.id,
                name: item.name,
                price: Number(item.price),
            });
        }
    };

    {/*============ EMPTY =========== */}
    if (favorites.length === 0 ) {
        return (
            <View style= {StyleSheet.container}>
                {/* HEADER */ }

                <View style= {StyleSheet.header}>
                    <TochableOpacity
                         style= {StyleSheet.backButton}
                         onPress= {onBack}
                         activeOpacity= {0.7}
                    >
                        <Text style= {StyleSheet.backIcon}>
                            ‹
                        </Text>
                    </TochableOpacity>

                    <Text style= {styles.headerTitle}>
                        Yêu thích
                    </Text>

                    <View style= {styles.headerRight} />
                </View>

                {/* EMPTY STATE */}

                <View style= {styles.emptyContainer}>
                    <Text style= {styles.emptyIcon}>
                        ♡
                    </Text>
                    <Text style= {styles.emptyTitle}>
                            Chưa có sản phẩm ưu thích
                    </Text>
                    <Text style= {styles.Text}>
                        Hãy thả tim cho những loại bánh bạn thích nhé.
                    </Text>

                    <TochableOpacity
                        style= {styles.backToShopButton}
                        onPress={onBack}
                        activeOpacity= {0.8}
                    >
                        <Text style= {styles.backToShopText}>
                            Khám phá tiệm bánh
                        </Text>
                    </TochableOpacity>
                </View>
            </View>
        );

    }

    {/*============== LIST ============= */}
    return (
        <View style= {styles.container}>
            {/*HEADER*/}
            <View style= {styles.header}>
                <TochableOpacity
                    style={styles.backButton}
                    onPress={onBack}
                    activeOpacity= {0.8}
                >
                    <Text style= {styles.backIcon}>
                        ‹
                    </Text>
                </TochableOpacity>

                <Text style= {styles.headerTitle}>
                    Yêu thích
                </Text>

                <View style= {styles.headerRight}>
                    <View style= {styles.countBadge}>
                        <Text style= {styles.countText}>
                            {favorites.length}
                        </Text>
                    </View>
                </View>
            </View>

            {/* LIST */}
            <ScrollView
               showsVerticalScrollIndicator= {false}
               contentContainerStyle= {styles.listContent}
            >  
               {favorites.map((item) => (
                  <View key={item.id} style={styles.itemCard}>
                     {/* IMAGE */}
                     <TochableOpacity
                     style= {styles.itemImage}
                     onPress={() => {
                        if(onGoToProduct) onGoToProduct(item);
                     }}
                     activeOpacity= {0.8}
                     >
                        <Text style= {styles.itemEmoji}>
                            {getProductEmoji(item.category_name)}
                        </Text>
                     </TochableOpacity>

                     {/* INFO */}
                     <View style= {styles.itemInfo}>
                        <Text style= {styles.itemName} numberOfLines={1}>
                            {item.name}
                        </Text>
                        
                        <Text style= {styles.itemDesc} numberOfLines={1}>
                            {item.description}
                        </Text>

                        <Text style= {styles.itemPrice}>
                            {formatPrice(item.price)}
                        </Text>
                     </View>

                     {/* ACTIONS */}
                     <View style= {styles.itemRight}>
                        {/* NÚT XÓA  */}
                        <TochableOpacity
                           style= {styles.heartButton}
                           onPress={() => handleRemove(item)}
                           activeOpacity= {0.7}
                        >
                            <Text style= {styles.heartIcon}>
                                ❤️
                            </Text>
                        </TochableOpacity>

                        {/* NÚT THÊM */}
                        <TochableOpacity
                             style= {styles.addButton}
                             onPress={() => handleAddToCart(item)}
                             activeOpacity= {0.7}
                        >
                            <Text style= {styles.addIcon}>
                                 🛒
                            </Text>
                        </TochableOpacity>
                     </View>
                  </View>
               )

               )}
            </ScrollView>
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

  /* ================= LIST ================= */

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
    shadowOffset: { width: 0, height: 2 },
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

    /* ================= EMPTY ================= */
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

});