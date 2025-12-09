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

interface FeatureCard {
  name: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  examples: string[];
}

const DEFI_FEATURES: FeatureCard[] = [
  {
    name: 'Staking',
    description: 'Stake SOL for liquid staking tokens',
    icon: 'trending-up',
    color: '#14F195',
    examples: ['Stake SOL with Jupiter', 'Stake via Solayer', 'Sanctum staking'],
  },
  {
    name: 'Lending',
    description: 'Lend and borrow assets',
    icon: 'cash',
    color: '#F7931A',
    examples: ['Lend via Lulo', 'Drift deposits', 'Earn yield'],
  },
  {
    name: 'Perpetuals',
    description: 'Leveraged trading positions',
    icon: 'swap-vertical',
    color: '#E74C3C',
    examples: ['Adrena long/short', 'Drift perps', 'Flash trades'],
  },
  {
    name: 'Liquidity Pools',
    description: 'Provide liquidity and earn fees',
    icon: 'water',
    color: '#00D1FF',
    examples: ['Raydium AMM', 'Orca Whirlpool', 'Meteora DLMM'],
  },
];

export default function DeFiScreen({ isConfigured }: Props) {
  const navigation = useNavigation<any>();

  if (!isConfigured) {
    return (
      <View style={[styles.container, styles.center]}>
        <Ionicons name="trending-up-outline" size={48} color={colors.textSecondary} />
        <Text style={styles.disabledText}>
          Configure your API keys in Settings to use DeFi operations
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons name="trending-up" size={28} color={colors.accentPurple} />
          <Text style={styles.title}>DeFi Operations</Text>
        </View>
        <Text style={styles.subtitle}>Staking, Lending, Perpetuals & Liquidity</Text>
      </View>

      <View style={styles.infoCard}>
        <Ionicons name="chatbubble-ellipses" size={24} color={colors.accentPurple} />
        <View style={styles.infoContent}>
          <Text style={styles.infoTitle}>Use AI Chat for DeFi</Text>
          <Text style={styles.infoText}>
            DeFi operations are best executed through natural language in the AI Chat. 
            Just describe what you want to do!
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Available DeFi Features</Text>

      <View style={styles.featuresGrid}>
        {DEFI_FEATURES.map((feature, index) => (
          <View key={index} style={styles.featureCard}>
            <View style={[styles.featureIconBg, { backgroundColor: feature.color }]}>
              <Ionicons name={feature.icon} size={28} color="#FFFFFF" />
            </View>
            <Text style={styles.featureName}>{feature.name}</Text>
            <Text style={styles.featureDesc}>{feature.description}</Text>
            <View style={styles.examplesList}>
              {feature.examples.map((example, idx) => (
                <View key={idx} style={styles.exampleTag}>
                  <Text style={styles.exampleText}>{example}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={styles.chatBtn}
        onPress={() => navigation.navigate('Chat')}
      >
        <Ionicons name="chatbubble" size={20} color="#FFFFFF" />
        <Text style={styles.chatBtnText}>Open AI Chat</Text>
        <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
      </TouchableOpacity>

      <View style={styles.examplesCard}>
        <Text style={styles.examplesTitle}>Example Commands</Text>
        <View style={styles.exampleCommand}>
          <Text style={styles.commandText}>"Stake 1 SOL with Jupiter"</Text>
        </View>
        <View style={styles.exampleCommand}>
          <Text style={styles.commandText}>"Lend 10 USDC on Lulo"</Text>
        </View>
        <View style={styles.exampleCommand}>
          <Text style={styles.commandText}>"Open a long position on SOL"</Text>
        </View>
        <View style={styles.exampleCommand}>
          <Text style={styles.commandText}>"Create a liquidity pool on Orca"</Text>
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.accentPurple,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginLeft: 36,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(153, 69, 255, 0.1)',
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(153, 69, 255, 0.3)',
    gap: spacing.md,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.accentPurple,
    marginBottom: spacing.xs,
  },
  infoText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  featureCard: {
    width: '47%',
    backgroundColor: colors.bgSecondary,
    borderRadius: 16,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  featureIconBg: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  featureName: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  examplesList: {
    gap: 4,
  },
  exampleTag: {
    backgroundColor: colors.bgTertiary,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  exampleText: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  chatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accentPurple,
    borderRadius: 14,
    paddingVertical: spacing.md,
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  chatBtnText: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  examplesCard: {
    backgroundColor: colors.bgSecondary,
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  examplesTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  exampleCommand: {
    backgroundColor: colors.bgTertiary,
    borderRadius: 10,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  commandText: {
    fontSize: fontSize.sm,
    color: colors.accentGreen,
    fontStyle: 'italic',
  },
});
