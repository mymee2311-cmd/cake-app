import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

const DEFAULT_USERS = [
  {
    id: '1',
    phone: '0815700932',
    password: '231104',
    name: 'My',
    mail: 'owner@meebakery.com',
    address: 'Văn quán',
    role: 'Chủ cửa hàng',
  },
  {
    id: '2',
    phone: '0987654321',
    password: 'abcdef',
    name: 'Nhân viên 1',
    mail: 'nva@meebakery.com',
    address: 'Văn quán',
    role: 'Nhân viên',
  },
];

const USERS_KEY = '@meebakery_users';
const CURRENT_USER_KEY = '@meebakery_current_user';

export function AuthProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const savedUsers = await AsyncStorage.getItem(USERS_KEY);
        if (savedUsers) {
          setUsers(JSON.parse(savedUsers));
        } else {
          await AsyncStorage.setItem(USERS_KEY, JSON.stringify(DEFAULT_USERS));
          setUsers(DEFAULT_USERS);
        }

        const savedCurrent = await AsyncStorage.getItem(CURRENT_USER_KEY);
        if (savedCurrent) setUserInfo(JSON.parse(savedCurrent));
      } catch (e) {
        console.log('Lỗi load AuthContext:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const saveUsers = async (newUsers) => {
    setUsers(newUsers);
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(newUsers));
  };

  const login = async (phone, password) => {
    const found = users.find(
      (u) => u.phone === phone.trim() && u.password === password
    );

    if (!found) return { success: false, message: 'Sai SĐT hoặc mật khẩu!' };

    setUserInfo(found);
    await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(found));
    return { success: true };
  };

  const logout = async () => {
    setUserInfo(null);
    await AsyncStorage.removeItem(CURRENT_USER_KEY);
  };

  const changePassword = async (oldPass, newPass) => {
    if (!userInfo) return { success: false, message: 'Chưa đăng nhập!' };
    if (userInfo.password !== oldPass)
      return { success: false, message: 'Mật khẩu cũ không đúng!' };
    if (newPass.length < 6)
      return { success: false, message: 'Mật khẩu mới phải từ 6 ký tự!' };

    const updatedUsers = users.map((u) =>
      u.id === userInfo.id ? { ...u, password: newPass } : u
    );
    const updatedCurrent = { ...userInfo, password: newPass };

    await saveUsers(updatedUsers);
    setUserInfo(updatedCurrent);
    await AsyncStorage.setItem(
      CURRENT_USER_KEY,
      JSON.stringify(updatedCurrent)
    );

    return { success: true, message: 'Đổi mật khẩu thành công!' };
  };

  const updateProfile = async (newInfo) => {
    if (!userInfo) return { success: false, message: 'Chưa đăng nhập!' };

    const updatedCurrent = { ...userInfo, ...newInfo };
    const updatedUsers = users.map((u) =>
      u.id === userInfo.id ? updatedCurrent : u
    );

    await saveUsers(updatedUsers);
    setUserInfo(updatedCurrent);
    await AsyncStorage.setItem(
      CURRENT_USER_KEY,
      JSON.stringify(updatedCurrent)
    );

    return { success: true, message: 'Cập nhật thành công!' };
  };

  const register = async (newUser) => {
    if (users.some((u) => u.phone === newUser.phone)) {
      return { success: false, message: 'SĐT đã tồn tại!' };
    }
    const user = { ...newUser, id: Date.now().toString() };
    await saveUsers([...users, user]);
    return { success: true, message: 'Tạo tài khoản thành công!' };
  };

  return (
    <AuthContext.Provider
      value={{
        users,
        userInfo,
        loading,
        login,
        logout,
        changePassword,
        updateProfile,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}