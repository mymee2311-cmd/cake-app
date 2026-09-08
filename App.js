import React, { useState } from 'react';
import { View } from 'react-native';

import SplashScreen from './Screen/SplashScreen';
import LoginScreen from './Screen/LoginScreen';
import HomeScreen from './Screen/HomeScreen';
import ProfileScreen from './Screen/ProfileScreen';
import OwnerHomeScreen from './Screen/OwnerHomeScreen';

export default function App() {
  const [screen, setScreen] = useState('splash');

  if (screen === 'splash') {
    return (
      <SplashScreen
        onFinish={() => setScreen('home')}
      />
    );
  }

  // Home
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
        onLogout={() => setScreen('login')}
      />
    );
  }

  return <View />;
}