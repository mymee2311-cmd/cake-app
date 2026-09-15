import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';

export default function CheckoutScreen({
  cartItems = [],
  onBack,
  onConfirm,
}) {
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [address, setAddress] = useState('');

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleConfirm = () => {
    if (cartItems.length === 0) {
      Alert.alert('Giỏ hàng trống!', 'Vui lòng chọn bánh trước khi thanh toán');
      return;
    }
    if (!address.trim()) {
      Alert.alert('Thiếu địa chỉ', 'Vui lòng nhập địa chỉ giao hàng');
      return;
    }
    onConfirm({ paymentMethod, address, total, cartItems });
  };

  const renderCartItems = () => {
    if (cartItems.length === 0) {
      return (
        <Text style={styles.emptyText}>
          Giỏ hàng đang trống
        </Text>
      );
    }

    return cartItems.map((item, i) => (
      <View key={i} style={styles.itemRow}>
        <Text style={styles.itemName}>
          {item.name} x {item.quantity}
        </Text>
        <Text style={styles.itemPrice}>
          {(item.price * item.quantity).toLocaleString('vi-VN')}đ
        </Text>
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >

        {/* ============= HEADER ============= */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
          >
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            Thanh toán
          </Text>

          <View style={{ width: 42 }} />
        </View>

        {/* ============ DANH SÁCH BÁNH ============ */}
        <Text style={styles.sectionTitle}>
          Đơn hàng của bạn
        </Text>
        <View style={styles.card}>
          {renderCartItems()}
        </View>

        {/* ============ ĐỊA CHỈ ============ */}
        <Text style={styles.sectionTitle}>
          Địa chỉ giao hàng
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập địa chỉ nhận bánh..."
          placeholderTextColor="#9BB8BE"
          value={address}
          onChangeText={setAddress}
        />

        {/* ============ PHƯƠNG THỨC THANH TOÁN ============ */}
        <Text style={styles.sectionTitle}>
          Phương thức thanh toán
        </Text>
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.methodRow}
            onPress={() => setPaymentMethod('cash')}
          >
            <Text style={styles.methodText}>
              💵  Tiền mặt
            </Text>
            <Text style={styles.radio}>
              {paymentMethod === 'cash' ? '●' : '○'}
            </Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.methodRow}
            onPress={() => setPaymentMethod('bank')}
          >
            <Text style={styles.methodText}>
              🏦  Chuyển khoản
            </Text>
            <Text style={styles.radio}>
              {paymentMethod === 'bank' ? '●' : '○'}
            </Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.methodRow}
            onPress={() => setPaymentMethod('momo')}
          >
            <Text style={styles.methodText}>
              📱  Momo
            </Text>
            <Text style={styles.radio}>
              {paymentMethod === 'momo' ? '●' : '○'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ============ TỔNG TIỀN ============ */}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>
            Tổng tiền
          </Text>
          <Text style={styles.totalValue}>
            {total.toLocaleString('vi-VN')}đ
          </Text>
        </View>

        {/* ============ NÚT XÁC NHẬN ============ */}
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleConfirm}
          activeOpacity={0.8}
        >
          <Text style={styles.confirmText}>
            Xác nhận thanh toán
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAF8FB',
  },

  content: {
    paddingHorizontal: 20,
    paddingBottom: 35,
  },

  header: {
    height: 65,
    paddingTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: '#FFF',
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

  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#356F7C',
    marginTop: 20,
    marginBottom: 10,
  },

  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#D7EEF2',
  },

  emptyText: {
    color: '#89A5AA',
    textAlign: 'center',
    paddingVertical: 20,
    fontSize: 13,
  },

  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },

  itemName: {
    fontSize: 14,
    color: '#416F78',
    flex: 1,
  },

  itemPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#438A9C',
  },

  input: {
    height: 52,
    backgroundColor: '#FFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#C9E8EE',
    color: '#3F6670',
  },

  methodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },

  methodText: {
    fontSize: 14,
    color: '#416F78',
  },

  radio: {
    fontSize: 22,
    color: '#438A9C',
  },

  divider: {
    height: 1,
    backgroundColor: '#E7F2F4',
  },

  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 18,
    paddingHorizontal: 5,
  },

  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#356F7C',
  },

  totalValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#438A9C',
  },

  confirmButton: {
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

  confirmText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});