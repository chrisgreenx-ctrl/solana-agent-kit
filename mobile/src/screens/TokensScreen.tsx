import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize } from '../theme';
import { api } from '../services/api';

interface Props {
  isConfigured: boolean;
}

export default function TokensScreen({ isConfigured }: Props) {
  const [activeTab, setActiveTab] = useState<'transfer' | 'swap' | 'price'>('transfer');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const [transferTo, setTransferTo] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferMint, setTransferMint] = useState('');

  const [swapFrom, setSwapFrom] = useState('');
  const [swapTo, setSwapTo] = useState('');
  const [swapAmount, setSwapAmount] = useState('');

  const [priceToken, setPriceToken] = useState('');

  if (!isConfigured) {
    return (
      <View style={[styles.container, styles.center]}>
        <Ionicons name="wallet-outline" size={48} color={colors.textSecondary} />
        <Text style={styles.disabledText}>
          Configure your API keys in Settings to use Token operations
        </Text>
      </View>
    );
  }

  const executeAction = async (actionName: string, params: any) => {
    setLoading(true);
    setResult(null);
    try {
      const res = await api.executeAction(actionName, params);
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

  const handleTransfer = () => {
    if (!transferTo || !transferAmount) {
      Alert.alert('Error', 'Please fill in recipient and amount');
      return;
    }
    executeAction('SEND_TRANSFER', {
      to: transferTo,
      amount: parseFloat(transferAmount),
      mint: transferMint || undefined,
    });
  };

  const handleSwap = () => {
    if (!swapFrom || !swapTo || !swapAmount) {
      Alert.alert('Error', 'Please fill in all swap fields');
      return;
    }
    executeAction('JUPITER_SWAP', {
      inputMint: swapFrom,
      outputMint: swapTo,
      amount: parseFloat(swapAmount),
    });
  };

  const handlePrice = () => {
    if (!priceToken) {
      Alert.alert('Error', 'Please enter a token address');
      return;
    }
    executeAction('FETCH_PRICE', { tokenAddress: priceToken });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Tokens</Text>
      <Text style={styles.subtitle}>Transfer, swap, and check token prices</Text>

      <View style={styles.tabs}>
        {(['transfer', 'swap', 'price'] as const).map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.card}>
        {activeTab === 'transfer' && (
          <>
            <Text style={styles.inputLabel}>Recipient Address</Text>
            <TextInput
              style={styles.input}
              value={transferTo}
              onChangeText={setTransferTo}
              placeholder="Enter wallet address"
              placeholderTextColor={colors.textSecondary}
            />
            <Text style={styles.inputLabel}>Amount (SOL)</Text>
            <TextInput
              style={styles.input}
              value={transferAmount}
              onChangeText={setTransferAmount}
              placeholder="0.0"
              placeholderTextColor={colors.textSecondary}
              keyboardType="decimal-pad"
            />
            <Text style={styles.inputLabel}>Token Mint (optional, for SPL tokens)</Text>
            <TextInput
              style={styles.input}
              value={transferMint}
              onChangeText={setTransferMint}
              placeholder="Leave empty for SOL"
              placeholderTextColor={colors.textSecondary}
            />
            <TouchableOpacity
              style={[styles.btn, loading && styles.btnDisabled]}
              onPress={handleTransfer}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={colors.textPrimary} />
              ) : (
                <Text style={styles.btnText}>Send Transfer</Text>
              )}
            </TouchableOpacity>
          </>
        )}

        {activeTab === 'swap' && (
          <>
            <Text style={styles.inputLabel}>From Token (Mint Address)</Text>
            <TextInput
              style={styles.input}
              value={swapFrom}
              onChangeText={setSwapFrom}
              placeholder="Input token mint"
              placeholderTextColor={colors.textSecondary}
            />
            <Text style={styles.inputLabel}>To Token (Mint Address)</Text>
            <TextInput
              style={styles.input}
              value={swapTo}
              onChangeText={setSwapTo}
              placeholder="Output token mint"
              placeholderTextColor={colors.textSecondary}
            />
            <Text style={styles.inputLabel}>Amount</Text>
            <TextInput
              style={styles.input}
              value={swapAmount}
              onChangeText={setSwapAmount}
              placeholder="0.0"
              placeholderTextColor={colors.textSecondary}
              keyboardType="decimal-pad"
            />
            <TouchableOpacity
              style={[styles.btn, loading && styles.btnDisabled]}
              onPress={handleSwap}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={colors.textPrimary} />
              ) : (
                <Text style={styles.btnText}>Swap via Jupiter</Text>
              )}
            </TouchableOpacity>
          </>
        )}

        {activeTab === 'price' && (
          <>
            <Text style={styles.inputLabel}>Token Address</Text>
            <TextInput
              style={styles.input}
              value={priceToken}
              onChangeText={setPriceToken}
              placeholder="Enter token mint address"
              placeholderTextColor={colors.textSecondary}
            />
            <TouchableOpacity
              style={[styles.btn, loading && styles.btnDisabled]}
              onPress={handlePrice}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={colors.textPrimary} />
              ) : (
                <Text style={styles.btnText}>Fetch Price</Text>
              )}
            </TouchableOpacity>
          </>
        )}
      </View>

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
  title: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.accentPurple,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    backgroundColor: colors.bgSecondary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabActive: {
    backgroundColor: colors.accentPurple,
    borderColor: colors.accentPurple,
  },
  tabText: {
    color: colors.textSecondary,
    fontWeight: '600',
  },
  tabTextActive: {
    color: colors.textPrimary,
  },
  card: {
    backgroundColor: colors.bgSecondary,
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
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
    backgroundColor: colors.accentPurple,
    borderRadius: 12,
    paddingVertical: spacing.md,
    alignItems: 'center',
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
