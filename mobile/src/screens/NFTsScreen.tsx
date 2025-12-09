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

export default function NFTsScreen({ isConfigured }: Props) {
  const [activeTab, setActiveTab] = useState<'deploy' | 'mint' | 'search'>('deploy');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const [collectionName, setCollectionName] = useState('');
  const [collectionUri, setCollectionUri] = useState('');
  const [royaltyBps, setRoyaltyBps] = useState('500');

  const [mintCollection, setMintCollection] = useState('');
  const [mintName, setMintName] = useState('');
  const [mintUri, setMintUri] = useState('');

  const [searchCreator, setSearchCreator] = useState('');

  if (!isConfigured) {
    return (
      <View style={[styles.container, styles.center]}>
        <Ionicons name="images-outline" size={48} color={colors.textSecondary} />
        <Text style={styles.disabledText}>
          Configure your API keys in Settings to use NFT operations
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

  const handleDeploy = () => {
    if (!collectionName || !collectionUri) {
      Alert.alert('Error', 'Please fill in collection name and URI');
      return;
    }
    executeAction('DEPLOY_COLLECTION', {
      name: collectionName,
      uri: collectionUri,
      royaltyBasisPoints: parseInt(royaltyBps) || 500,
    });
  };

  const handleMint = () => {
    if (!mintCollection || !mintName || !mintUri) {
      Alert.alert('Error', 'Please fill in all mint fields');
      return;
    }
    executeAction('MINT_NFT', {
      collectionMint: mintCollection,
      name: mintName,
      uri: mintUri,
    });
  };

  const handleSearch = () => {
    if (!searchCreator) {
      Alert.alert('Error', 'Please enter a creator address');
      return;
    }
    executeAction('GET_ASSETS_BY_CREATOR', { creator: searchCreator });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>NFTs</Text>
      <Text style={styles.subtitle}>Deploy collections, mint NFTs, and search assets</Text>

      <View style={styles.tabs}>
        {(['deploy', 'mint', 'search'] as const).map(tab => (
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
        {activeTab === 'deploy' && (
          <>
            <Text style={styles.inputLabel}>Collection Name</Text>
            <TextInput
              style={styles.input}
              value={collectionName}
              onChangeText={setCollectionName}
              placeholder="My NFT Collection"
              placeholderTextColor={colors.textSecondary}
            />
            <Text style={styles.inputLabel}>Metadata URI</Text>
            <TextInput
              style={styles.input}
              value={collectionUri}
              onChangeText={setCollectionUri}
              placeholder="https://arweave.net/..."
              placeholderTextColor={colors.textSecondary}
            />
            <Text style={styles.inputLabel}>Royalty (basis points, 500 = 5%)</Text>
            <TextInput
              style={styles.input}
              value={royaltyBps}
              onChangeText={setRoyaltyBps}
              placeholder="500"
              placeholderTextColor={colors.textSecondary}
              keyboardType="number-pad"
            />
            <TouchableOpacity
              style={[styles.btn, loading && styles.btnDisabled]}
              onPress={handleDeploy}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={colors.textPrimary} />
              ) : (
                <Text style={styles.btnText}>Deploy Collection</Text>
              )}
            </TouchableOpacity>
          </>
        )}

        {activeTab === 'mint' && (
          <>
            <Text style={styles.inputLabel}>Collection Mint Address</Text>
            <TextInput
              style={styles.input}
              value={mintCollection}
              onChangeText={setMintCollection}
              placeholder="Collection mint address"
              placeholderTextColor={colors.textSecondary}
            />
            <Text style={styles.inputLabel}>NFT Name</Text>
            <TextInput
              style={styles.input}
              value={mintName}
              onChangeText={setMintName}
              placeholder="My NFT #1"
              placeholderTextColor={colors.textSecondary}
            />
            <Text style={styles.inputLabel}>Metadata URI</Text>
            <TextInput
              style={styles.input}
              value={mintUri}
              onChangeText={setMintUri}
              placeholder="https://arweave.net/..."
              placeholderTextColor={colors.textSecondary}
            />
            <TouchableOpacity
              style={[styles.btn, loading && styles.btnDisabled]}
              onPress={handleMint}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={colors.textPrimary} />
              ) : (
                <Text style={styles.btnText}>Mint NFT</Text>
              )}
            </TouchableOpacity>
          </>
        )}

        {activeTab === 'search' && (
          <>
            <Text style={styles.inputLabel}>Creator Address</Text>
            <TextInput
              style={styles.input}
              value={searchCreator}
              onChangeText={setSearchCreator}
              placeholder="Enter creator wallet address"
              placeholderTextColor={colors.textSecondary}
            />
            <TouchableOpacity
              style={[styles.btn, loading && styles.btnDisabled]}
              onPress={handleSearch}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={colors.textPrimary} />
              ) : (
                <Text style={styles.btnText}>Search Assets</Text>
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
