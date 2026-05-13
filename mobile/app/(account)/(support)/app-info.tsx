import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Colors, FontSizes, FontWeights, Spacing } from "@/constants/theme";

export default function AppInfoScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const Header = () => (
    <View
      style={[
        styles.header,
        {
          paddingTop:
            Platform.OS === "ios" ? insets.top : insets.top + Spacing.sm,
        },
      ]}
    >
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
      </TouchableOpacity>
      <View style={styles.headerTitleWrap}>
        <Text style={styles.headerTitle}>Thêm</Text>
        <Text style={styles.headerSub}>Thông tin phần mềm</Text>
      </View>
    </View>
  );

  const InfoItem = ({ icon, label, value }: any) => (
    <View style={styles.infoItem}>
      <Ionicons
        name={icon}
        size={24}
        color={Colors.textPrimary}
        style={styles.infoIcon}
      />
      <Text style={styles.infoText}>
        <Text style={{ fontWeight: "bold" }}>{label}: </Text>
        {value}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView style={styles.scrollView}>
        {/* Top Banner */}
        <View style={styles.banner}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoTextMain}>
              <Text style={{ color: "#4CAF50" }}>// </Text>RRMS
            </Text>
            <Text style={styles.logoTextSub}>
              Quản lý{" "}
              <Text style={{ color: "#4CAF50", fontWeight: "bold" }}>
                NHÀ CHO THUÊ
              </Text>
            </Text>
          </View>
          <Text style={styles.versionText}>Version (3.0.6)</Text>
        </View>

        {/* Info List */}
        <View style={styles.listContainer}>
          <InfoItem icon="call" label="Zalo - Hotline" value="0965 227 453" />
          <InfoItem icon="mail" label="Email" value="RRMS.com@gmail.com" />
          <InfoItem icon="globe" label="Website" value="https://rrms.me" />
          <InfoItem
            icon="time"
            label="Giờ làm việc"
            value="Từ 8h – 18h từ Thứ 2 đến Thứ 6 và Sáng Thứ 7"
          />
          <InfoItem
            icon="business"
            label="Văn phòng"
            value="703 - Chung cư 3, Đường Man Thiện, P.Tân Phú, Tp.Hồ Chí Minh"
          />
        </View>

        {/* Bottom Description */}
        <View style={styles.descriptionBox}>
          <Text style={styles.descriptionText}>
            <Text style={{ fontWeight: "bold", fontSize: 16 }}>RRMS</Text> là
            nền tảng công nghệ cung cấp các giải pháp, phần mềm quản lý bất động
            sản cho thuê như: nhà trọ, chung cư mini, chuỗi căn hộ, quản lý ký
            túc xá, sleepbox, homestay hay các mô hình cho thuê. Ngoài ra RRMS
            kết nối giữa bên đi thuê và bên cho thuê giúp tiết kiệm thời gian.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
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
    justifyContent: "center",
    alignItems: "center",
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
    backgroundColor: Colors.white,
  },
  banner: {
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    paddingVertical: Spacing["3xl"],
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  logoTextMain: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.textPrimary,
    letterSpacing: 2,
    marginBottom: 4,
  },
  logoTextSub: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  versionText: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
  listContainer: {
    backgroundColor: Colors.white,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  infoIcon: {
    marginRight: Spacing.md,
    width: 24,
    textAlign: "center",
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  descriptionBox: {
    backgroundColor: "#F5F5F5",
    padding: Spacing.xl,
    minHeight: 200,
  },
  descriptionText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
});
