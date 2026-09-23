import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

export default function LoginScreen({ navigation }) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* NÚT BACK */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Home')}
          activeOpacity={0.7}
        >
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>

        {/* LOGO */}
        <View style={styles.logoCircle}>
          <Text style={styles.logo}>🧁</Text>
        </View>

        {/* TIÊU ĐỀ */}
        <Text style={styles.title}>Welcome Back!</Text>

        {/* SỐ ĐIỆN THOẠI */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Số điện thoại</Text>

          <TextInput
            style={styles.input}
            placeholder="Nhập số điện thoại của bạn"
            placeholderTextColor="#9BB8BE"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* MẬT KHẨU */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Mật khẩu</Text>

          <TextInput
            style={styles.input}
            placeholder="Nhập mật khẩu"
            placeholderTextColor="#9BB8BE"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* QUÊN MẬT KHẨU */}
        <TouchableOpacity
          style={styles.forgot}
          activeOpacity={0.7}
        >
          <Text style={styles.forgotText}>Quên mật khẩu?</Text>
        </TouchableOpacity>

        {/* ĐĂNG NHẬP */}
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate('OwnerHome')}
          activeOpacity={0.7}
        >
          <Text style={styles.loginText}>Đăng nhập</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5F7FB',
  },

  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingVertical: 40,
  },

  /* ==================== BACK BUTTON ==================== */

  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D4EDF2',
    shadowColor: '#7DB6C2',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },

  backIcon: {
    fontSize: 32,
    color: '#438A9C',
    marginTop: -4,
  },

  /* ==================== LOGO ==================== */

  logoCircle: {
    width: 95,
    height: 95,
    borderRadius: 48,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 25,
    shadowColor: '#7DB6C2',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },

  logo: {
    fontSize: 48,
  },

  /* ==================== TITLE ==================== */

  title: {
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '800',
    color: '#438A9C',
    marginBottom: 35,
  },

  /* ==================== INPUT ==================== */

  inputContainer: {
    marginBottom: 18,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#438A9C',
    marginBottom: 8,
  },

  input: {
    height: 52,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#3F6670',
    borderWidth: 1,
    borderColor: '#C9E8EE',
  },

  /* ==================== FORGOT PASSWORD ==================== */

  forgot: {
    alignSelf: 'flex-end',
    marginTop: -5,
    marginBottom: 25,
  },

  forgotText: {
    fontSize: 13,
    color: '#438A9C',
    fontWeight: '600',
  },

  /* ==================== LOGIN BUTTON ==================== */

  loginButton: {
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
    elevation: 4,
  },

  loginText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});