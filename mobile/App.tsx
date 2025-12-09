import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from './src/theme';
import { api } from './src/services/api';

import DashboardScreen from './src/screens/DashboardScreen';
import ChatScreen from './src/screens/ChatScreen';
import TokensScreen from './src/screens/TokensScreen';
import NFTsScreen from './src/screens/NFTsScreen';
import ToolsScreen from './src/screens/ToolsScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Tab = createBottomTabNavigator();

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
                case 'Dashboard':
                  iconName = focused ? 'grid' : 'grid-outline';
                  break;
                case 'Chat':
                  iconName = focused ? 'chatbubble' : 'chatbubble-outline';
                  break;
                case 'Tokens':
                  iconName = focused ? 'wallet' : 'wallet-outline';
                  break;
                case 'NFTs':
                  iconName = focused ? 'images' : 'images-outline';
                  break;
                case 'Tools':
                  iconName = focused ? 'construct' : 'construct-outline';
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
            },
            headerStyle: {
              backgroundColor: colors.bgSecondary,
            },
            headerTintColor: colors.textPrimary,
          })}
        >
          <Tab.Screen 
            name="Dashboard" 
            children={() => <DashboardScreen isConfigured={isConfigured} />}
          />
          <Tab.Screen 
            name="Chat" 
            children={() => <ChatScreen isConfigured={isConfigured} />}
          />
          <Tab.Screen 
            name="Tokens" 
            children={() => <TokensScreen isConfigured={isConfigured} />}
          />
          <Tab.Screen 
            name="NFTs" 
            children={() => <NFTsScreen isConfigured={isConfigured} />}
          />
          <Tab.Screen 
            name="Tools" 
            children={() => <ToolsScreen isConfigured={isConfigured} />}
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
