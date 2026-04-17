import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, FontSizes, FontWeights, Spacing } from '@/constants/theme';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const Header = () => (
    <View style={[styles.header, { paddingTop: Platform.OS === 'ios' ? insets.top : insets.top + Spacing.sm }]}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
      </TouchableOpacity>
      <View style={styles.headerTitleWrap}>
        <Text style={styles.headerTitle}>Thêm</Text>
        <Text style={styles.headerSub}>Cá nhân</Text>
      </View>
    </View>
  );

  const ProfileItem = ({ label, value, valueColor, valueBold, rightElement }: any) => (
    <View style={styles.profileItem}>
      <Text style={styles.itemLabel}>{label}</Text>
      <View style={styles.itemRight}>
        {typeof value === 'string' ? (
          <Text style={[
            styles.itemValue, 
            { color: valueColor || Colors.textPrimary, fontWeight: valueBold ? 'bold' : 'normal' }
          ]}>
            {value}
          </Text>
        ) : (
          value
        )}
        {rightElement && <View style={styles.rightElement}>{rightElement}</View>}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView style={styles.scrollView}>
        <View style={styles.topSection}>
          <Image source={{ uri: 'https://avatar.iran.liara.run/public/boy' }} style={styles.avatar} />
          <TouchableOpacity style={styles.editBtn}>
            <Ionicons name="pencil" size={16} color={Colors.textPrimary} style={{ marginRight: 6 }} />
            <Text style={styles.editBtnText}>Chỉnh sửa</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.listSection}>
          <ProfileItem 
            label="Mã tài khoản khách hàng" 
            value="#26OW00013430" 
            valueColor={Colors.success}
            valueBold
            rightElement={<Ionicons name="copy-outline" size={20} color={Colors.textPrimary} />}
          />
          <ProfileItem 
            label="Trạng thái tài khoản" 
            value={
              <View style={styles.verifiedBadge}>
                <View style={styles.verifiedDot} />
                <Text style={styles.verifiedText}>Đã xác minh</Text>
              </View>
            }
          />
          <ProfileItem label="Tên" value="Kiến Quốc" valueBold />
          <ProfileItem label="Số điện thoại" value="Chưa cung cấp SĐT" valueColor="#E65100" />
          <ProfileItem label="Email" value="không có" valueBold />
          <ProfileItem label="Ngày tham gia" value="18:30:06 10/4/2026" valueBold />
          <ProfileItem label="Đăng nhập lần đầu tiên" value="không có" valueBold />
        </View>

        <View style={styles.actionsSection}>
          <TouchableOpacity style={styles.logoutBtn}>
            <Ionicons name="log-out-outline" size={20} color={Colors.textPrimary} style={{ marginRight: 8 }} />
            <Text style={styles.logoutBtnText}>Đăng xuất tài khoản</Text>
          </TouchableOpacity>

          <Text style={styles.deleteLabel}>Tôi muốn xóa tài khoản</Text>
          
          <TouchableOpacity style={styles.deleteBtn}>
            <Ionicons name="trash" size={18} color={Colors.white} style={{ marginRight: 8 }} />
            <Text style={styles.deleteBtnText}>Xóa tài khoản vĩnh viễn</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.md,
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
  scrollView: {
    flex: 1,
  },
  topSection: {
    backgroundColor: Colors.white,
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.gray200,
    marginBottom: Spacing.md,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.gray300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  editBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  listSection: {
    backgroundColor: Colors.white,
    marginBottom: Spacing.md,
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  itemLabel: {
    fontSize: 14,
    color: Colors.textPrimary,
  },
  itemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemValue: {
    fontSize: 14,
  },
  rightElement: {
    marginLeft: 8,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verifiedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4CAF50',
    marginRight: 4,
  },
  verifiedText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  actionsSection: {
    backgroundColor: Colors.white,
    padding: Spacing.base,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing['3xl'],
    alignItems: 'center',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: Spacing.xl,
  },
  logoutBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  deleteLabel: {
    fontSize: 14,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.error,
    width: '100%',
    paddingVertical: 14,
    borderRadius: 8,
  },
  deleteBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.white,
  },
});
