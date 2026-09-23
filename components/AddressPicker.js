import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';

import {
  getDistricts,
  getWards,
} from '../utils/vietnamAddress';

export default function AddressPicker({
  visible,
  onClose,
  onConfirm,
}) {
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);
  const [houseNumber, setHouseNumber] = useState('');

  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);

  const [step, setStep] = useState('district');

  /* Load quận khi mở modal */
  useEffect(() => {
    if (visible) {
      loadDistricts();
    }
  }, [visible]);

  const loadDistricts = async () => {
    setLoadingDistricts(true);
    const data = await getDistricts();
    setDistricts(data);
    setLoadingDistricts(false);
  };

  const handleSelectDistrict = async (district) => {
    setSelectedDistrict(district);
    setSelectedWard(null);
    setWards([]);

    setLoadingWards(true);
    const data = await getWards(district.code);
    setWards(data);
    setLoadingWards(false);
    setStep('ward');
  };

  const handleSelectWard = (ward) => {
    setSelectedWard(ward);
    setStep('house');
  };

  /* ================= VALIDATE SỐ NHÀ ================= */
  const validateHouseNumber = (value) => {
    const trimmed = (value || '').trim();

    if (!trimmed) {
      return {
        valid: false,
        error: 'Vui lòng nhập số nhà, tên đường',
      };
    }

    if (/^0+$/.test(trimmed)) {
      return {
        valid: false,
        error: 'Số nhà không thể là 0. Vui lòng nhập số nhà thực tế',
      };
    }
    const formatRegex =
    /^((số|ngõ|ngách|hẻm|kiệt|tổ|thôn|xóm|ấp|lô|căn|phòng|tầng)\s+)?\d+([\-\/\.]\d+)*[a-zA-Z]?(\s+.+)?$/i;

  if (!formatRegex.test(trimmed)) {
    return {
      valid: false,
      error:
        'Vui lòng nhập theo dạng: Số nhà + Tên đường\nVD: 74 Đại An, Ngõ 12 Đại An, Ngách 12/3 Đại An',
    };
  }
    if (trimmed.length < 2) {
      return {
        valid: false,
        error: 'Số nhà, tên đường quá ngắn (tối thiểu 2 ký tự)',
      };
    }
    if (trimmed.length > 100) {
      return {
        valid: false,
        error: 'Số nhà, tên đường quá dài (tối đa 100 ký tự)',
      };
    }

    return { valid: true };
  };

  /* ================= XÁC NHẬN ================= */
  const handleConfirm = () => {
    const validation = validateHouseNumber(houseNumber);

    if (!validation.valid) {
      Alert.alert('Số nhà không hợp lệ', validation.error);
      return;
    }

    const trimmed = houseNumber.trim();

    const fullAddress = `${trimmed}, ${selectedWard.name}, ${selectedDistrict.name}, Hà Nội`;

    onConfirm({
      houseNumber: trimmed,
      ward: selectedWard.name,
      district: selectedDistrict.name,
      province: 'Hà Nội',
      fullAddress,
    });
  };

  const resetForm = () => {
    setSelectedDistrict(null);
    setSelectedWard(null);
    setHouseNumber('');
    setWards([]);
    setStep('district');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {/* HEADER */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleClose}
            >
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Địa chỉ giao hàng</Text>

            <View style={{ width: 42 }} />
          </View>

          {/* BREADCRUMB */}
          <View style={styles.breadcrumb}>
            <View style={styles.crumb}>
              <Text style={styles.crumbText}>🏙️ Hà Nội</Text>
            </View>

            {selectedDistrict && (
              <TouchableOpacity
                style={styles.crumb}
                onPress={() => setStep('district')}
              >
                <Text style={styles.crumbText} numberOfLines={1}>
                  {selectedDistrict.name}
                </Text>
              </TouchableOpacity>
            )}

            {selectedWard && (
              <View style={styles.crumb}>
                <Text style={styles.crumbText} numberOfLines={1}>
                  {selectedWard.name}
                </Text>
              </View>
            )}
          </View>

          {/* BODY */}
          <ScrollView
            style={styles.body}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* QUẬN */}
            {step === 'district' && (
              <>
                <Text style={styles.stepTitle}>
                  Chọn Quận/Huyện
                </Text>

                {loadingDistricts ? (
                  <ActivityIndicator
                    size="large"
                    color="#75B9C8"
                    style={{ marginTop: 20 }}
                  />
                ) : (
                  districts.map((d) => (
                    <TouchableOpacity
                      key={d.code}
                      style={styles.item}
                      onPress={() => handleSelectDistrict(d)}
                    >
                      <Text style={styles.itemText}>{d.name}</Text>
                      <Text style={styles.itemArrow}>›</Text>
                    </TouchableOpacity>
                  ))
                )}
              </>
            )}

            {/* PHƯỜNG */}
            {step === 'ward' && (
              <>
                <Text style={styles.stepTitle}>
                  Chọn Phường/Xã
                </Text>

                {loadingWards ? (
                  <ActivityIndicator
                    size="large"
                    color="#75B9C8"
                    style={{ marginTop: 20 }}
                  />
                ) : (
                  wards.map((w) => (
                    <TouchableOpacity
                      key={w.code}
                      style={styles.item}
                      onPress={() => handleSelectWard(w)}
                    >
                      <Text style={styles.itemText}>{w.name}</Text>
                      <Text style={styles.itemArrow}>›</Text>
                    </TouchableOpacity>
                  ))
                )}
              </>
            )}

            {/* SỐ NHÀ */}
            {step === 'house' && (
              <>
                <Text style={styles.stepTitle}>
                  Nhập số nhà, tên đường
                </Text>

                <TextInput
                  style={[
                    styles.input,
                    houseNumber.trim() &&
                      !validateHouseNumber(houseNumber).valid &&
                      styles.inputError,
                    houseNumber.trim() &&
                      validateHouseNumber(houseNumber).valid &&
                      styles.inputSuccess,
                  ]}
                  placeholder="VD: 74 Đại An"
                  placeholderTextColor="#9BB8BE"
                  value={houseNumber}
                  onChangeText={setHouseNumber}
                  autoFocus
                  maxLength={100}
                />

                {/* CẢNH BÁO LỖI REAL-TIME */}
                {houseNumber.trim().length > 0 &&
                  !validateHouseNumber(houseNumber).valid && (
                    <Text style={styles.errorHint}>
                      ⚠️ {validateHouseNumber(houseNumber).error}
                    </Text>
                  )}

                {/* XÁC NHẬN HỢP LỆ */}
                {houseNumber.trim().length > 0 &&
                  validateHouseNumber(houseNumber).valid && (
                    <Text style={styles.successHint}>
                      ✓ Số nhà hợp lệ
                    </Text>
                  )}

                <View style={styles.fullAddressPreview}>
                  <Text style={styles.previewLabel}>
                    Địa chỉ đầy đủ:
                  </Text>
                  <Text style={styles.previewText}>
                    {houseNumber.trim() || '...'},{' '}
                    {selectedWard?.name}, {selectedDistrict?.name},
                    Hà Nội
                  </Text>
                </View>

                <TouchableOpacity
                  style={[
                    styles.confirmButton,
                    !validateHouseNumber(houseNumber).valid &&
                      styles.confirmButtonDisabled,
                  ]}
                  onPress={handleConfirm}
                  disabled={!validateHouseNumber(houseNumber).valid}
                >
                  <Text style={styles.confirmText}>
                    Xác nhận địa chỉ
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '80%',
  },
  header: {
    height: 60,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#EEF7F9',
  },
  closeButton: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D7EEF2',
  },
  closeIcon: {
    fontSize: 20,
    color: '#438A9C',
    fontWeight: '700',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#356F7C',
  },
  breadcrumb: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF7F9',
  },
  crumb: {
    backgroundColor: '#E8F7FA',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    maxWidth: 200,
  },
  crumbText: {
    fontSize: 12,
    color: '#438A9C',
    fontWeight: '600',
  },
  body: {
    flex: 1,
    paddingHorizontal: 20,
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#356F7C',
    marginTop: 16,
    marginBottom: 10,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    backgroundColor: '#F8FDFF',
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#D7EEF2',
  },
  itemText: {
    fontSize: 14,
    color: '#416F78',
    fontWeight: '600',
    flex: 1,
  },
  itemArrow: {
    fontSize: 22,
    color: '#B0CFD6',
    fontWeight: '700',
  },
  input: {
    minHeight: 52,
    backgroundColor: '#FFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#C9E8EE',
    color: '#3F6670',
    marginTop: 8,
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
  fullAddressPreview: {
    marginTop: 16,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#E3F7EA',
    borderWidth: 1,
    borderColor: '#B8E5C8',
  },
  previewLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4D9B68',
    marginBottom: 6,
  },
  previewText: {
    fontSize: 13,
    color: '#356F7C',
    fontWeight: '600',
    lineHeight: 19,
  },
  confirmButton: {
    height: 54,
    borderRadius: 15,
    backgroundColor: '#75B9C8',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  confirmButtonDisabled: {
    backgroundColor: '#B0CFD6',
  },
  confirmText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});