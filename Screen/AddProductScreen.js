import React, { useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API_URL } from '../utils/api';


{/* ==================== CATEGORIES ==================== */}

const CATEGORIES = [
  { id: 1, name: 'Bánh hạt', emoji: '🌰' },
  { id: 2, name: 'Bánh quy', emoji: '🍪' },
  { id: 3, name: 'Bánh mì', emoji: '🥐' },
  { id: 4, name: 'Bánh kem', emoji: '🍰' },
];


{/* ==================== API ==================== */}

const addProductApi = async (payload) => {
  const response = await fetch(`${API_URL}/api/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.error || 'Không thể thêm sản phẩm');
  }

  return result.data;
};


{/* ==================== SCREEN ==================== */}

export default function AddProductScreen({ navigation }) {
  const queryClient = useQueryClient();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [image, setImage] = useState('');
  const [categoryId, setCategoryId] = useState(1);


  {/* ==================== MUTATION ==================== */}

  const addProductMutation = useMutation({
    mutationFn: addProductApi,

    onSuccess: () => {
      Alert.alert('Thành công', 'Đã thêm sản phẩm vào dữ liệu', [
        {
          text: 'OK',
          onPress: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            navigation.goBack();
          },
        },
      ]);
    },

    onError: (err) => {
      console.error('Lỗi thêm sản phẩm:', err);
      Alert.alert('Lỗi', err.message || 'Không thể kết nối đến máy chủ');
    },
  });


  {/* ==================== HANDLERS ==================== */}

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập tên sản phẩm');
      return;
    }

    if (!price.trim() || isNaN(Number(price)) || Number(price) <= 0) {
      Alert.alert('Giá không hợp lệ', 'Vui lòng nhập giá sản phẩm');
      return;
    }

    if (!stock.trim() || isNaN(Number(stock)) || Number(stock) < 0) {
      Alert.alert('Số lượng không hợp lệ', 'Vui lòng nhập số lượng tồn kho');
      return;
    }

    addProductMutation.mutate({
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      stock: Number(stock),
      image: image.trim(),
      category_id: categoryId,
    });
  };


  const saving = addProductMutation.isPending;


  {/* ==================== RENDER ==================== */}

  return (
    <View style={styles.container}>

      {/* ============ HEADER ============ */}

      <View style={styles.header}>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>


        <Text style={styles.headerTitle}>Thêm sản phẩm</Text>


        <View style={styles.headerRight} />

      </View>


      {/* ============ FORM ============ */}

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >

        {/* TÊN */}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tên sản phẩm *</Text>

          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="VD: Bánh hạnh nhân"
            placeholderTextColor="#9BB8BE"
          />
        </View>


        {/* MÔ TẢ */}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Mô tả</Text>

          <TextInput
            style={[styles.input, styles.textarea]}
            value={description}
            onChangeText={setDescription}
            placeholder="VD: Bánh hạnh nhân thơm ngon"
            placeholderTextColor="#9BB8BE"
            multiline
          />
        </View>


        {/* GIÁ */}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Giá (VNĐ) *</Text>

          <TextInput
            style={styles.input}
            value={price}
            onChangeText={setPrice}
            placeholder="VD: 135000"
            placeholderTextColor="#9BB8BE"
            keyboardType="numeric"
          />
        </View>


        {/* TỒN KHO */}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Số lượng tồn kho *</Text>

          <TextInput
            style={styles.input}
            value={stock}
            onChangeText={setStock}
            placeholder="VD: 20"
            placeholderTextColor="#9BB8BE"
            keyboardType="numeric"
          />
        </View>


        {/* ẢNH */}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tên file ảnh (tùy chọn)</Text>

          <TextInput
            style={styles.input}
            value={image}
            onChangeText={setImage}
            placeholder="VD: banh_hanh_nhan.png"
            placeholderTextColor="#9BB8BE"
          />
        </View>


        {/* DANH MỤC */}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Danh mục *</Text>

          <View style={styles.categoryRow}>

            {CATEGORIES.map((cat) => {
              const isActive = categoryId === cat.id;

              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryChip,
                    isActive && styles.categoryChipActive,
                  ]}
                  onPress={() => setCategoryId(cat.id)}
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


        {/* NÚT LƯU */}

        <TouchableOpacity
          style={[
            styles.saveButton,
            saving && styles.saveButtonDisabled,
          ]}
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.7}
        >
          {saving ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.saveText}>Thêm sản phẩm</Text>
          )}
        </TouchableOpacity>

      </ScrollView>

    </View>
  );
}


/* ==================== STYLES ==================== */

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#EAF8FB',
  },


  /* ============ HEADER ============ */

  header: {
    height: 65,
    paddingTop: 44,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  },


  /* ============ FORM ============ */

  content: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },

  inputGroup: {
    marginBottom: 18,
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
    minHeight: 90,
    paddingTop: 14,
    textAlignVertical: 'top',
  },


  /* ============ CATEGORY ============ */

  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
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
    borderColor: '#75B9C8',
  },

  categoryEmoji: {
    fontSize: 16,
    marginRight: 6,
  },

  categoryText: {
    fontSize: 13,
    color: '#438A9C',
    fontWeight: '600',
  },

  categoryTextActive: {
    color: '#FFFFFF',
  },


  /* ============ SAVE BUTTON ============ */

  saveButton: {
    height: 54,
    borderRadius: 15,
    backgroundColor: '#75B9C8',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#5A9EAD',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },

  saveButtonDisabled: {
    opacity: 0.6,
  },

  saveText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

});