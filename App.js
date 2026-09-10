import React, { useState } from 'react';
import { View } from 'react-native';

import SplashScreen from './Screen/SplashScreen';
import LoginScreen from './Screen/LoginScreen';
import HomeScreen from './Screen/HomeScreen';
import ProfileScreen from './Screen/ProfileScreen';
import OwnerHomeScreen from './Screen/OwnerHomeScreen';
import EditProfileScreen from './Screen/EditProfileScreen';

export default function App() {
  const [screen, setScreen] = useState('splash');

 
  const [userInfo, setUserInfo] = useState({
    name: '',
    phone: '',
    mail: '',
    address: '',
  });

  if (screen === 'splash') {
    return (
      <SplashScreen
        onFinish={() => setScreen('home')}
      />
    );
  }

  if (screen === 'home') {
    return (
      <HomeScreen
        onOwnerLogin={() => setScreen('login')}
      />
    );
  }

 
  if (screen === 'login') {
    return (
      <LoginScreen
        onLogin={() => setScreen('ownerHome')}
        onBack={() => setScreen('home')}
      />
    );
  }
  if (screen === 'ownerHome') {
    return (
      <OwnerHomeScreen
        onProfile={() => setScreen('profile')}
        onLogout={() => setScreen('login')}
      />
    );
  }
  if (screen === 'profile') {
    return (
      <ProfileScreen
        userInfo={userInfo}
        onBack={() => setScreen('ownerHome')}
        onEdit={() => setScreen('editProfile')}
        onLogout={() => setScreen('login')}
      />
    );
  }
  if (screen === 'editProfile') {
    return (
      <EditProfileScreen
        userInfo={userInfo}
        onBack={() => setScreen('profile')}
        onSave={(newInfo) => {
          setUserInfo(newInfo);
          setScreen('profile');
        }}
      />
    );
  }

  return <View />;
}