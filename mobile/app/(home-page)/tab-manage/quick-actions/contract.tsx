import React, { useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { RefreshableScrollView as ScrollView } from '@/components/ui/refreshable-scroll-view';
import { Colors, Spacing } from '@/constants/theme';
import { useContract } from '@/hooks/use-contract';
import {
  ContractHeader,
  ContractSearchBar,
  ContractRoomCard,
} from '@/components/contract';
import { DepositRoom } from '@/types/deposit.types';

export default function ContractScreen() {
  const router = useRouter();
  const {
    searchText,
    setSearchText,
    rooms,
    allRooms,
    activeMotelId,
    activeMotelName,
    isLoading,
    loadRooms,
  } = useContract();

  // Tải lại danh sách phòng mỗi khi màn hình được focus
  useFocusEffect(
    useCallback(() => {
      loadRooms();
    }, [loadRooms]),
  );

  const handleRoomPress = (room: DepositRoom) => {
    router.push({
      pathname: '/(home-page)/tab-manage/quick-actions/contract-form',
      params: {
        roomId: room.roomId,
        roomName: room.name,
        roomPrice: String(room.price || 0),
        roomDeposit: String(room.deposit || room.price || 0),
        motelId: activeMotelId,
        reservationId: room.reservation?.id ?? '',
        reservationData: room.reservation ? JSON.stringify(room.reservation) : '',
      },
    });
  };

  return (
    <View style={styles.container}>
      <ContractHeader motelName={activeMotelName} />
      <ContractSearchBar searchText={searchText} setSearchText={setSearchText} />

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.success} />
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          onRefreshContent={loadRooms}
        >
          {rooms.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {allRooms.length === 0
                  ? 'Chưa có phòng nào trong nhà trọ này.'
                  : 'Không tìm thấy phòng phù hợp.'}
              </Text>
            </View>
          ) : (
            rooms.map((room) => (
              <ContractRoomCard
                key={room.roomId}
                room={room}
                onPress={() => handleRoomPress(room)}
              />
            ))
          )}
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
  emptyContainer: {
    paddingVertical: Spacing['3xl'],
    alignItems: 'center',
  },
  emptyText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
});
