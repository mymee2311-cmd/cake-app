import React, { useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API_URL } from '../utils/api';
import AddressPicker from '../components/AddressPicker';
import { useApp } from '../context/AppContext';


{/* ================= THÔNG TIN NGÂN HÀNG ================= */}

const OWNER_BANK = {
  bankName: 'VietinBank',
  bankCode: 'ICB',
  accountNumber: '106881723266',
  accountName: 'NGUYEN DUONG HA MY',
};

const OWNER_MOMO = {
  phone: '0815700932',
  name: 'NGUYEN DUONG HA MY',
};


{/* ================= HELPERS ================= */}

const isValidPhone = (p) => {
  const cleaned = (p || '').replace(/[\s\-\.]/g, '');
  return /^(0|\+84)(3|5|7|8|9)\d{8}$/.test(cleaned);
};

const generateOrderCode = () => {
  return 'MB' + Math.floor(100000 + Math.random() * 900000);
};


{/* ================= API ================= */}

const createOrderApi = async (payload) => {
  const response = await fetch(`${API_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.error || 'Không thể đặt hàng');
  }

  return result.data;
};


{/* ================= SCREEN ================= */}

export default function CheckoutScreen({ navigation }) {
  const { cart, addOrder, clearCart } = useApp();
  const queryClient = useQueryClient();

  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [address, setAddress] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showAddressPicker, setShowAddressPicker] = useState(false);


  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );


 { /* ================= MUTATION ================= */}

  const createOrderMutation = useMutation({
    mutationFn: createOrderApi,

    onSuccess: (data, variables) => {
      const newOrder = {
        orderCode: variables.order_code,
        orderId: data.order_id,
        createdAt: new Date().toISOString(),
        paymentMethod: variables.payment_method,
        address: variables.address,
        name: variables.customer_name,
        phone: variables.customer_phone,
        total: variables.total,
        cartItems: cart,
        status:
          variables.payment_method === 'cash'
            ? 'pending'
            : 'pending_payment',
      };

      addOrder(newOrder);
      clearCart();
      queryClient.invalidateQueries({ queryKey: ['owner-orders'] });
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });

      navigation.navigate('OrderSuccess');
    },

    onError: (err) => {
      console.error('Lỗi đặt hàng:', err);
      Alert.alert('Lỗi', err.message || 'Không thể kết nối máy chủ');
    },
  });


  {/* ================= QR URL ================= */}

  const getBankQrUrl = () => {
    const addInfo = encodeURIComponent('Thanh toan don hang Mee Bakery');

    return `https://img.vietqr.io/image/${OWNER_BANK.bankCode}-${OWNER_BANK.accountNumber}-compact2.png?amount=${total}&addInfo=${addInfo}&accountName=${encodeURIComponent(
      OWNER_BANK.accountName
    )}`;
  };


 { /* ================= HANDLERS ================= */}

  const handleConfirm = () => {
    if (cart.length === 0) {
      Alert.alert('Giỏ hàng trống!', 'Vui lòng chọn bánh trước');
      return;
    }

    if (!name.trim()) {
      Alert.alert('Thiếu tên', 'Vui lòng nhập tên người nhận');
      return;
    }

    if (!phone.trim()) {
      Alert.alert('Thiếu SĐT', 'Vui lòng nhập số điện thoại');
      return;
    }

    if (!isValidPhone(phone)) {
      Alert.alert(
        'SĐT không hợp lệ',
        'Số điện thoại phải có 10 số và bắt đầu bằng 03/05/07/08/09\n\nVí dụ: 0901234567'
      );
      return;
    }

    if (!address.trim()) {
      Alert.alert('Thiếu địa chỉ', 'Vui lòng chọn địa chỉ giao hàng');
      return;
    }

    const orderCode = generateOrderCode();

    const items = cart.map((item) => ({
      id: item.id,
      name: item.name,
      price: Number(item.price),
      quantity: Number(item.quantity),
    }));

    createOrderMutation.mutate({
      order_code: orderCode,
      customer_name: name.trim(),
      customer_phone: phone.trim(),
      address: address.trim(),
      payment_method: paymentMethod,
      total: total,
      items: items,
    });
  };


  const submitting = createOrderMutation.isPending;


  {/* ================= RENDER CART ================= */}

  const renderCartItems = () => {
    if (cart.length === 0) {
      return <Text style={styles.emptyText}>Giỏ hàng đang trống</Text>;
    }

    return cart.map((item, i) => (
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


 {/* ================= RENDER ================= */}

  return (
    <View style={styles.container}>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >

        {/* ============ HEADER ============ */}

        <View style={styles.header}>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>


          <Text style={styles.headerTitle}>Thanh toán</Text>


          <View style={{ width: 42 }} />

        </View>


        {/* ============ ĐƠN HÀNG ============ */}

        <Text style={styles.sectionTitle}>Đơn hàng của bạn</Text>

        <View style={styles.card}>{renderCartItems()}</View>


        {/* ============ THÔNG TIN NGƯỜI NHẬN ============ */}

        <Text style={styles.sectionTitle}>Thông tin người nhận</Text>


        <TextInput
          style={styles.input}
          placeholder="Tên người nhận..."
          placeholderTextColor="#9BB8BE"
          value={name}
          onChangeText={setName}
        />


        <TextInput
          style={[
            styles.input,
            { marginTop: 10 },
            phone.trim() && !isValidPhone(phone) && styles.inputError,
            phone.trim() && isValidPhone(phone) && styles.inputSuccess,
          ]}
          placeholder="Số điện thoại (10 số)..."
          placeholderTextColor="#9BB8BE"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          maxLength={15}
        />


        {phone.trim().length > 0 && !isValidPhone(phone) && (
          <Text style={styles.errorHint}>
            ⚠️ SĐT không hợp lệ (cần 10 số, bắt đầu 03/05/07/08/09)
          </Text>
        )}


        {phone.trim().length > 0 && isValidPhone(phone) && (
          <Text style={styles.successHint}>
            ✓ Số điện thoại hợp lệ
          </Text>
        )}


        {/* ============ ĐỊA CHỈ ============ */}

        <Text style={styles.sectionTitle}>Địa chỉ giao hàng</Text>


        <TouchableOpacity
          style={[
            styles.addressButton,
            address && styles.addressButtonSuccess,
          ]}
          onPress={() => setShowAddressPicker(true)}
          activeOpacity={0.8}
        >

          <Text style={styles.addressIcon}>📍</Text>

          <Text
            style={[
              styles.addressButtonText,
              !address && styles.addressPlaceholder,
            ]}
            numberOfLines={3}
          >
            {address || 'Nhấn để chọn địa chỉ giao hàng'}
          </Text>

          <Text style={styles.addressArrow}>›</Text>

        </TouchableOpacity>


        <AddressPicker
          visible={showAddressPicker}
          onClose={() => setShowAddressPicker(false)}
          onConfirm={(data) => {
            setAddress(data.fullAddress);
            setShowAddressPicker(false);
          }}
        />


        {/* ============ PHƯƠNG THỨC THANH TOÁN ============ */}

        <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>

        <View style={styles.card}>

          <TouchableOpacity
            style={styles.methodRow}
            onPress={() => setPaymentMethod('cash')}
          >
            <Text style={styles.methodText}>💵  Tiền mặt</Text>

            <Text style={styles.radio}>
              {paymentMethod === 'cash' ? '●' : '○'}
            </Text>
          </TouchableOpacity>


          <View style={styles.divider} />


          <TouchableOpacity
            style={styles.methodRow}
            onPress={() => setPaymentMethod('bank')}
          >
            <Text style={styles.methodText}>🏦  Chuyển khoản</Text>

            <Text style={styles.radio}>
              {paymentMethod === 'bank' ? '●' : '○'}
            </Text>
          </TouchableOpacity>


          <View style={styles.divider} />


          <TouchableOpacity
            style={styles.methodRow}
            onPress={() => setPaymentMethod('momo')}
          >
            <Text style={styles.methodText}>📱  Momo</Text>

            <Text style={styles.radio}>
              {paymentMethod === 'momo' ? '●' : '○'}
            </Text>
          </TouchableOpacity>

        </View>


        {/* ============ QR CHUYỂN KHOẢN ============ */}

        {paymentMethod === 'bank' && (
          <View style={styles.qrBox}>

            <Text style={styles.qrTitle}>
              🏦 Quét mã để chuyển khoản
            </Text>


            <Image
              source={{ uri: getBankQrUrl() }}
              style={styles.qrImage}
              resizeMode="contain"
            />


            <View style={styles.bankInfo}>

              <View style={styles.bankRow}>
                <Text style={styles.bankLabel}>Ngân hàng:</Text>
                <Text style={styles.bankValue}>
                  {OWNER_BANK.bankName}
                </Text>
              </View>


              <View style={styles.bankRow}>
                <Text style={styles.bankLabel}>Số TK:</Text>
                <Text style={styles.bankValue}>
                  {OWNER_BANK.accountNumber}
                </Text>
              </View>


              <View style={styles.bankRow}>
                <Text style={styles.bankLabel}>Chủ TK:</Text>
                <Text style={styles.bankValue}>
                  {OWNER_BANK.accountName}
                </Text>
              </View>


              <View style={styles.bankRow}>
                <Text style={styles.bankLabel}>Số tiền:</Text>
                <Text style={styles.bankAmount}>
                  {total.toLocaleString('vi-VN')}đ
                </Text>
              </View>

            </View>


            <Text style={styles.qrHint}>
              💡 Mở app ngân hàng → Quét mã → Kiểm tra số tiền → Xác nhận
            </Text>

          </View>
        )}


        {/* ============ MOMO ============ */}

        {paymentMethod === 'momo' && (
          <View style={styles.qrBox}>

            <Text style={styles.qrTitle}>
              📱 Thanh toán qua Momo
            </Text>


            <View style={styles.momoInfo}>

              <Text style={styles.momoText}>Mở app Momo</Text>

              <Text style={styles.momoText}>
                → Chọn "Chuyển tiền"
              </Text>

              <Text style={styles.momoText}>
                → Nhập SĐT:{' '}
                <Text style={styles.momoPhone}>{OWNER_MOMO.phone}</Text>
              </Text>

              <Text style={styles.momoText}>
                → Số tiền:{' '}
                <Text style={styles.momoAmount}>
                  {total.toLocaleString('vi-VN')}đ
                </Text>
              </Text>

              <Text style={styles.momoText}>
                → Nội dung: Thanh toan don hang
              </Text>

            </View>


            <Text style={styles.qrHint}>
              💡 Sau khi chuyển khoản, nhấn "Xác nhận thanh toán"
            </Text>

          </View>
        )}


        {/* ============ TỔNG TIỀN ============ */}

        <View style={styles.totalRow}>

          <Text style={styles.totalLabel}>Tổng tiền</Text>

          <Text style={styles.totalValue}>
            {total.toLocaleString('vi-VN')}đ
          </Text>

        </View>


        {/* ============ CẢNH BÁO ============ */}

        {paymentMethod !== 'cash' && (
          <View style={styles.warningBox}>

            <Text style={styles.warningIcon}>⚠️</Text>

            <Text style={styles.warningText}>
              Sau khi nhấn "Tôi đã chuyển khoản", đơn sẽ ở trạng thái{' '}
              <Text style={styles.warningBold}>
                chờ shop nhận tiền
              </Text>
              .{'\n'}
              Shop sẽ kiểm tra và xác nhận trong vài phút.
            </Text>

          </View>
        )}


        {/* ============ NÚT XÁC NHẬN ============ */}

        <TouchableOpacity
          style={[
            styles.confirmButton,
            submitting && { opacity: 0.6 },
          ]}
          onPress={handleConfirm}
          disabled={submitting}
          activeOpacity={0.8}
        >
          {submitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.confirmText}>
              {paymentMethod === 'cash'
                ? 'Xác nhận đặt hàng'
                : 'Tôi đã chuyển khoản'}
            </Text>
          )}
        </TouchableOpacity>

      </ScrollView>

    </View>
  );
}


/* ================= STYLES ================= */

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#EAF8FB',
  },

  content: {
    paddingHorizontal: 20,
    paddingBottom: 35,
  },


  /* ============ HEADER ============ */

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


  /* ============ COMMON ============ */

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

  divider: {
    height: 1,
    backgroundColor: '#E7F2F4',
  },


  /* ============ CART ============ */

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


  /* ============ INPUT ============ */

  input: {
    minHeight: 52,
    backgroundColor: '#FFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#C9E8EE',
    color: '#3F6670',
  },

  inputError: {
    borderColor: '#FF5A5F',
    borderWidth: 2,
    backgroundColor: '#FFF5F5',
  },

  inputSuccess: {
    borderColor: '#4D9B68',
    borderWidth: 2,
    backgroundColor: '#F0FBF4',
  },

  errorHint: {
    fontSize: 12,
    color: '#FF5A5F',
    marginTop: 6,
    marginLeft: 4,
    fontWeight: '600',
  },

  successHint: {
    fontSize: 12,
    color: '#4D9B68',
    marginTop: 6,
    marginLeft: 4,
    fontWeight: '600',
  },


  /* ============ ADDRESS ============ */

  addressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 60,
    backgroundColor: '#FFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#C9E8EE',
    gap: 10,
  },

  addressButtonSuccess: {
    borderColor: '#4D9B68',
    borderWidth: 2,
    backgroundColor: '#F0FBF4',
  },

  addressIcon: {
    fontSize: 20,
  },

  addressButtonText: {
    flex: 1,
    fontSize: 14,
    color: '#3F6670',
    fontWeight: '600',
    lineHeight: 20,
  },

  addressPlaceholder: {
    color: '#9BB8BE',
    fontWeight: '400',
  },

  addressArrow: {
    fontSize: 22,
    color: '#B0CFD6',
    fontWeight: '700',
  },


  /* ============ PAYMENT METHOD ============ */

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


  /* ============ QR BOX ============ */

  qrBox: {
    marginTop: 14,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#75B9C8',
    alignItems: 'center',
    shadowColor: '#5A9EAD',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },

  qrTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#356F7C',
    marginBottom: 14,
    textAlign: 'center',
  },

  qrImage: {
    width: 240,
    height: 240,
    backgroundColor: '#FFF',
    borderRadius: 12,
  },

  qrHint: {
    fontSize: 11,
    color: '#7B9EA5',
    textAlign: 'center',
    marginTop: 12,
    fontStyle: 'italic',
    paddingHorizontal: 10,
  },


  /* ============ BANK INFO ============ */

  bankInfo: {
    width: '100%',
    marginTop: 14,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#E8F7FA',
    gap: 8,
  },

  bankRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  bankLabel: {
    fontSize: 13,
    color: '#7B9EA5',
    fontWeight: '600',
  },

  bankValue: {
    fontSize: 13,
    color: '#416F78',
    fontWeight: '700',
    flex: 1,
    textAlign: 'right',
    marginLeft: 10,
  },

  bankAmount: {
    fontSize: 16,
    color: '#FF5A5F',
    fontWeight: '800',
    flex: 1,
    textAlign: 'right',
  },


  /* ============ MOMO INFO ============ */

  momoInfo: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#FDE8F0',
    gap: 8,
  },

  momoText: {
    fontSize: 14,
    color: '#416F78',
    lineHeight: 22,
  },

  momoPhone: {
    fontWeight: '800',
    color: '#D6336C',
    fontSize: 16,
  },

  momoAmount: {
    fontWeight: '800',
    color: '#D6336C',
    fontSize: 16,
  },


  /* ============ WARNING ============ */

  warningBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 16,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#FFF9E6',
    borderWidth: 1,
    borderColor: '#FFE4A0',
    gap: 8,
  },

  warningIcon: {
    fontSize: 16,
  },

  warningText: {
    flex: 1,
    fontSize: 12,
    color: '#B8871F',
    lineHeight: 18,
  },

  warningBold: {
    fontWeight: '800',
  },


  /* ============ TOTAL + CONFIRM ============ */

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
    shadowOffset: { width: 0, height: 4 },
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