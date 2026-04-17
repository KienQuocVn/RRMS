import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Colors, Spacing } from '@/constants/theme';
import { useDeposit } from '@/hooks/use-deposit';
import {
  DepositHeader,
  DepositSearchBar,
  DepositFilterTabs,
  RoomCard,
} from '@/components/deposit';

export default function DepositScreen() {
  const {
    activeFilter,
    setActiveFilter,
    searchText,
    setSearchText,
    rooms,
  } = useDeposit();

  return (
    <View style={styles.container}>
      <DepositHeader />
      <DepositSearchBar searchText={searchText} setSearchText={setSearchText} />
      <DepositFilterTabs activeFilter={activeFilter} setActiveFilter={setActiveFilter} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {rooms.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.base,
    paddingBottom: Spacing['4xl'],
    gap: Spacing.md,
  },
});
