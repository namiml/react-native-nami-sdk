import React from 'react';
import {
  View,
  Text,
  Switch,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { CustomAttributesConfig, LaunchContextSelection, AttributeConfig } from '../types';

interface CustomAttributesSectionProps {
  config: CustomAttributesConfig;
  selection: LaunchContextSelection;
  currentTag: string;
  onSelectionUpdate: (selection: LaunchContextSelection) => void;
}

export const CustomAttributesSection: React.FC<CustomAttributesSectionProps> = ({
  config,
  selection,
  currentTag,
  onSelectionUpdate,
}) => {
  const handleToggleEnabled = (enabled: boolean) => {
    onSelectionUpdate({
      ...selection,
      customAttributesEnabled: enabled,
    });
  };

  const handlePresetApply = (presetId: string) => {
    const preset = config.presets?.find(p => p.id === presetId);
    if (preset) {
      const newAttributeValues = { ...selection.attributeValues };
      Object.entries(preset.values).forEach(([key, value]) => {
        newAttributeValues[key] = value;
      });

      onSelectionUpdate({
        ...selection,
        appliedPresetId: presetId,
        attributeValues: newAttributeValues,
      });
    }
  };

  const handleAttributeToggle = (key: string, enabled: boolean, attribute: AttributeConfig) => {
    const newAttributeValues = { ...selection.attributeValues };

    if (enabled) {
      newAttributeValues[key] = attribute.defaultValue ?? getDefaultForType(attribute.type);
    } else {
      delete newAttributeValues[key];
    }

    onSelectionUpdate({
      ...selection,
      attributeValues: newAttributeValues,
    });
  };

  const handleAttributeValueChange = (key: string, value: any) => {
    onSelectionUpdate({
      ...selection,
      attributeValues: {
        ...selection.attributeValues,
        [key]: value,
      },
    });
  };

  const getDefaultForType = (type: string): any => {
    switch (type) {
      case 'string': return '';
      case 'number': return 0;
      case 'boolean': return false;
      case 'enum': return '';
      default: return '';
    }
  };

  const shouldShowForTag = (tags: string[] | undefined): boolean => {
    if (currentTag === 'all') return true;
    return tags?.includes(currentTag) ?? true;
  };

  const visiblePresets = config.presets?.filter(preset =>
    shouldShowForTag(preset.tags)
  ) ?? [];

  const visibleAttributes = config.attributes?.filter(attr =>
    shouldShowForTag(attr.tags)
  ) ?? [];

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        {config.label || 'Custom Attributes'}
      </Text>

      {config.description && (
        <Text style={styles.description}>{config.description}</Text>
      )}

      <View style={styles.switchRow}>
        <Switch
          value={selection.customAttributesEnabled}
          onValueChange={handleToggleEnabled}
          trackColor={{ false: '#E0E0E0', true: '#81b0ff' }}
          thumbColor={selection.customAttributesEnabled ? '#007AFF' : '#f4f3f4'}
        />
        <Text style={styles.switchLabel}>Enable Custom Attributes</Text>
      </View>

      {selection.customAttributesEnabled && (
        <View style={styles.attributesContainer}>
          {/* Presets */}
          {visiblePresets.length > 0 && (
            <>
              <Text style={styles.presetsTitle}>Quick Presets</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.presetsScroll}
              >
                {visiblePresets.map(preset => (
                  <TouchableOpacity
                    key={preset.id}
                    style={[
                      styles.presetChip,
                      selection.appliedPresetId === preset.id && styles.presetChipSelected,
                    ]}
                    onPress={() => handlePresetApply(preset.id)}
                  >
                    <Text
                      style={[
                        styles.presetChipText,
                        selection.appliedPresetId === preset.id && styles.presetChipTextSelected,
                      ]}>
                      {preset.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </>
          )}

          {/* Individual Attributes */}
          {visibleAttributes.map(attribute => (
            <AttributeControl
              key={attribute.key}
              attribute={attribute}
              currentValue={selection.attributeValues[attribute.key]}
              onToggle={(enabled) => handleAttributeToggle(attribute.key, enabled, attribute)}
              onValueChange={(value) => handleAttributeValueChange(attribute.key, value)}
            />
          ))}
        </View>
      )}
    </View>
  );
};

interface AttributeControlProps {
  attribute: AttributeConfig;
  currentValue: any;
  onToggle: (enabled: boolean) => void;
  onValueChange: (value: any) => void;
}

const AttributeControl: React.FC<AttributeControlProps> = ({
  attribute,
  currentValue,
  onToggle,
  onValueChange,
}) => {
  const isEnabled = currentValue !== undefined;

  const renderControl = () => {
    if (!isEnabled) return null;

    switch (attribute.type) {
      case 'string':
        return (
          <TextInput
            style={styles.textInput}
            value={currentValue || ''}
            onChangeText={onValueChange}
            placeholder={attribute.placeholder}
            placeholderTextColor="#999"
          />
        );

      case 'number':
        return (
          <TextInput
            style={styles.textInput}
            value={currentValue?.toString() || ''}
            onChangeText={(text) => {
              const num = parseFloat(text);
              if (!isNaN(num)) {
                onValueChange(num);
              }
            }}
            keyboardType="numeric"
            placeholder={attribute.placeholder}
            placeholderTextColor="#999"
          />
        );

      case 'boolean':
        return (
          <View style={styles.booleanControl}>
            <TouchableOpacity
              style={[styles.booleanOption, currentValue === true && styles.booleanOptionSelected]}
              onPress={() => onValueChange(true)}
            >
              <Text style={[styles.booleanOptionText, currentValue === true && styles.booleanOptionTextSelected]}>
                true
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.booleanOption, currentValue === false && styles.booleanOptionSelected]}
              onPress={() => onValueChange(false)}
            >
              <Text style={[styles.booleanOptionText, currentValue === false && styles.booleanOptionTextSelected]}>
                false
              </Text>
            </TouchableOpacity>
          </View>
        );

      case 'enum':
        return (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}>
            <View style={styles.enumControl}>
              {attribute.values?.map(value => {
                const label = attribute.valueLabels?.[value] || value;
                return (
                  <TouchableOpacity
                    key={value}
                    style={[styles.enumOption, currentValue === value && styles.enumOptionSelected]}
                    onPress={() => onValueChange(value)}
                  >
                    <Text style={[styles.enumOptionText, currentValue === value && styles.enumOptionTextSelected]}>
                      {label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.attributeControl}>
      <View style={styles.attributeHeader}>
        <Switch
          value={isEnabled}
          onValueChange={onToggle}
          trackColor={{ false: '#E0E0E0', true: '#81b0ff' }}
          thumbColor={isEnabled ? '#007AFF' : '#f4f3f4'}
        />
        <Text style={styles.attributeLabel}>{attribute.label}</Text>
      </View>

      {attribute.description && (
        <Text style={styles.attributeDescription}>{attribute.description}</Text>
      )}

      {renderControl()}
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
  attributesContainer: {
    paddingLeft: 12,
  },
  presetsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: 'black',
    marginBottom: 8,
  },
  presetsScroll: {
    marginBottom: 16,
  },
  presetChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    marginRight: 8,
  },
  presetChipSelected: {
    backgroundColor: '#FFB800',
  },
  presetChipText: {
    fontSize: 14,
    color: '#333',
  },
  presetChipTextSelected: {
    color: 'white',
  },
  attributeControl: {
    marginBottom: 16,
  },
  attributeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  attributeLabel: {
    marginLeft: 16,
    fontSize: 14,
    fontWeight: '600',
    color: 'black',
  },
  attributeDescription: {
    fontSize: 12,
    color: 'gray',
    marginLeft: 56,
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginLeft: 56,
    fontSize: 14,
    color: 'black',
  },
  booleanControl: {
    flexDirection: 'row',
    marginLeft: 56,
    gap: 8,
  },
  booleanOption: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
  },
  booleanOptionSelected: {
    backgroundColor: '#007AFF',
  },
  booleanOptionText: {
    fontSize: 14,
    color: '#333',
  },
  booleanOptionTextSelected: {
    color: 'white',
  },
  enumControl: {
    flexDirection: 'row',
    marginLeft: 56,
    gap: 8,
  },
  enumOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
  },
  enumOptionSelected: {
    backgroundColor: '#007AFF',
  },
  enumOptionText: {
    fontSize: 14,
    color: '#333',
  },
  enumOptionTextSelected: {
    color: 'white',
  },
});
