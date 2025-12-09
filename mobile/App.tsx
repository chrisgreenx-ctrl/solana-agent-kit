import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from './src/theme';
import { api } from './src/services/api';

import DashboardScreen from './src/screens/DashboardScreen';
import ChatScreen from './src/screens/ChatScreen';
import TokensScreen from './src/screens/TokensScreen';
import NFTsScreen from './src/screens/NFTsScreen';
import DeFiScreen from './src/screens/DeFiScreen';
import MiscScreen from './src/screens/MiscScreen';
import BlinksScreen from './src/screens/BlinksScreen';
import ActionCenterScreen from './src/screens/ActionCenterScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const DarkTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.accentPurple,
    background: colors.bgPrimary,
    card: colors.bgSecondary,
    text: colors.textPrimary,
    border: colors.border,
    notification: colors.accentGreen,
  },
};

function ActionStack({ isConfigured }: { isConfigured: boolean }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.bgSecondary },
        headerTintColor: colors.textPrimary,
        headerBackTitle: 'Back',
      }}
    >
      <Stack.Screen 
        name="ActionCenter" 
        options={{ headerShown: false }}
      >
        {() => <ActionCenterScreen isConfigured={isConfigured} />}
      </Stack.Screen>
      <Stack.Screen name="Tokens" options={{ title: 'Tokens' }}>
        {() => <TokensScreen isConfigured={isConfigured} />}
      </Stack.Screen>
      <Stack.Screen name="NFTs" options={{ title: 'NFTs' }}>
        {() => <NFTsScreen isConfigured={isConfigured} />}
      </Stack.Screen>
      <Stack.Screen name="DeFi" options={{ title: 'DeFi' }}>
        {() => <DeFiScreen isConfigured={isConfigured} />}
      </Stack.Screen>
      <Stack.Screen name="Utilities" options={{ title: 'Utilities' }}>
        {() => <MiscScreen isConfigured={isConfigured} />}
      </Stack.Screen>
      <Stack.Screen name="Blinks" options={{ title: 'Blinks & Games' }}>
        {() => <BlinksScreen isConfigured={isConfigured} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

export default function App() {
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkStatus = async () => {
    try {
      const status = await api.getStatus();
      setIsConfigured(status.configured);
    } catch (e) {
      setIsConfigured(false);
    }
  };

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={DarkTheme}>
        <StatusBar style="light" />
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName: keyof typeof Ionicons.glyphMap;
              switch (route.name) {
                case 'Home':
                  iconName = focused ? 'grid' : 'grid-outline';
                  break;
                case 'Chat':
                  iconName = focused ? 'chatbubble' : 'chatbubble-outline';
                  break;
                case 'Actions':
                  iconName = focused ? 'apps' : 'apps-outline';
                  break;
                case 'Settings':
                  iconName = focused ? 'settings' : 'settings-outline';
                  break;
                default:
                  iconName = 'help-outline';
              }
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: colors.accentPurple,
            tabBarInactiveTintColor: colors.textSecondary,
            tabBarStyle: {
              backgroundColor: colors.bgSecondary,
              borderTopColor: colors.border,
              height: 60,
              paddingBottom: 8,
              paddingTop: 8,
            },
            headerStyle: {
              backgroundColor: colors.bgSecondary,
            },
            headerTintColor: colors.textPrimary,
          })}
        >
          <Tab.Screen 
            name="Home" 
            options={{ title: 'Dashboard' }}
            children={() => <DashboardScreen isConfigured={isConfigured} />}
          />
          <Tab.Screen 
            name="Chat" 
            options={{ title: 'AI Chat' }}
            children={() => <ChatScreen isConfigured={isConfigured} />}
          />
          <Tab.Screen 
            name="Actions" 
            options={{ headerShown: false }}
            children={() => <ActionStack isConfigured={isConfigured} />}
          />
          <Tab.Screen 
            name="Settings" 
            children={() => <SettingsScreen onConfigUpdate={checkStatus} />}
            options={{
              tabBarBadge: !isConfigured ? '!' : undefined,
              tabBarBadgeStyle: { backgroundColor: colors.warning },
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
