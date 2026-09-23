import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Home');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.logoCircle}>
        <Text style={styles.logo}>🧁</Text>
      </View>

      <Text style={styles.title}>MEE BAKERY</Text>

      <Text style={styles.subtitle}>
        Sweet moments, made with love ♡
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#CDEFF7',
    justifyContent: 'center',
    alignItems: 'center',
  },

  logoCircle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
  },

  logo: {
    fontSize: 60,
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    letterSpacing: 4,
    color: '#438A9C',
  },

  subtitle: {
    marginTop: 10,
    fontSize: 14,
    color: '#6B929A',
  },
});