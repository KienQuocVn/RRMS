import React, { useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from 'expo-router';
import { RefreshableScrollView as ScrollView } from '@/components/ui/refreshable-scroll-view';
import { Colors, Spacing } from '@/constants/theme';
import { useDeposit } from '@/hooks/use-deposit';
import {
  DepositHeader,
  DepositSearchBar,
  DepositFilterTabs,
  RoomCard,
} from '@/components/deposit';
import { DepositRoom } from '@/types/deposit.types';

export default function DepositScreen() {
  const router = useRouter();
  const {
    activeFilter,
    setActiveFilter,
    searchText,
    setSearchText,
    rooms,
    isLoading,
    loadRooms,
    depositingCount,
    totalCount,
  } = useDeposit();

  // Tải lại data mỗi khi màn hình được focus
  useFocusEffect(
    useCallback(() => {
      loadRooms();
    }, [loadRooms]),
  );

  const handleRoomPress = (room: DepositRoom) => {
    router.push({
      pathname: '/(home-page)/tab-manage/quick-actions/deposit-form',
      params: {
        roomId: room.roomId,
        roomName: room.name,
        roomPrice: String(room.price),
        roomDeposit: String(room.deposit),
        reservationId: room.reservation?.id ?? '',
        reservationData: room.reservation ? JSON.stringify(room.reservation) : '',
      },
    });
  };

  return (
    <View style={styles.container}>
      <DepositHeader />
      <DepositSearchBar searchText={searchText} setSearchText={setSearchText} />
      <DepositFilterTabs
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        depositingCount={depositingCount}
        totalCount={totalCount}
      />

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.success} />
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          onRefresh={loadRooms}
        >
          {rooms.map((room) => (
            <RoomCard key={room.roomId} room={room} onPress={() => handleRoomPress(room)} />
          ))}
        </ScrollView>
      )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
