import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize } from '../theme';
import { api } from '../services/api';

interface Props {
  isConfigured: boolean;
}

interface GameCard {
  name: string;
  description: string;
  action: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  inputs?: { key: string; label: string; placeholder: string; type?: 'select'; options?: string[] }[];
}

const GAMES: GameCard[] = [
  { 
    name: 'Rock Paper Scissors', 
    description: 'Play RPS on-chain with SOL bets', 
    action: 'RPS_PLAY', 
    icon: 'hand-left', 
    color: '#E74C3C',
    inputs: [
      { key: 'choice', label: 'Your Choice', placeholder: 'rock, paper, or scissors', type: 'select', options: ['rock', 'paper', 'scissors'] },
      { key: 'amount', label: 'Bet Amount (SOL)', placeholder: '0.1' },
    ]
  },
];

const BLINKS: GameCard[] = [
  { 
    name: 'JupSOL Stake Blink', 
    description: 'Generate staking blink for JupSOL', 
    action: 'JUPSOL_STAKE_BLINK', 
    icon: 'link', 
    color: '#14F195',
    inputs: []
  },
  { 
    name: 'Create Action Blink', 
    description: 'Generate shareable action URL', 
    action: 'CREATE_BLINK', 
    icon: 'flash', 
    color: '#9945FF',
    inputs: [
      { key: 'actionType', label: 'Action Type', placeholder: 'e.g. transfer, swap' },
    ]
  },
];

const QUICK_ACTIONS: GameCard[] = [
  { 
    name: 'Get Random Number', 
    description: 'Generate verifiable random number', 
    action: 'GET_RANDOM', 
    icon: 'shuffle', 
    color: '#F39C12',
    inputs: []
  },
  { 
    name: 'Create Tip Link', 
    description: 'Generate a SOL tip link', 
    action: 'CREATE_TIP_LINK', 
    icon: 'gift', 
    color: '#2ECC71',
    inputs: [
      { key: 'amount', label: 'Amount (SOL)', placeholder: '0.1' },
    ]
  },
];

