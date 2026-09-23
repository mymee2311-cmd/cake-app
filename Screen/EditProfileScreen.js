import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import { useApp } from '../context/AppContext';

export default function EditProfileScreen({ navigation }) {
  const { userInfo, setUserInfo } = useApp();

  const [name, setName] = useState(userInfo?.name || '');
  const [phone, setPhone] = useState(userInfo?.phone || '');
  const [email, setEmail] = useState(userInfo?.mail || '');
  const [address, setAddress] = useState(userInfo?.address || '');

  const handleSave = () => {
    const updatedInfo = {
      name,
      phone,
      mail: email,
      address,
    };

    setUserInfo(updatedInfo);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.back}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Chỉnh sửa thông tin</Text>

        <View style={styles.headerRight} />
      </View>

      {/* FORM */}
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* HỌ VÀ TÊN */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Họ và tên</Text>

          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Nhập họ và tên"
            placeholderTextColor="#999"
          />
        </View>

        {/* SỐ ĐIỆN THOẠI */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Số điện thoại</Text>

          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="Nhập số điện thoại"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
          />
        </View>

        {/* EMAIL */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>

          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Nhập email"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* ĐỊA CHỈ */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Địa chỉ</Text>

          <TextInput
            style={[styles.input, styles.addressInput]}
            value={address}
            onChangeText={setAddress}
            placeholder="Nhập địa chỉ"
            placeholderTextColor="#999"
            multiline
          />
        </View>

        {/* NÚT LƯU */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          activeOpacity={0.8}
        >
          <Text style={styles.saveText}>Lưu thay đổi</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#CDEFF7',
  },

  header: {
    height: 100,
    paddingTop: 40,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  backButton: {
    width: 45,
    height: 42,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D7EEF2',
  },

  back: {
    fontSize: 32,
    color: '#438A9C',
    marginTop: -4,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#356F7C',
  },

  headerRight: {
    width: 45,
  },

  content: {
    paddingHorizontal: 25,
    paddingTop: 20,
    paddingBottom: 40,
  },

  inputGroup: {
    marginBottom: 20,
  },

  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#356F7C',
    marginBottom: 8,
  },

  input: {
    backgroundColor: '#FFFFFF',
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#D5E9ED',
  },

  addressInput: {
    height: 90,
    paddingTop: 15,
    textAlignVertical: 'top',
  },

  saveButton: {
    height: 52,
    backgroundColor: '#78C9D8',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },

  saveText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
});