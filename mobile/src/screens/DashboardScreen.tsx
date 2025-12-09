import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { colors, spacing, fontSize } from '../theme';
import { api } from '../services/api';

interface Props {
  isConfigured: boolean;
}

export default function DashboardScreen({ isConfigured }: Props) {
  const [wallet, setWallet] = useState<{ address: string; balance: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isConfigured) {
      loadWallet();
    } else {
      setLoading(false);
    }
  }, [isConfigured]);

  const loadWallet = async () => {
    try {
      const data = await api.getWallet();
      setWallet(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!isConfigured) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.subtitle}>Overview of your Solana Agent Kit</Text>
        
        <View style={styles.alertCard}>
          <Text style={styles.alertTitle}>Configuration Required</Text>
          <Text style={styles.alertText}>
            Please set the following in Settings to enable the Solana Agent:
          </Text>
          <View style={styles.configItem}>
            <View style={styles.badge}><Text style={styles.badgeText}>OPENAI_API_KEY</Text></View>
            <Text style={styles.configDesc}>Your OpenAI API key</Text>
          </View>
          <View style={styles.configItem}>
            <View style={styles.badge}><Text style={styles.badgeText}>RPC_URL</Text></View>
            <Text style={styles.configDesc}>Solana RPC endpoint URL</Text>
          </View>
          <View style={styles.configItem}>
            <View style={styles.badge}><Text style={styles.badgeText}>SOLANA_PRIVATE_KEY</Text></View>
            <Text style={styles.configDesc}>Your wallet private key (base58)</Text>
          </View>
        </View>
      </ScrollView>
    );
  }

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={colors.accentPurple} />
        <Text style={styles.loadingText}>Loading wallet...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Dashboard</Text>
      <Text style={styles.subtitle}>Overview of your Solana Agent Kit</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Wallet</Text>
        <View style={styles.walletInfo}>
          <Text style={styles.label}>Address</Text>
          <Text style={styles.address} numberOfLines={1} ellipsizeMode="middle">
            {wallet?.address}
          </Text>
        </View>
        <View style={styles.balanceRow}>
          <Text style={styles.balanceLabel}>Balance</Text>
          <Text style={styles.balance}>{wallet?.balance.toFixed(4)} SOL</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Status</Text>
        <View style={styles.statusRow}>
          <View style={[styles.statusDot, { backgroundColor: colors.accentGreen }]} />
          <Text style={styles.statusText}>Connected to Solana</Text>
        </View>
      </View>
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
  loadingText: {
    marginTop: spacing.md,
    color: colors.textSecondary,
  },
  alertCard: {
    backgroundColor: 'rgba(255, 165, 2, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 165, 2, 0.3)',
    borderRadius: 16,
    padding: spacing.lg,
  },
  alertTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.warning,
    marginBottom: spacing.sm,
  },
  alertText: {
    fontSize: fontSize.sm,
    color: colors.warning,
    marginBottom: spacing.md,
  },
  configItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    flexWrap: 'wrap',
  },
  badge: {
    backgroundColor: colors.bgTertiary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 6,
    marginRight: spacing.sm,
  },
  badgeText: {
    fontSize: fontSize.xs,
    color: colors.textPrimary,
    fontFamily: 'monospace',
  },
  configDesc: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  card: {
    backgroundColor: colors.bgSecondary,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  walletInfo: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  address: {
    fontSize: fontSize.sm,
    color: colors.textPrimary,
    fontFamily: 'monospace',
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  balance: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.accentGreen,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: spacing.sm,
  },
  statusText: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
  },
});
