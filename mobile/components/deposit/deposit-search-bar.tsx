import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes, BorderRadius } from '@/constants/theme';

interface DepositSearchBarProps {
  searchText: string;
  setSearchText: (text: string) => void;
}

export const DepositSearchBar = ({ searchText, setSearchText }: DepositSearchBarProps) => (
  <View style={styles.searchContainer}>
    <View style={styles.searchInputWrap}>
      <TextInput
        style={styles.searchInput}
        placeholder="Nhập tên phòng..."
        placeholderTextColor={Colors.gray400}
        value={searchText}
        onChangeText={setSearchText}
      />
      <TouchableOpacity style={styles.searchIconBtn}>
        <Ionicons name="search" size={22} color={Colors.textPrimary} />
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  searchContainer: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.white,
  },
  searchInputWrap: {
    position: 'relative',
    justifyContent: 'center',
  },
  searchInput: {
    height: 46,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray300,
    borderRadius: BorderRadius.full,
    paddingLeft: Spacing.lg,
    paddingRight: 48,
    fontSize: FontSizes.base,
    color: Colors.textPrimary,
  },
  searchIconBtn: {
    position: 'absolute',
    right: 14,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
