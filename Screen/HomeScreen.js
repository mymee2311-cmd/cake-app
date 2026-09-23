import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AppProvider } from './context/AppContext';

import SplashScreen from './Screen/SplashScreen';
import LoginScreen from './Screen/LoginScreen';
import HomeScreen from './Screen/HomeScreen';
import ProfileScreen from './Screen/ProfileScreen';
import OwnerHomeScreen from './Screen/OwnerHomeScreen';
import EditProfileScreen from './Screen/EditProfileScreen';
import CheckOutScreen from './Screen/CheckOutScreen';
import CartScreen from './Screen/CartScreen';
import OrderHistoryScreen from './Screen/OrderHistoryScreen';
import OrderSuccessScreen from './Screen/OrderSuccessScreen';
import OwnerProductManagementScreen from './Screen/OwnerProductManagementScreen';
import FavoriteScreen from './Screen/FavoriteScreen';
import AddProductScreen from './Screen/AddProductScreen';
import OwnerOrderManagementScreen from './Screen/OwnerOrderManagementScreen';
import ProductDetailScreen from './Screen/ProductDetailScreen';

const Stack = createNativeStackNavigator();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 3,        
      retry: 1,                        
      refetchOnWindowFocus: false,    
      refetchOnMount: false,          
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Splash"
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_right',
            }}
          >
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Cart" component={CartScreen} />
            <Stack.Screen name="Checkout" component={CheckOutScreen} />
            <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} />
            <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} />
            <Stack.Screen name="Favorites" component={FavoriteScreen} />
            <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="OwnerHome" component={OwnerHomeScreen} />
            <Stack.Screen
              name="OwnerProducts"
              component={OwnerProductManagementScreen}
            />
            <Stack.Screen
              name="OwnerOrders"
              component={OwnerOrderManagementScreen}
            />
            <Stack.Screen name="AddProduct" component={AddProductScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </AppProvider>
    </QueryClientProvider>
  );
}