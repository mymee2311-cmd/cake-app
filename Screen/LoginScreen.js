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

export default function LoginScreen({ onLogin, onRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >

        {/* Logo */}
        <View style={styles.logoCircle}>
          <Text style={styles.logo}>🧁</Text>
        </View>

        {/* Tiêu đề */}
        <Text style={styles.title}>Welcome Back!</Text>

        {/* Số điện thoại */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>số điện thoại</Text>

          <TextInput
            style={styles.input}
            placeholder="Nhập số điện thoại của bạn"
            placeholderTextColor="#9BB8BE"
            value={email}
            onChangeText={setEmail}
            keyboardType="Số điện thoại"
            autoCapitalize="none"
          />
        </View>

        {/* Password */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Mật khẩu</Text>

          <TextInput
            style={styles.input}
            placeholder="Nhập mật khẩu"
            placeholderTextColor="#9BB8BE"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        {/* Quên mật khẩu */}
        <TouchableOpacity style={styles.forgot}>
          <Text style={styles.forgotText}>
            Quên mật khẩu?
          </Text>
        </TouchableOpacity>

        {/* Đăng nhập */}
        <TouchableOpacity
          style={styles.loginButton}
          onPress={onLogin}
          activeOpacity={0.5}
        >
          <Text style={styles.loginText}>
            Đăng nhập
          </Text>
        </TouchableOpacity>

        {/* Hoặc */}
        <View style={styles.orContainer}>
          <View style={styles.line} />
          <Text style={styles.orText}>hoặc</Text>
          <View style={styles.line} />
        </View>

        {/* Đăng ký */}
        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>
            Chưa có tài khoản?
          </Text>

          <TouchableOpacity onPress={onRegister}>
            <Text style={styles.registerButton}>
              Đăng ký ngay
            </Text>
          </TouchableOpacity>
        </View>

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

  title: {
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '800',
    color: '#438A9C',
  },

  subtitle: {
    textAlign: 'center',
    fontSize: 14,
    color: '#759AA2',
    marginTop: 8,
    marginBottom: 30,
  },

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

  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 25,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#C5E2E8',
  },

  orText: {
    marginHorizontal: 12,
    color: '#8AA9AF',
    fontSize: 13,
  },

  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  registerText: {
    color: '#759AA2',
    fontSize: 14,
  },

  registerButton: {
    color: '#438A9C',
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 5,
  },
});