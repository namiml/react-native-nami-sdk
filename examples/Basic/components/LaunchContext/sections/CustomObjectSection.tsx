import React, { useState } from 'react';
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
} from 'react-native';
import { CustomObjectConfig, LaunchContextSelection } from '../types';

interface CustomObjectSectionProps {
  config: CustomObjectConfig;
  selection: LaunchContextSelection;
  currentTag: string;
  onSelectionUpdate: (selection: LaunchContextSelection) => void;
}

export const CustomObjectSection: React.FC<CustomObjectSectionProps> = ({
  config,
  selection,
  currentTag,
  onSelectionUpdate,
}) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleToggleEnabled = (enabled: boolean) => {
    onSelectionUpdate({
      ...selection,
      customObjectEnabled: enabled,
    });
  };

  const handleSelectObject = (id: string) => {
    onSelectionUpdate({
      ...selection,
      selectedCustomObjectId: id,
    });
    setDropdownVisible(false);
  };

  const shouldShowForTag = (tags: string[] | undefined): boolean => {
    if (currentTag === 'all') return true;
    return tags?.includes(currentTag) ?? true;
  };

  const visibleChoices = config.choices?.filter(choice =>
    shouldShowForTag(choice.tags)
  ) ?? [];

  const selectedChoice = visibleChoices.find(
    c => c.id === selection.selectedCustomObjectId
  );

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        {config.label || 'Custom Object'}
      </Text>

      {config.description && (
        <Text style={styles.description}>{config.description}</Text>
      )}

      <View style={styles.switchRow}>
        <Switch
          value={selection.customObjectEnabled}
          onValueChange={handleToggleEnabled}
          trackColor={{ false: '#E0E0E0', true: '#81b0ff' }}
          thumbColor={selection.customObjectEnabled ? '#007AFF' : '#f4f3f4'}
        />
        <Text style={styles.switchLabel}>Enable Custom Object</Text>
      </View>

      {selection.customObjectEnabled && visibleChoices.length > 0 && (
        <>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setDropdownVisible(true)}
          >
            <Text style={styles.dropdownText}>
              {selectedChoice?.label || 'Select an option'}
            </Text>
            <Text style={styles.dropdownArrow}>▼</Text>
          </TouchableOpacity>

          <Modal
            visible={dropdownVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setDropdownVisible(false)}
          >
            <TouchableOpacity
              style={styles.modalOverlay}
              activeOpacity={1}
              onPress={() => setDropdownVisible(false)}
            >
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Select an option</Text>
                <FlatList
                  data={visibleChoices}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.modalItem}
                      onPress={() => handleSelectObject(item.id)}
                    >
                      <Text
                        style={[
                          styles.modalItemText,
                          item.id === selection.selectedCustomObjectId && styles.selectedItemText,
                        ]}>
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </TouchableOpacity>
          </Modal>
        </>
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
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 8,
  },
  description: {
    fontSize: 12,
    color: 'gray',
    marginBottom: 12,
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
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 12,
  },
  dropdownText: {
    fontSize: 14,
    color: 'black',
  },
  dropdownArrow: {
    fontSize: 12,
    color: 'gray',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    maxHeight: 300,
    width: '80%',
    padding: 0,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalItemText: {
    fontSize: 14,
    color: 'black',
  },
  selectedItemText: {
    color: '#007AFF',
    fontWeight: '600',
  },
});