export default function BlinksScreen({ isConfigured }: Props) {
  const [activeSection, setActiveSection] = useState<'games' | 'blinks' | 'quick'>('games');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState<GameCard | null>(null);
  const [inputValues, setInputValues] = useState<Record<string, string>>({});

  if (!isConfigured) {
    return (
      <View style={[styles.container, styles.center]}>
        <Ionicons name="game-controller-outline" size={48} color={colors.textSecondary} />
        <Text style={styles.disabledText}>
          Configure your API keys in Settings to use Blinks & Games
        </Text>
      </View>
    );
  }

  const getCardsForSection = () => {
    switch (activeSection) {
      case 'games': return GAMES;
      case 'blinks': return BLINKS;
      case 'quick': return QUICK_ACTIONS;
    }
  };

  const executeAction = async () => {
    if (!selectedAction) return;
    
    setLoading(true);
    setResult(null);
    try {
      const params: any = {};
      selectedAction.inputs?.forEach(input => {
        if (inputValues[input.key]) {
          if (input.key === 'amount') {
            params[input.key] = parseFloat(inputValues[input.key]);
          } else {
            params[input.key] = inputValues[input.key];
          }
        }
      });
      
      const res = await api.executeAction(selectedAction.action, params);
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

  const sections: { key: 'games' | 'blinks' | 'quick'; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { key: 'games', label: 'Games', icon: 'game-controller' },
    { key: 'blinks', label: 'Blinks', icon: 'link' },
    { key: 'quick', label: 'Quick', icon: 'flash' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons name="game-controller" size={32} color={colors.accentPurple} />
          <Text style={styles.title}>Blinks & Games</Text>
        </View>
        <Text style={styles.subtitle}>On-chain games, action URLs & quick tools</Text>
      </View>

      <View style={styles.sectionTabs}>
        {sections.map(section => (
          <TouchableOpacity
            key={section.key}
            style={[styles.sectionTab, activeSection === section.key && styles.sectionTabActive]}
            onPress={() => {
              setActiveSection(section.key);
              setSelectedAction(null);
              setInputValues({});
              setResult(null);
            }}
          >
            <Ionicons 
              name={section.icon} 
              size={20} 
              color={activeSection === section.key ? colors.textPrimary : colors.textSecondary} 
            />
            <Text style={[styles.sectionTabText, activeSection === section.key && styles.sectionTabTextActive]}>
              {section.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.cardsContainer}>
        {getCardsForSection().map((card, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.gameCard,
              selectedAction?.action === card.action && styles.gameCardSelected,
            ]}
            onPress={() => {
              setSelectedAction(card);
              setInputValues({});
            }}
          >
            <View style={[styles.gameIconBg, { backgroundColor: card.color }]}>
              <Ionicons name={card.icon} size={28} color="#FFFFFF" />
            </View>
            <Text style={styles.gameName}>{card.name}</Text>
            <Text style={styles.gameDesc}>{card.description}</Text>
            {selectedAction?.action === card.action && (
              <View style={styles.selectedBadge}>
                <Ionicons name="checkmark" size={16} color={colors.textPrimary} />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {selectedAction && (
        <View style={styles.executeCard}>
          <View style={styles.executeHeader}>
            <View style={[styles.executeIconBg, { backgroundColor: selectedAction.color }]}>
              <Ionicons name={selectedAction.icon} size={24} color="#FFFFFF" />
            </View>
            <View>
              <Text style={styles.executeTitle}>{selectedAction.name}</Text>
              <Text style={styles.executeDesc}>{selectedAction.description}</Text>
            </View>
          </View>
          
          {selectedAction.inputs?.map((input, index) => (
            <View key={index} style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{input.label}</Text>
              {input.type === 'select' && input.options ? (
                <View style={styles.selectRow}>
                  {input.options.map(option => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.selectOption,
                        inputValues[input.key] === option && styles.selectOptionActive
                      ]}
                      onPress={() => setInputValues(prev => ({ ...prev, [input.key]: option }))}
                    >
                      <Text style={[
                        styles.selectOptionText,
                        inputValues[input.key] === option && styles.selectOptionTextActive
                      ]}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <TextInput
                  style={styles.input}
                  value={inputValues[input.key] || ''}
                  onChangeText={(val) => setInputValues(prev => ({ ...prev, [input.key]: val }))}
                  placeholder={input.placeholder}
                  placeholderTextColor={colors.textSecondary}
                  keyboardType={input.key === 'amount' ? 'decimal-pad' : 'default'}
                />
              )}
            </View>
          ))}

          <TouchableOpacity
            style={[styles.btn, loading && styles.btnDisabled, { backgroundColor: selectedAction.color }]}
            onPress={executeAction}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="play" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.btnText}>
                  {activeSection === 'games' ? 'Play Now' : 'Execute'}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}

      {result && (
        <View style={styles.resultCard}>
          <View style={styles.resultHeader}>
            <Ionicons name="checkmark-circle" size={20} color={colors.accentGreen} />
            <Text style={styles.resultTitle}>Result</Text>
          </View>
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
    marginLeft: 40,
  },
  sectionTabs: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
    backgroundColor: colors.bgSecondary,
    borderRadius: 16,
    padding: spacing.xs,
  },
  sectionTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    borderRadius: 12,
    gap: spacing.xs,
  },
  sectionTabActive: {
    backgroundColor: colors.accentPurple,
  },
  sectionTabText: {
    color: colors.textSecondary,
    fontWeight: '600',
    fontSize: fontSize.sm,
  },
  sectionTabTextActive: {
    color: colors.textPrimary,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  gameCard: {
    width: '47%',
    backgroundColor: colors.bgSecondary,
    borderRadius: 20,
    padding: spacing.lg,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
  },
  gameCardSelected: {
    borderColor: colors.accentGreen,
    backgroundColor: colors.bgTertiary,
  },
  gameIconBg: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  gameName: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  gameDesc: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  selectedBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.accentGreen,
    borderRadius: 12,
    padding: 4,
  },
  executeCard: {
    backgroundColor: colors.bgSecondary,
    borderRadius: 20,
    padding: spacing.lg,
    marginTop: spacing.lg,
    borderWidth: 2,
    borderColor: colors.border,
  },
  executeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  executeIconBg: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  executeTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  executeDesc: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  inputLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
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
  selectRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  selectOption: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.bgTertiary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  selectOptionActive: {
    backgroundColor: colors.accentPurple,
    borderColor: colors.accentPurple,
  },
  selectOptionText: {
    color: colors.textSecondary,
    fontWeight: '600',
    fontSize: fontSize.sm,
  },
  selectOptionTextActive: {
    color: colors.textPrimary,
  },
  btn: {
    flexDirection: 'row',
    borderRadius: 14,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  btnDisabled: {
    opacity: 0.5,
  },
  btnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: fontSize.md,
  },
  resultCard: {
    backgroundColor: colors.bgSecondary,
    borderRadius: 16,
    padding: spacing.lg,
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: colors.accentGreen,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  resultTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  resultText: {
    fontFamily: 'monospace',
    fontSize: fontSize.sm,
    color: colors.accentGreen,
  },
});
