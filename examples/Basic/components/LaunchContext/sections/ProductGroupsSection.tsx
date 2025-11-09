import React from 'react';
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { ProductGroupsConfig, LaunchContextSelection } from '../types';

interface ProductGroupsSectionProps {
  config: ProductGroupsConfig;
  resolvedGroups: string[];
  selection: LaunchContextSelection;
  onSelectionUpdate: (selection: LaunchContextSelection) => void;
}

export const ProductGroupsSection: React.FC<ProductGroupsSectionProps> = ({
  config,
  resolvedGroups,
  selection,
  onSelectionUpdate,
}) => {
  const handleToggleEnabled = (enabled: boolean) => {
    onSelectionUpdate({
      ...selection,
      productGroupsEnabled: enabled,
    });
  };

  const handleGroupToggle = (group: string) => {
    const newSelection = new Set(selection.selectedProductGroupIds);

    if (newSelection.has(group)) {
      newSelection.delete(group);
    } else {
      // If not allowing multiple, clear others
      if (!config.allowMultiple) {
        newSelection.clear();
      }
      newSelection.add(group);
    }

    onSelectionUpdate({
      ...selection,
      selectedProductGroupIds: newSelection,
    });
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        {config.label || 'Product Groups'}
      </Text>

      {config.description && (
        <Text style={styles.description}>{config.description}</Text>
      )}

      <View style={styles.switchRow}>
        <Switch
          value={selection.productGroupsEnabled}
          onValueChange={handleToggleEnabled}
          trackColor={{ false: '#E0E0E0', true: '#81b0ff' }}
          thumbColor={selection.productGroupsEnabled ? '#007AFF' : '#f4f3f4'}
        />
        <Text style={styles.switchLabel}>Enable Product Groups</Text>
      </View>

      {selection.productGroupsEnabled && (
        <View style={styles.groupsContainer}>
          {resolvedGroups.map(group => (
            <TouchableOpacity
              key={group}
              style={styles.checkboxRow}
              onPress={() => handleGroupToggle(group)}
            >
              <View style={[
                styles.checkbox,
                selection.selectedProductGroupIds.has(group) && styles.checkboxChecked,
              ]}>
                {selection.selectedProductGroupIds.has(group) && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </View>
              <Text style={styles.checkboxLabel}>{group}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#FAFAFA',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 16,
    lineHeight: 20,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  switchLabel: {
    marginLeft: 16,
    fontSize: 14,
    color: 'black',
  },
  groupsContainer: {
    paddingLeft: 12,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#333',
    borderRadius: 4,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  checkmark: {
    color: 'white',
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 14,
    color: 'black',
    flex: 1,
  },
});
