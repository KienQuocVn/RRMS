import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, FontSizes, FontWeights, Spacing, BorderRadius } from '@/constants/theme';

export default function NewChatScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const Header = () => (
    <View style={[styles.header, { paddingTop: Platform.OS === 'ios' ? insets.top : insets.top + Spacing.sm }]}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
      </TouchableOpacity>
      <View style={styles.headerTitleWrap}>
        <Text style={styles.headerTitle}>Thêm chat mới</Text>
        <Text style={styles.headerSub}>Chọn phòng / khách chat</Text>
      </View>
      <TouchableOpacity style={styles.headerRightBtn}>
        <Ionicons name="home-outline" size={16} color={Colors.textPrimary} style={{ marginRight: 4 }} />
        <Text style={styles.headerRightText}>Quoc</Text>
      </TouchableOpacity>
    </View>
  );

  const RoomItem = ({ title }: { title: string }) => (
    <View style={styles.roomItem}>
      <View style={styles.roomAvatar}>
        <MaterialCommunityIcons name="storefront-outline" size={26} color="#8BC34A" />
      </View>
      <View style={styles.roomInfo}>
        <Text style={styles.roomTitle}>{title}</Text>
        <View style={styles.roomStatusRow}>
          <Ionicons name="close" size={12} color={Colors.error} />
          <Text style={styles.roomStatusText}>Chưa kết nối - Chưa sử dụng APP</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.chatBtn}>
        <Ionicons name="chatbubble-outline" size={14} color={Colors.white} style={{ marginRight: 6 }} />
        <Text style={styles.chatBtnText}>Chat</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity style={styles.chatAllBtn}>
          <Ionicons name="home-outline" size={18} color={Colors.success} style={{ marginRight: 8 }} />
          <Text style={styles.chatAllText}>Chat với phòng</Text>
        </TouchableOpacity>

        <View style={styles.listContainer}>
          <RoomItem title="Phòng 1" />
          <RoomItem title="Phòng 2" />
          <RoomItem title="Phòng 3" />
          <RoomItem title="Phòng 4" />
          <RoomItem title="Phòng 5" />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  headerTitleWrap: {
    flex: 1,
  },
  headerTitle: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  headerSub: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  headerRightBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  headerRightText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.base,
  },
  chatAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F5E9',
    paddingVertical: 14,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#C8E6C9',
    marginBottom: Spacing.lg,
  },
  chatAllText: {
    fontSize: FontSizes.md,
    fontWeight: 'bold',
    color: Colors.success,
  },
  listContainer: {
    borderTopWidth: 1,
    borderTopColor: Colors.gray50,
  },
  roomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray50,
  },
  roomAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  roomInfo: {
    flex: 1,
  },
  roomTitle: {
    fontSize: FontSizes.md,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  roomStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roomStatusText: {
    fontSize: 12,
    color: Colors.error,
    marginLeft: 2,
  },
  chatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.success,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  chatBtnText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: 'bold',
  },
});
