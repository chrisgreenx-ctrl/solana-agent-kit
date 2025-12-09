import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize } from '../theme';
import { api } from '../services/api';

interface Props {
  isConfigured: boolean;
}

interface Action {
  name: string;
  description: string;
}

export default function ToolsScreen({ isConfigured }: Props) {
  const [actions, setActions] = useState<Action[]>([]);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<string | null>(null);
  const [executing, setExecuting] = useState<string | null>(null);

  useEffect(() => {
    if (isConfigured) {
      loadActions();
    } else {
      setLoading(false);
    }
  }, [isConfigured]);

  const loadActions = async () => {
    try {
      const data = await api.getActions();
      setActions(data.actions || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const executeAction = async (actionName: string) => {
    setExecuting(actionName);
    setResult(null);
    try {
      const res = await api.executeAction(actionName, {});
      if (res.error) {
        setResult(`Error: ${res.error}`);
      } else {
        setResult(JSON.stringify(res.result, null, 2));
      }
    } catch (e: any) {
      setResult(`Error: ${e.message}`);
    } finally {
      setExecuting(null);
    }
  };

  if (!isConfigured) {
    return (
      <View style={[styles.container, styles.center]}>
        <Ionicons name="construct-outline" size={48} color={colors.textSecondary} />
        <Text style={styles.disabledText}>
          Configure your API keys in Settings to view available tools
        </Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={colors.accentPurple} />
        <Text style={styles.loadingText}>Loading tools...</Text>
      </View>
    );
  }

  const quickActions = [
    { name: 'GET_TPS', label: 'Network TPS', icon: 'speedometer' },
    { name: 'REQUEST_FAUCET_FUNDS', label: 'Request Faucet', icon: 'water' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Tools</Text>
      <Text style={styles.subtitle}>Quick actions and available tools</Text>

      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.quickActions}>
        {quickActions.map(action => (
          <TouchableOpacity
            key={action.name}
            style={styles.quickAction}
            onPress={() => executeAction(action.name)}
            disabled={executing !== null}
          >
            {executing === action.name ? (
              <ActivityIndicator color={colors.accentPurple} />
            ) : (
              <Ionicons name={action.icon as any} size={24} color={colors.accentPurple} />
            )}
            <Text style={styles.quickActionText}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {result && (
        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>Result</Text>
          <ScrollView horizontal>
            <Text style={styles.resultText}>{result}</Text>
          </ScrollView>
        </View>
      )}

      <Text style={styles.sectionTitle}>Available Actions ({actions.length})</Text>
      {actions.map((action, index) => (
        <View key={index} style={styles.actionCard}>
          <Text style={styles.actionName}>{action.name}</Text>
          <Text style={styles.actionDesc} numberOfLines={2}>
            {action.description}
          </Text>
        </View>
      ))}
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
  loadingText: {
    marginTop: spacing.md,
    color: colors.textSecondary,
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
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.md,
    marginTop: spacing.md,
  },
  quickActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  quickAction: {
    flex: 1,
    backgroundColor: colors.bgSecondary,
    borderRadius: 16,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickActionText: {
    marginTop: spacing.sm,
    fontSize: fontSize.sm,
    color: colors.textPrimary,
    fontWeight: '500',
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
  actionCard: {
    backgroundColor: colors.bgSecondary,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionName: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.accentPurple,
    fontFamily: 'monospace',
  },
  actionDesc: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
});
