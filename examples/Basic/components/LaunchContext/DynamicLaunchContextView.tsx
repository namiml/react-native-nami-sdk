import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import {
  LaunchContextConfig,
  LaunchContextSelection,
  LaunchContextResult,
} from './types';
import { ProductGroupsSection } from './sections/ProductGroupsSection';
import { CustomObjectSection } from './sections/CustomObjectSection';
import { CustomAttributesSection } from './sections/CustomAttributesSection';
import { TagFilter } from './components/TagFilter';
import { NamiCampaignManager } from 'react-native-nami-sdk';
import launchContextConfig from '../../launch_context.json';

interface DynamicLaunchContextViewProps {
  campaignLabel?: string;
  campaignName?: string;
  onLaunchWithContext: (context: LaunchContextResult) => void;
  onClose: () => void;
}

export const DynamicLaunchContextView: React.FC<DynamicLaunchContextViewProps> = ({
  campaignLabel,
  campaignName,
  onLaunchWithContext,
  onClose,
}) => {
  const [config, setConfig] = useState<LaunchContextConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resolvedProductGroups, setResolvedProductGroups] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>(['all']);

  const [selection, setSelection] = useState<LaunchContextSelection>({
    productGroupsEnabled: false,
    selectedProductGroupIds: new Set(),
    customObjectEnabled: false,
    selectedCustomObjectId: undefined,
    customAttributesEnabled: false,
    attributeValues: {},
    appliedPresetId: undefined,
    currentTag: 'all',
  });

  // Load configuration
  useEffect(() => {
    const loadConfig = async () => {
      try {
        setLoading(true);
        const typedConfig = launchContextConfig as LaunchContextConfig;

        // Initialize selection with defaults from config
        const defaultSelection: LaunchContextSelection = {
          productGroupsEnabled: typedConfig.productGroups?.enabledByDefault ?? false,
          selectedProductGroupIds: new Set(typedConfig.productGroups?.defaultSelection ?? []),
          customObjectEnabled: typedConfig.customObject?.enabledByDefault ?? false,
          selectedCustomObjectId: typedConfig.customObject?.defaultSelection,
          customAttributesEnabled: typedConfig.customAttributes?.enabledByDefault ?? false,
          attributeValues: {},
          appliedPresetId: undefined,
          currentTag: typedConfig.defaultTag ?? 'all',
        };

        setSelection(defaultSelection);
        setConfig(typedConfig);

        // Collect all available tags
        const tags = collectTags(typedConfig);
        setAvailableTags(tags);

      } catch (err) {
        setError(`Failed to load configuration: ${err}`);
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, []);

  // Resolve product groups when campaign label is available
  useEffect(() => {
    const resolveGroups = async () => {
      if (!config?.productGroups || !campaignLabel) return;

      const configGroups = config.productGroups.choices ?? [];

      if (config.productGroups.autoPopulateFromPaywall) {
        try {
          const paywallGroups = await NamiCampaignManager.getProductGroups(campaignLabel);
          const allGroups = [...new Set([...configGroups, ...paywallGroups])];
          setResolvedProductGroups(allGroups);
        } catch (err) {
          console.warn('Failed to get paywall product groups:', err);
          setResolvedProductGroups(configGroups);
        }
      } else {
        setResolvedProductGroups(configGroups);
      }
    };

    resolveGroups();
  }, [config, campaignLabel]);

  const collectTags = (cfg: LaunchContextConfig): string[] => {
    const tags = new Set<string>(['all']);

    cfg.productGroups?.tags?.forEach(tag => tags.add(tag));
    cfg.customObject?.tags?.forEach(tag => tags.add(tag));
    cfg.customObject?.choices?.forEach(choice =>
      choice.tags?.forEach(tag => tags.add(tag))
    );
    cfg.customAttributes?.presets?.forEach(preset =>
      preset.tags?.forEach(tag => tags.add(tag))
    );
    cfg.customAttributes?.attributes?.forEach(attr =>
      attr.tags?.forEach(tag => tags.add(tag))
    );

    return Array.from(tags).sort();
  };

  const handleLaunch = useCallback(() => {
    const result: LaunchContextResult = {
      customAttributes: {},
    };

    // Build custom attributes
    if (selection.customAttributesEnabled) {
      Object.entries(selection.attributeValues).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          result.customAttributes[key] = String(value);
        }
      });
    }

    // Build product groups
    if (selection.productGroupsEnabled && selection.selectedProductGroupIds.size > 0) {
      result.productGroups = Array.from(selection.selectedProductGroupIds);
    }

    // Build custom object
    if (selection.customObjectEnabled && selection.selectedCustomObjectId) {
      const selectedChoice = config?.customObject?.choices?.find(
        c => c.id === selection.selectedCustomObjectId
      );
      if (selectedChoice) {
        result.customObject = selectedChoice.value;
      }
    }

    onLaunchWithContext(result);
  }, [selection, config, onLaunchWithContext]);

  const shouldShowForTag = (tags: string[] | undefined, currentTag: string): boolean => {
    if (currentTag === 'all') return true;
    return tags?.includes(currentTag) ?? true;
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading configuration...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={onClose}>
          <Text style={styles.buttonText}>Close</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!config) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>No configuration loaded</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={onClose}>
          <Text style={styles.buttonText}>Close</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Modal Header with Close Button */}
      <View style={styles.modalHeader}>
        <View style={styles.headerContent}>
          <Text style={styles.modalTitle}>Launch Configuration</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        {/* Content Header */}
        {(config.meta?.title || config.meta?.description) && (
          <View style={styles.contentHeader}>
            {config.meta?.title && (
              <Text style={styles.title}>{config.meta.title}</Text>
            )}
            {config.meta?.description && (
              <Text style={styles.description}>{config.meta.description}</Text>
            )}
          </View>
        )}

        {/* Tag Filter */}
        {config.showTags && availableTags.length > 1 && (
          <TagFilter
            tags={availableTags}
            selectedTag={selection.currentTag}
            onTagSelected={(tag) => setSelection({ ...selection, currentTag: tag })}
          />
        )}

        {/* Product Groups */}
        {config.productGroups && shouldShowForTag(config.productGroups.tags, selection.currentTag) && (
          <ProductGroupsSection
            config={config.productGroups}
            resolvedGroups={resolvedProductGroups}
            selection={selection}
            onSelectionUpdate={setSelection}
          />
        )}

        {/* Custom Object */}
        {config.customObject && shouldShowForTag(config.customObject.tags, selection.currentTag) && (
          <CustomObjectSection
            config={config.customObject}
            selection={selection}
            currentTag={selection.currentTag}
            onSelectionUpdate={setSelection}
          />
        )}

        {/* Custom Attributes */}
        {config.customAttributes && (
          <CustomAttributesSection
            config={config.customAttributes}
            selection={selection}
            currentTag={selection.currentTag}
            onSelectionUpdate={setSelection}
          />
        )}

        {/* Launch Button */}
        {campaignName && (
          <TouchableOpacity
            style={styles.launchButton}
            onPress={handleLaunch}>
            <Text style={styles.launchButtonText}>
              Launch {campaignName} with context
            </Text>
          </TouchableOpacity>
        )}


        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    paddingBottom: 12,
    paddingTop: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'black',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#333',
    fontWeight: '300',
  },
  scrollView: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  contentHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: 'gray',
    lineHeight: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: 'gray',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  launchButton: {
    backgroundColor: '#007AFF',
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  launchButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 40,
  },
});
