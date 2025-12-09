import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize } from '../theme';
import { api } from '../services/api';

interface Props {
  isConfigured: boolean;
}

type TabType = 'price' | 'domains' | 'airdrop' | 'network';

interface ToolCard {
  name: string;
  description: string;
  action: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  inputs?: { key: string; label: string; placeholder: string }[];
}

const PRICE_TOOLS: ToolCard[] = [
  { 
    name: 'Pyth Price Feed', 
    description: 'Get real-time oracle prices', 
    action: 'PYTH_GET_PRICE', 
    icon: 'pulse', 
    color: '#9945FF',
    inputs: [{ key: 'priceFeedId', label: 'Price Feed ID', placeholder: 'e.g. SOL/USD feed ID' }]
  },
  { 
    name: 'Jupiter Price', 
    description: 'Get token price via Jupiter', 
    action: 'FETCH_PRICE', 
    icon: 'planet', 
    color: '#14F195',
    inputs: [{ key: 'tokenAddress', label: 'Token Address', placeholder: 'Token mint address' }]
  },
  { 
    name: 'Token Security', 
    description: 'Analyze token with Rugcheck', 
    action: 'RUGCHECK_TOKEN', 
    icon: 'shield-checkmark', 
    color: '#E74C3C',
    inputs: [{ key: 'mint', label: 'Token Mint', placeholder: 'Token address to analyze' }]
  },
];

const DOMAIN_TOOLS: ToolCard[] = [
  { 
    name: 'Register .sol Domain', 
    description: 'Register SNS domain name', 
    action: 'SNS_REGISTER', 
    icon: 'globe', 
    color: '#00D1FF',
    inputs: [{ key: 'name', label: 'Domain Name', placeholder: 'yourname (without .sol)' }]
  },
  { 
    name: 'Resolve Domain', 
    description: 'Get wallet from domain', 
    action: 'SNS_RESOLVE', 
    icon: 'search', 
    color: '#3498DB',
    inputs: [{ key: 'domain', label: 'Domain', placeholder: 'yourname.sol' }]
  },
  { 
    name: 'AllDomains Register', 
    description: 'Register on AllDomains', 
    action: 'ALLDOMAINS_REGISTER', 
    icon: 'layers', 
    color: '#9B59B6',
    inputs: [{ key: 'name', label: 'Domain Name', placeholder: 'Domain to register' }]
  },
];

const AIRDROP_TOOLS: ToolCard[] = [
  { 
    name: 'Compressed Airdrop', 
    description: 'Send tokens to many wallets', 
    action: 'COMPRESSED_AIRDROP', 
    icon: 'gift', 
    color: '#F39C12',
    inputs: [
      { key: 'mint', label: 'Token Mint', placeholder: 'Token address' },
      { key: 'amount', label: 'Amount per Wallet', placeholder: 'Amount to send' },
    ]
  },
  { 
    name: 'Request Faucet', 
    description: 'Get devnet/testnet SOL', 
    action: 'REQUEST_FAUCET', 
    icon: 'water', 
    color: '#2ECC71',
    inputs: []
  },
];

const NETWORK_TOOLS: ToolCard[] = [
  { 
    name: 'Get TPS', 
    description: 'Current network TPS', 
    action: 'GET_TPS', 
    icon: 'speedometer', 
    color: '#14F195',
    inputs: []
  },
  { 
    name: 'Get Balance', 
    description: 'Check wallet balance', 
    action: 'GET_BALANCE', 
    icon: 'wallet', 
    color: '#9945FF',
    inputs: [{ key: 'address', label: 'Wallet Address (optional)', placeholder: 'Leave empty for your wallet' }]
  },
  { 
    name: 'Get Token Data', 
    description: 'Fetch token metadata', 
    action: 'GET_TOKEN_DATA', 
    icon: 'information-circle', 
    color: '#3498DB',
    inputs: [{ key: 'mint', label: 'Token Mint', placeholder: 'Token address' }]
  },
];

