import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Switch, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, FontSizes, FontWeights, Spacing, BorderRadius, Shadows } from '@/constants/theme';

export default function HelpCenterScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [showHelperIcon, setShowHelperIcon] = useState(true);

  const Header = () => (
    <View style={[styles.header, { paddingTop: Platform.OS === 'ios' ? insets.top : insets.top + Spacing.sm }]}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
      </TouchableOpacity>
      <View style={styles.headerTitleWrap}>
        <Text style={styles.headerTitle}>Trung tâm hỗ trợ</Text>
        <Text style={styles.headerSub}>Sử dụng dễ dàng hơn với trung tâm trợ giúp</Text>
      </View>
    </View>
  );

  const VideoItem = ({ title, description }: any) => (
    <View style={styles.videoItem}>
      <View style={styles.videoThumbnail}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=150' }} 
          style={styles.thumbnailImg} 
        />
        <View style={styles.playOverlay}>
          <Ionicons name="play" size={16} color={Colors.white} />
        </View>
      </View>
      <View style={styles.videoInfo}>
        <Text style={styles.videoTitle}>{title}</Text>
        <Text style={styles.videoDesc} numberOfLines={2}>{description}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        
        {/* Banner */}
        <View style={styles.banner}>
          <Ionicons name="headset" size={60} color={Colors.white} style={{ marginBottom: Spacing.md }} />
          <Text style={styles.bannerTitle}>Trung tâm hỗ trợ</Text>
          <View style={styles.bannerSubWrap}>
            <Text style={styles.bannerSub}>Chuyên viên luôn sẵn sàng hỗ trợ bạn 24/7</Text>
          </View>
        </View>

        {/* Options List */}
        <View style={styles.optionsList}>
          <TouchableOpacity style={styles.optionItem}>
            <Ionicons name="help-buoy-outline" size={24} color="#2196F3" style={{ marginRight: Spacing.md }} />
            <Text style={styles.optionText}>Demo - Hướng dẫn phần mềm online</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionItem}>
            <Ionicons name="logo-youtube" size={24} color="#F44336" style={{ marginRight: Spacing.md }} />
            <Text style={styles.optionText}>Video - Hướng dẫn sử dụng</Text>
          </TouchableOpacity>
          <View style={styles.optionItem}>
            <Ionicons name="logo-android" size={24} color="#4CAF50" style={{ marginRight: Spacing.md }} />
            <View style={styles.optionInfo}>
              <Text style={styles.optionTitle}>Tắt - hiển thị icon hỗ trợ</Text>
              <Text style={styles.optionDesc}>Là icon được hiển thị ở các màn hình để giúp bạn hiểu phần mềm</Text>
            </View>
            <Switch
              trackColor={{ false: '#E5E7EB', true: '#8BC34A' }}
              thumbColor={Colors.white}
              ios_backgroundColor="#E5E7EB"
              onValueChange={() => setShowHelperIcon(!showHelperIcon)}
              value={showHelperIcon}
            />
          </View>
        </View>

        {/* Video List */}
        <View style={styles.videoSection}>
          <Text style={styles.sectionTitle}>Danh sách hướng dẫn</Text>
          <Text style={styles.sectionSub}>Xem danh sách video hướng dẫn để làm quen phần mềm</Text>

          <View style={styles.videoList}>
            <VideoItem 
              title="Tạo và thao tác với nhà cho thuê"
              description="Tạo nhà trọ, chỉnh sửa, xóa hoặc quản lý nhà trọ cho thuê của bạn"
            />
            <VideoItem 
              title="Quản lý phòng cho thuê"
              description="Quản lý thông tin phòng cho thuê. Xem thông tin chi tiết chỉnh sửa thông tin."
            />
            <VideoItem 
              title="Thiết lập dịch vụ điện, nước khách sửa dụng."
              description="Cấu hình các dịch trong nhà cho thuê của bạn giá, đơn vị..."
            />
            <VideoItem 
              title="Cọc giữ chỗ khi khách thuê muốn giữ phòng"
              description="Quản lý tiền cọc giữ chỗ của khách..."
            />
          </View>
        </View>

      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab}>
        <Ionicons name="call" size={24} color={Colors.white} />
      </TouchableOpacity>
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
  scrollContent: {
    padding: Spacing.base,
    paddingBottom: Spacing['4xl'], // Room for FAB
  },
  banner: {
    backgroundColor: '#00BFA5',
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.base,
    overflow: 'hidden',
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 8,
  },
  bannerSubWrap: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 16,
  },
  bannerSub: {
    color: Colors.white,
    fontSize: 13,
  },
  optionsList: {
    backgroundColor: '#E8F5E9',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: '#C8E6C9',
    marginBottom: Spacing.xl,
    overflow: 'hidden',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#C8E6C9',
  },
  optionText: {
    fontSize: FontSizes.md,
    fontWeight: '500',
    color: Colors.textPrimary,
    flex: 1,
  },
  optionInfo: {
    flex: 1,
    paddingRight: Spacing.md,
  },
  optionTitle: {
    fontSize: FontSizes.md,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  optionDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  videoSection: {
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  sectionSub: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  videoList: {
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  videoItem: {
    flexDirection: 'row',
    padding: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  videoThumbnail: {
    width: 100,
    height: 60,
    borderRadius: 8,
    backgroundColor: Colors.gray200,
    marginRight: Spacing.md,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnailImg: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  playOverlay: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  videoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 4,
    lineHeight: 20,
  },
  videoDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.lg,
    elevation: 4,
  },
});
