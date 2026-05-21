import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { RefreshableScrollView as ScrollView } from '@/components/ui/refreshable-scroll-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, FontSizes, FontWeights, Spacing, BorderRadius } from '@/constants/theme';

export default function PermissionsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const Header = () => (
    <View style={[styles.header, { paddingTop: Platform.OS === 'ios' ? insets.top : insets.top + Spacing.sm }]}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
      </TouchableOpacity>
      <View style={styles.headerTitleWrap}>
        <Text style={styles.headerTitle}>Thêm</Text>
        <Text style={styles.headerSub}>Quyền hạn phần mềm</Text>
      </View>
    </View>
  );

  const PermissionItem = ({ icon, title, description, status, statusColor, statusIcon }: any) => (
    <View style={styles.permissionItem}>
      <View style={styles.iconWrapper}>
        <Ionicons name={icon} size={24} color={Colors.textPrimary} />
      </View>
      <View style={styles.permissionInfo}>
        <Text style={styles.permissionTitle}>{title}</Text>
        <Text style={styles.permissionDesc}>{description}</Text>
        <View style={styles.statusRow}>
          <Ionicons name={statusIcon} size={16} color={statusColor} style={{ marginRight: 4 }} />
          <Text style={[styles.statusText, { color: statusColor }]}>{status}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView style={styles.scrollView}>
        
        <View style={styles.topSection}>
          <Text style={styles.alertText}>
            Cấp tất cả các quyền bên dưới để phần mềm hoạt động tốt nhất!
          </Text>
          <TouchableOpacity style={styles.btnViewAll}>
            <Ionicons name="settings-outline" size={20} color={Colors.white} style={{ marginRight: 8 }} />
            <Text style={styles.btnViewAllText}>Xem tất cả quyền</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.listContainer}>
          <PermissionItem
            icon="camera"
            title="Quyền truy cập máy ảnh"
            description="Là quyền truy cập dùng để chụp ảnh làm tư liệu phòng cho bạn"
            status="Đã có quyền"
            statusColor={Colors.success}
            statusIcon="checkmark"
          />
          <PermissionItem
            icon="image"
            title="Quyền truy cập hình ảnh"
            description="Là quyền truy cập vào kho hình ảnh của bạn để lấy các thông tin hình ảnh phòng trọ"
            status="Đã từ chối"
            statusColor={Colors.error}
            statusIcon="close"
          />
          <PermissionItem
            icon="map"
            title="Quyền truy cập vị trí"
            description="Là quyền truy cập vị trí hiện tại của bạn. Điều này giúp việc nhập địa chỉ nhà cho thuê của bạn dễ dàng hơn"
            status="Đã từ chối quyền hoặc chưa xin quyền"
            statusColor={Colors.error}
            statusIcon="close"
          />
          <PermissionItem
            icon="bluetooth"
            title="Quyền truy cập Bluetooth"
            description="Là quyền truy cập Bluetooth để giúp cho ứng dụng tìm thấy máy in sử dụng Bluetooth của bạn"
            status="Đã từ chối quyền hoặc chưa xin quyền"
            statusColor={Colors.error}
            statusIcon="close"
          />
          <PermissionItem
            icon="notifications"
            title="Quyền nhận thông báo"
            description="Là quyền cho phép ứng dụng nhận thông báo"
            status="Đã từ chối"
            statusColor={Colors.success} 
            statusIcon="checkmark"
          />
          <PermissionItem
            icon="wifi"
            title="Quyền truy cập mạng"
            description="Là quyền truy cập mạng Internet để ứng dụng có thể kết nối với máy chủ"
            status="Đã có quyền"
            statusColor={Colors.success}
            statusIcon="checkmark"
          />
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
  scrollView: {
    flex: 1,
  },
  topSection: {
    backgroundColor: Colors.white,
    padding: Spacing.base,
    paddingTop: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  alertText: {
    fontSize: 13,
    color: '#E65100',
    marginBottom: Spacing.md,
  },
  btnViewAll: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.success,
    paddingVertical: 14,
    borderRadius: BorderRadius.md,
  },
  btnViewAllText: {
    fontSize: FontSizes.md,
    fontWeight: 'bold',
    color: Colors.white,
  },
  listContainer: {
    backgroundColor: Colors.white,
    marginTop: Spacing.sm,
  },
  permissionItem: {
    flexDirection: 'row',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  permissionInfo: {
    flex: 1,
  },
  permissionTitle: {
    fontSize: FontSizes.md,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  permissionDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 8,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 13,
    fontWeight: '500',
  },
});
