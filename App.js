import React, { useState } from 'react';
import { View } from 'react-native';

import SplashScreen from './Screen/SplashScreen';
import LoginScreen from './Screen/LoginScreen';
import RegisterScreen from './Screen/RegisterScreen';
import HomeScreen from './Screen/HomeScreen';
import ProfileScreen from './Screen/ProfileScreen';

export default function App() {
  const [screen, setScreen] = useState('splash');

  if (screen === 'splash') {
    return <SplashScreen onFinish={() => setScreen('login')} />;
  }

  if (screen === 'login') {
    return (
      <LoginScreen
        onLogin={() => setScreen('home')}
        onRegister={() => setScreen('register')}
      />
    );
  }

  if (screen === 'register') {
    return (
      <RegisterScreen
        onRegister={() => setScreen('login')}
        onBack={() => setScreen('login')}
      />
    );
  }

  if (screen === 'home') {
    return <HomeScreen />;
  }

  return <View />;
}


