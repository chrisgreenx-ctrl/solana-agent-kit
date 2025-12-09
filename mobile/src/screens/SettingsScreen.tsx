import React, { useState, useEffect } from 'react';
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
  onConfigUpdate: () => void;
}

export default function SettingsScreen({ onConfigUpdate }: Props) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState({
    openRouterApiKey: false,
    rpcUrl: false,
    solanaPrivateKey: false,
    isFullyConfigured: false,
    model: 'openai/gpt-4o',
  });

  const [apiKey, setApiKey] = useState('');
  const [rpcUrl, setRpcUrl] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [model, setModel] = useState('openai/gpt-4o');

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const data = await api.getConfig();
      setConfig(data);
      setModel(data.model || 'openai/gpt-4o');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const saveConfig = async () => {
    setSaving(true);
    try {
      const updates: any = { model };
      if (apiKey) updates.openRouterApiKey = apiKey;
      if (rpcUrl) updates.rpcUrl = rpcUrl;
      if (privateKey) updates.solanaPrivateKey = privateKey;

      await api.updateConfig(updates);
      await loadConfig();
      onConfigUpdate();
      
      setApiKey('');
      setRpcUrl('');
      setPrivateKey('');
      
      Alert.alert('Success', 'Configuration saved successfully');
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={colors.accentPurple} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.subtitle}>Configure your Solana Agent</Text>

      <View style={styles.statusCard}>
        <Text style={styles.statusTitle}>Configuration Status</Text>
        <View style={styles.statusRow}>
          <Ionicons
            name={config.openRouterApiKey ? 'checkmark-circle' : 'close-circle'}
            size={20}
            color={config.openRouterApiKey ? colors.success : colors.error}
          />
          <Text style={styles.statusText}>OpenRouter API Key</Text>
        </View>
        <View style={styles.statusRow}>
          <Ionicons
            name={config.rpcUrl ? 'checkmark-circle' : 'close-circle'}
            size={20}
            color={config.rpcUrl ? colors.success : colors.error}
          />
          <Text style={styles.statusText}>RPC URL</Text>
        </View>
        <View style={styles.statusRow}>
          <Ionicons
            name={config.solanaPrivateKey ? 'checkmark-circle' : 'close-circle'}
            size={20}
            color={config.solanaPrivateKey ? colors.success : colors.error}
          />
          <Text style={styles.statusText}>Solana Private Key</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Update Configuration</Text>
        
        <Text style={styles.inputLabel}>OpenRouter API Key</Text>
        <TextInput
          style={styles.input}
          value={apiKey}
          onChangeText={setApiKey}
          placeholder={config.openRouterApiKey ? '••••••••' : 'Enter API key'}
          placeholderTextColor={colors.textSecondary}
          secureTextEntry
        />

        <Text style={styles.inputLabel}>Solana RPC URL</Text>
        <TextInput
          style={styles.input}
          value={rpcUrl}
          onChangeText={setRpcUrl}
          placeholder={config.rpcUrl ? '••••••••' : 'https://api.mainnet-beta.solana.com'}
          placeholderTextColor={colors.textSecondary}
        />

        <Text style={styles.inputLabel}>Private Key (Base58)</Text>
        <TextInput
          style={styles.input}
          value={privateKey}
          onChangeText={setPrivateKey}
          placeholder={config.solanaPrivateKey ? '••••••••' : 'Enter private key'}
          placeholderTextColor={colors.textSecondary}
          secureTextEntry
        />

        <Text style={styles.inputLabel}>AI Model</Text>
        <TextInput
          style={styles.input}
          value={model}
          onChangeText={setModel}
          placeholder="openai/gpt-4o"
          placeholderTextColor={colors.textSecondary}
        />

        <TouchableOpacity
          style={[styles.btn, saving && styles.btnDisabled]}
          onPress={saveConfig}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color={colors.textPrimary} />
          ) : (
            <Text style={styles.btnText}>Save Configuration</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.infoCard}>
        <Ionicons name="information-circle" size={20} color={colors.accentBlue} />
        <Text style={styles.infoText}>
          Your keys are stored in memory only and will be cleared when the server restarts.
          For persistent storage, set environment variables on your server.
        </Text>
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
  statusCard: {
    backgroundColor: colors.bgSecondary,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statusText: {
    marginLeft: spacing.sm,
    color: colors.textPrimary,
    fontSize: fontSize.md,
  },
  card: {
    backgroundColor: colors.bgSecondary,
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  cardTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.textPrimary,
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
  infoCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    marginLeft: spacing.sm,
    color: colors.accentBlue,
    fontSize: fontSize.sm,
  },
});