export default function MiscScreen({ isConfigured }: Props) {
  const [activeTab, setActiveTab] = useState<TabType>('price');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [selectedTool, setSelectedTool] = useState<ToolCard | null>(null);
  const [inputValues, setInputValues] = useState<Record<string, string>>({});

  if (!isConfigured) {
    return (
      <View style={[styles.container, styles.center]}>
        <Ionicons name="construct-outline" size={48} color={colors.textSecondary} />
        <Text style={styles.disabledText}>
          Configure your API keys in Settings to use Utilities
        </Text>
      </View>
    );
  }

  const getToolsForTab = () => {
    switch (activeTab) {
      case 'price': return PRICE_TOOLS;
      case 'domains': return DOMAIN_TOOLS;
      case 'airdrop': return AIRDROP_TOOLS;
      case 'network': return NETWORK_TOOLS;
    }
  };

  const executeAction = async () => {
    if (!selectedTool) return;
    
    setLoading(true);
    setResult(null);
    try {
      const params: any = {};
      selectedTool.inputs?.forEach(input => {
        if (inputValues[input.key]) {
          if (input.key === 'amount') {
            params[input.key] = parseFloat(inputValues[input.key]);
          } else {
            params[input.key] = inputValues[input.key];
          }
        }
      });
      
      const res = await api.executeAction(selectedTool.action, params);
      if (res.error) {
        setResult(`Error: ${res.error}`);
      } else {
        setResult(JSON.stringify(res.result, null, 2));
      }
    } catch (e: any) {
      setResult(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const tabs: { key: TabType; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { key: 'price', label: 'Prices', icon: 'pulse' },
    { key: 'domains', label: 'Domains', icon: 'globe' },
    { key: 'airdrop', label: 'Airdrop', icon: 'gift' },
    { key: 'network', label: 'Network', icon: 'speedometer' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Utilities</Text>
        <Text style={styles.subtitle}>Price Feeds, Domains, Airdrops & Network</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabScroll}>
        <View style={styles.tabs}>
          {tabs.map(tab => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, activeTab === tab.key && styles.tabActive]}
              onPress={() => {
                setActiveTab(tab.key);
                setSelectedTool(null);
                setInputValues({});
                setResult(null);
              }}
            >
              <Ionicons 
                name={tab.icon} 
                size={18} 
                color={activeTab === tab.key ? colors.textPrimary : colors.textSecondary} 
              />
              <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.toolsGrid}>
        {getToolsForTab().map((tool, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.toolCard,
              selectedTool?.action === tool.action && styles.toolCardSelected,
              { borderLeftColor: tool.color }
            ]}
            onPress={() => {
              setSelectedTool(tool);
              setInputValues({});
            }}
          >
            <View style={[styles.toolIconBg, { backgroundColor: tool.color + '20' }]}>
              <Ionicons name={tool.icon} size={24} color={tool.color} />
            </View>
            <View style={styles.toolInfo}>
              <Text style={styles.toolName}>{tool.name}</Text>
              <Text style={styles.toolDesc}>{tool.description}</Text>
            </View>
            {selectedTool?.action === tool.action && (
              <Ionicons name="checkmark-circle" size={24} color={colors.accentGreen} />
            )}
          </TouchableOpacity>
        ))}
      </View>

      {selectedTool && (
        <View style={styles.executeCard}>
          <Text style={styles.executeTitle}>{selectedTool.name}</Text>
          
          {selectedTool.inputs?.map((input, index) => (
            <View key={index}>
              <Text style={styles.inputLabel}>{input.label}</Text>
              <TextInput
                style={styles.input}
                value={inputValues[input.key] || ''}
                onChangeText={(val) => setInputValues(prev => ({ ...prev, [input.key]: val }))}
                placeholder={input.placeholder}
                placeholderTextColor={colors.textSecondary}
                keyboardType={input.key === 'amount' ? 'decimal-pad' : 'default'}
              />
            </View>
          ))}

          <TouchableOpacity
            style={[styles.btn, loading && styles.btnDisabled]}
            onPress={executeAction}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.textPrimary} />
            ) : (
              <>
                <Ionicons name="flash" size={20} color={colors.textPrimary} style={{ marginRight: 8 }} />
                <Text style={styles.btnText}>Execute</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}

      {result && (
        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>Result</Text>
          <ScrollView horizontal>
            <Text style={styles.resultText}>{result}</Text>
          </ScrollView>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xl * 2,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledText: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.md,
    fontSize: fontSize.md,
    paddingHorizontal: spacing.xl,
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.accentPurple,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  tabScroll: {
    marginBottom: spacing.md,
  },
  tabs: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.bgSecondary,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.xs,
  },
  tabActive: {
    backgroundColor: colors.accentPurple,
    borderColor: colors.accentPurple,
  },
  tabText: {
    color: colors.textSecondary,
    fontWeight: '600',
    fontSize: fontSize.sm,
  },
  tabTextActive: {
    color: colors.textPrimary,
  },
  toolsGrid: {
    gap: spacing.md,
  },
  toolCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgSecondary,
    borderRadius: 16,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 4,
  },
  toolCardSelected: {
    borderColor: colors.accentGreen,
    backgroundColor: colors.bgTertiary,
  },
  toolIconBg: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  toolInfo: {
    flex: 1,
  },
  toolName: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  toolDesc: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  executeCard: {
    backgroundColor: colors.bgSecondary,
    borderRadius: 16,
    padding: spacing.lg,
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: colors.accentPurple,
  },
  executeTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.accentPurple,
    marginBottom: spacing.md,
  },
  inputLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    marginTop: spacing.sm,
  },
  input: {
    backgroundColor: colors.bgTertiary,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.textPrimary,
    fontSize: fontSize.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  btn: {
    flexDirection: 'row',
    backgroundColor: colors.accentPurple,
    borderRadius: 12,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  btnDisabled: {
    opacity: 0.5,
  },
  btnText: {
    color: colors.textPrimary,
    fontWeight: '600',
    fontSize: fontSize.md,
  },
  resultCard: {
    backgroundColor: colors.bgSecondary,
    borderRadius: 16,
    padding: spacing.lg,
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  resultTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  resultText: {
    fontFamily: 'monospace',
    fontSize: fontSize.sm,
    color: colors.accentGreen,
  },
});
