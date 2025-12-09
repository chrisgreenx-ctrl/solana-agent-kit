import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize } from '../theme';

interface Props {
  isConfigured: boolean;
}

interface ActionCategory {
  name: string;
  description: string;
  route: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  features: string[];
}

const CATEGORIES: ActionCategory[] = [
  {
    name: 'Tokens',
    description: 'Transfer, swap & manage tokens',
    route: 'Tokens',
    icon: 'wallet',
    color: '#14F195',
    features: ['Send SOL/SPL', 'Jupiter Swap', 'Price Check', 'Deploy Token'],
  },
  {
    name: 'NFTs',
    description: 'Create & manage NFT collections',
    route: 'NFTs',
    icon: 'images',
    color: '#9945FF',
    features: ['Deploy Collection', 'Mint NFTs', 'List on Tensor', 'Manage Metadata'],
  },
  {
    name: 'DeFi',
    description: 'Staking, lending & perpetuals',
    route: 'DeFi',
    icon: 'trending-up',
    color: '#00D1FF',
    features: ['JupSOL Stake', 'Lulo Lending', 'Adrena Perps', 'Drift Protocol'],
  },
  {
    name: 'Utilities',
    description: 'Price feeds, domains & airdrops',
    route: 'Utilities',
    icon: 'construct',
    color: '#F39C12',
    features: ['Pyth Oracles', '.sol Domains', 'Compressed Airdrop', 'Network TPS'],
  },
  {
    name: 'Blinks & Games',
    description: 'On-chain games & action URLs',
    route: 'Blinks',
    icon: 'game-controller',
    color: '#E74C3C',
    features: ['Rock Paper Scissors', 'Action Blinks', 'Tip Links', 'Random Numbers'],
  },
];

export default function ActionCenterScreen({ isConfigured }: Props) {
  const navigation = useNavigation<any>();

  if (!isConfigured) {
    return (
      <View style={[styles.container, styles.center]}>
        <Ionicons name="apps-outline" size={64} color={colors.textSecondary} />
        <Text style={styles.disabledTitle}>Action Center</Text>
        <Text style={styles.disabledText}>
          Configure your API keys in Settings to unlock all Solana Agent Kit features
        </Text>
        <TouchableOpacity 
          style={styles.settingsBtn}
          onPress={() => navigation.navigate('Settings')}
        >
          <Ionicons name="settings" size={20} color={colors.textPrimary} />
          <Text style={styles.settingsBtnText}>Go to Settings</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Action Center</Text>
        <Text style={styles.subtitle}>Access all Solana Agent Kit operations</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Ionicons name="flash" size={24} color={colors.accentGreen} />
          <Text style={styles.statNumber}>50+</Text>
          <Text style={styles.statLabel}>Actions</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="layers" size={24} color={colors.accentPurple} />
          <Text style={styles.statNumber}>5</Text>
          <Text style={styles.statLabel}>Categories</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="extension-puzzle" size={24} color="#00D1FF" />
          <Text style={styles.statNumber}>10+</Text>
          <Text style={styles.statLabel}>Protocols</Text>
        </View>
      </View>

      <View style={styles.categoriesGrid}>
        {CATEGORIES.map((category, index) => (
          <TouchableOpacity
            key={index}
            style={styles.categoryCard}
            onPress={() => navigation.navigate(category.route)}
            activeOpacity={0.7}
          >
            <View style={[styles.categoryIconBg, { backgroundColor: category.color }]}>
              <Ionicons name={category.icon} size={32} color="#FFFFFF" />
            </View>
            <Text style={styles.categoryName}>{category.name}</Text>
            <Text style={styles.categoryDesc}>{category.description}</Text>
            <View style={styles.featuresList}>
              {category.features.slice(0, 3).map((feature, idx) => (
                <View key={idx} style={styles.featureTag}>
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
              {category.features.length > 3 && (
                <Text style={styles.moreText}>+{category.features.length - 3} more</Text>
              )}
            </View>
            <View style={styles.arrowContainer}>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.tipCard}>
        <Ionicons name="bulb" size={24} color={colors.warning} />
        <View style={styles.tipContent}>
          <Text style={styles.tipTitle}>Pro Tip</Text>
          <Text style={styles.tipText}>
            Use the AI Chat to execute any action using natural language. Just describe what you want to do!
          </Text>
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
    paddingBottom: spacing.xl * 2,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  disabledTitle: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  disabledText: {
    color: colors.textSecondary,
    textAlign: 'center',
    fontSize: fontSize.md,
    marginBottom: spacing.lg,
  },
  settingsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accentPurple,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    gap: spacing.sm,
  },
  settingsBtnText: {
    color: colors.textPrimary,
    fontWeight: '600',
    fontSize: fontSize.md,
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
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.bgSecondary,
    borderRadius: 16,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statNumber: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  categoriesGrid: {
    gap: spacing.md,
  },
  categoryCard: {
    backgroundColor: colors.bgSecondary,
    borderRadius: 20,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
  },
  categoryIconBg: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  categoryName: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  categoryDesc: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  featuresList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  featureTag: {
    backgroundColor: colors.bgTertiary,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  featureText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  moreText: {
    fontSize: fontSize.xs,
    color: colors.accentPurple,
    alignSelf: 'center',
    marginLeft: spacing.xs,
  },
  arrowContainer: {
    position: 'absolute',
    right: spacing.lg,
    top: '50%',
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 165, 2, 0.1)',
    borderRadius: 16,
    padding: spacing.lg,
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 165, 2, 0.3)',
    gap: spacing.md,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.warning,
    marginBottom: spacing.xs,
  },
  tipText: {
    fontSize: fontSize.sm,
    color: colors.warning,
    opacity: 0.9,
  },
});
