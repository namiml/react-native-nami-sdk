import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';

interface TagFilterProps {
  tags: string[];
  selectedTag: string;
  onTagSelected: (tag: string) => void;
}

export const TagFilter: React.FC<TagFilterProps> = ({
  tags,
  selectedTag,
  onTagSelected,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {tags.map(tag => (
        <TouchableOpacity
          key={tag}
          style={[
            styles.chip,
            selectedTag === tag && styles.selectedChip,
          ]}
          onPress={() => onTagSelected(tag)}
        >
          <Text style={[
            styles.chipText,
            selectedTag === tag && styles.selectedChipText,
          ]}>
            {tag.toLowerCase()}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    maxHeight: 50,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    marginRight: 8,
  },
  selectedChip: {
    backgroundColor: '#007AFF',
  },
  chipText: {
    fontSize: 14,
    color: '#333',
  },
  selectedChipText: {
    color: 'white',
  },
});
