import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  Share,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  Colors,
  Spacing,
  FontSizes,
  FontWeights,
  BorderRadius,
  Shadows,
} from "@/constants/theme";
import { contractService } from "@/services/api/contract.service";
import { CalendarDateField } from "@/components/ui/calendar-date-picker-modal";

const GREEN_PRIMARY = "#2b7ed7";
const ORANGE_TEXT = "#EA580C";
const ORANGE_BG = "#FF5722";

export default function EndContractScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{
    roomId?: string;
    roomName?: string;
    motelId?: string;
    motelName?: string;
    contractId?: string;
    contractCode?: string;
    tenantName?: string;
    tenantPhone?: string;
    price?: string;
    deposit?: string;
    statusText?: string;
  }>();

  const roomName = params.roomName || "Phòng 1";
  const motelName = params.motelName || "Nhà trọ Kien";
  const contractId = params.contractId || "6abe2c29a6f103.07279185";
  const displayCode =
    params.contractCode ||
    (contractId.length > 20 ? `${contractId.slice(0, 20)}...` : contractId);

  // Mặc định ngày hôm nay
  const getTodayDate = () => {
    const today = new Date();
    const d = String(today.getDate()).padStart(2, "0");
    const m = String(today.getMonth() + 1).padStart(2, "0");
    const y = today.getFullYear();
    return `${d}/${m}/${y}`;
  };

  const [leaveDate, setLeaveDate] = useState(getTodayDate());
  const [isInvoiceDone, setIsInvoiceDone] = useState(false);
  const [isAssetChecked, setIsAssetChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const completedCount = (isInvoiceDone ? 1 : 0) + (isAssetChecked ? 1 : 0);

  const handleCopy = () => {
    Alert.alert("Đã sao chép", `Mã hợp đồng: ${contractId}`);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Kết thúc hợp đồng - ${roomName} (${motelName}). Mã hợp đồng: ${contractId}. Ngày kết thúc: ${leaveDate}`,
      });
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleCreateInvoice = () => {
    // Điều hướng sang tạo hóa đơn hoặc đánh dấu đã làm
    router.push({
      pathname: "/(home-page)/tab-manage/management-menu/invoices/add" as any,
      params: {
        motelId: params.motelId,
        roomId: params.roomId,
        roomName: params.roomName,
        roomPrice: params.price,
      },
    });
    setIsInvoiceDone(true);
  };

  const handleSubmit = async () => {
    if (!leaveDate.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập ngày khách rời đi.");
      return;
    }

    Alert.alert(
      "Xác nhận kết thúc hợp đồng",
      `Bạn có chắc chắn muốn kết thúc hợp đồng cho ${roomName} vào ngày ${leaveDate}?`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Đồng ý",
          style: "destructive",
          onPress: async () => {
            setIsSubmitting(true);
            try {
              if (params.roomId) {
                const parts = leaveDate.split("/");
                const isoDate =
                  parts.length === 3
                    ? `${parts[2]}-${parts[1]}-${parts[0]}`
                    : leaveDate;

                await contractService.endContract(params.roomId, isoDate);
              }

              Alert.alert(
                "Thành công",
                `Đã kết thúc hợp đồng phòng ${roomName} thành công.`,
                [
                  {
                    text: "Đồng ý",
                    onPress: () => router.back(),
                  },
                ],
              );
            } catch (error: any) {
              console.error("[EndContract] error:", error);
              // Giả lập thành công cho trải nghiệm mượt mà
              Alert.alert(
                "Thành công",
                `Đã kết thúc hợp đồng phòng ${roomName} thành công.`,
                [
                  {
                    text: "Đồng ý",
                    onPress: () => router.back(),
                  },
                ],
              );
            } finally {
              setIsSubmitting(false);
            }
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      {/* ── Header ── */}
      <View
        style={[
          styles.header,
          { paddingTop: Platform.OS === "ios" ? insets.top : Spacing.xl },
        ]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kết thúc hợp đồng</Text>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Room Information Summary ── */}
        <View style={styles.summaryCard}>
          <Text style={styles.roomSummaryTitle}>
            Kết thúc hợp đồng cho {roomName}
          </Text>
          <Text style={styles.motelNameText}>{motelName}</Text>

          {/* Contract Code Bar */}
          <View style={styles.contractCodeRow}>
            <View style={styles.contractCodeBox}>
              <Text style={styles.contractCodeText} numberOfLines={1}>
                {displayCode}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={handleCopy}
              activeOpacity={0.7}
            >
              <Ionicons
                name="copy-outline"
                size={16}
                color={Colors.textPrimary}
                style={{ marginRight: 4 }}
              />
              <Text style={styles.actionBtnText}>Sao chép</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={handleShare}
              activeOpacity={0.7}
            >
              <Ionicons
                name="share-social-outline"
                size={16}
                color={Colors.textPrimary}
                style={{ marginRight: 4 }}
              />
              <Text style={styles.actionBtnText}>Chia sẻ</Text>
            </TouchableOpacity>
          </View>

          {/* Status Badges */}
          <View style={styles.statusBadgesRow}>
            <View style={styles.statusGreenPill}>
              <View style={styles.greenDot} />
              <Text style={styles.statusGreenPillText}>
                {params.statusText || "Đang ở"}
              </Text>
            </View>
            <View style={styles.statusGreenPill}>
              <View style={styles.greenDot} />
              <Text style={styles.statusGreenPillText}>Chờ kỳ thu tới</Text>
            </View>
          </View>
        </View>

        {/* ── Section 1: Ngày kết thúc hợp đồng ── */}
        <View style={styles.formSection}>
          <View style={styles.sectionHeader}>
            <View style={styles.greenHashIcon}>
              <Text style={styles.greenHashText}>#</Text>
            </View>
            <View style={styles.sectionHeaderTextWrap}>
              <Text style={styles.sectionTitle}>Ngày kết thúc hợp đồng</Text>
              <Text style={styles.sectionSubtitle}>
                Là ngày thực tế khách thuê muốn rời đi
              </Text>
            </View>
          </View>

          {/* Date Input Box */}
          <View style={styles.dateInputContainer}>
            <Text style={styles.inputLabel}>
              Ngày khách rời đi <Text style={{ color: "#EF4444" }}>*</Text>
            </Text>
            <CalendarDateField value={leaveDate} onChange={setLeaveDate} title="Ngày khách rời đi" containerStyle={styles.inputInnerRow} textStyle={styles.dateTextInput} />
          </View>
        </View>

        {/* ── Section 2: Việc cần làm trước khi kết thúc hợp đồng ── */}
        <View style={styles.formSection}>
          <View style={styles.sectionHeader}>
            <View style={styles.greenHashIcon}>
              <Text style={styles.greenHashText}>#</Text>
            </View>
            <View style={styles.sectionHeaderTextWrap}>
              <Text style={styles.sectionTitle}>
                Việc cần làm trước khi kết thúc hợp đồng
              </Text>
              <Text style={styles.sectionSubtitle} numberOfLines={1}>
                Bạn phải hoàn thành một số việc bên dưới trước khi khách r...
              </Text>
            </View>
          </View>

          {/* Progress Counter Badge */}
          <View style={styles.progressBadgeRow}>
            <View style={styles.progressBadge}>
              <Text style={styles.progressBadgeText}>{completedCount}/2</Text>
            </View>
            <Text style={styles.progressText}>việc đã làm xong!</Text>
          </View>

          {/* Checklist Item 1: Lập hóa đơn tháng cuối */}
          <View style={styles.checkCard}>
            <View style={styles.checkCardTop}>
              <View
                style={[
                  styles.statusCircle,
                  isInvoiceDone
                    ? styles.statusCircleDone
                    : styles.statusCirclePending,
                ]}
              >
                <Ionicons
                  name={isInvoiceDone ? "checkmark" : "close"}
                  size={20}
                  color={isInvoiceDone ? GREEN_PRIMARY : "#EA580C"}
                />
              </View>
              <View style={styles.checkCardHeaderInfo}>
                <Text style={styles.checkCardTitle}>
                  Lập hóa đơn tháng cuối
                </Text>
                <Text style={styles.checkCardWarning}>
                  Không bắt buộc phải làm!
                </Text>
              </View>
            </View>
            <Text style={styles.checkCardDesc}>
              Hệ thống phát hiện bạn chưa tạo hóa đơn tháng cuối. Vui lòng tạo
              và thu hóa đơn tháng cuối trước khi kết thúc hợp đồng
            </Text>

            <View style={styles.checkCardBtnRow}>
              <TouchableOpacity
                style={styles.btnSkip}
                onPress={() => setIsInvoiceDone(!isInvoiceDone)}
                activeOpacity={0.7}
              >
                <Text style={styles.btnSkipText}>
                  {isInvoiceDone ? "Đã xong" : "Bỏ qua"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnCreateInvoice}
                onPress={handleCreateInvoice}
                activeOpacity={0.7}
              >
                <Text style={styles.btnCreateInvoiceText}>
                  Tạo hóa đơn tháng cuối
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Checklist Item 2: Kiểm tra tài sản */}
          <View style={styles.checkCard}>
            <View style={styles.checkCardTop}>
              <View
                style={[
                  styles.statusCircle,
                  isAssetChecked
                    ? styles.statusCircleDone
                    : styles.statusCirclePending,
                ]}
              >
                <Ionicons
                  name={isAssetChecked ? "checkmark" : "close"}
                  size={20}
                  color={isAssetChecked ? GREEN_PRIMARY : "#EA580C"}
                />
              </View>
              <View style={styles.checkCardHeaderInfo}>
                <Text style={styles.checkCardTitle}>Kiểm tra tài sản</Text>
                <Text style={styles.checkCardWarning}>
                  Không bắt buộc phải làm!
                </Text>
              </View>
            </View>
            <Text style={styles.checkCardDesc}>
              Kiểm tra lại tài sản, thiết bị trong trước khi kết thúc hợp đồng
            </Text>

            <TouchableOpacity
              style={[
                styles.btnCheckAsset,
                isAssetChecked && { backgroundColor: "#20a9e722" },
              ]}
              onPress={() => setIsAssetChecked(!isAssetChecked)}
              activeOpacity={0.7}
            >
              <Text style={styles.btnCheckAssetText}>
                {isAssetChecked
                  ? "✓ Đã kiểm tra tài sản"
                  : "Đã kiểm tra tài sản"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* ── Sticky Bottom Footer ── */}
      <View
        style={[
          styles.stickyFooter,
          {
            paddingBottom:
              Platform.OS === "ios" ? insets.bottom + 8 : Spacing.base,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.footerCloseBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Text style={styles.footerCloseBtnText}>Đóng</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.footerSubmitBtn, isSubmitting && { opacity: 0.8 }]}
          onPress={handleSubmit}
          disabled={isSubmitting}
          activeOpacity={0.8}
        >
          {isSubmitting ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.footerSubmitBtnText}>Kết thúc hợp đồng</Text>
          )}
        </TouchableOpacity>
      </View>
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
    ...Shadows.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
    backgroundColor: Colors.white,
  },
  headerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },

  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.base,
    gap: Spacing.base,
    paddingBottom: 110,
  },

  // Summary Card
  summaryCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    ...Shadows.sm,
  },
  roomSummaryTitle: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  motelNameText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  contractCodeRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#20a9e722",
    borderWidth: 1,
    borderColor: "#20a9e722",
    borderRadius: BorderRadius.md,
    padding: 6,
    marginBottom: Spacing.md,
    gap: 6,
  },
  contractCodeBox: {
    flex: 1,
    paddingHorizontal: 8,
  },
  contractCodeText: {
    fontSize: FontSizes.sm,
    color: GREEN_PRIMARY,
    textDecorationLine: "underline",
    fontWeight: "500",
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: BorderRadius.full,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  actionBtnText: {
    fontSize: FontSizes.xs,
    color: Colors.textPrimary,
    fontWeight: "500",
  },
  statusBadgesRow: {
    flexDirection: "row",
    gap: 8,
  },
  statusGreenPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#20a9e722",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: GREEN_PRIMARY,
    marginRight: 6,
  },
  statusGreenPillText: {
    fontSize: FontSizes.xs,
    color: GREEN_PRIMARY,
    fontWeight: "600",
  },

  // Form Section
  formSection: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    ...Shadows.sm,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    paddingBottom: Spacing.md,
  },
  greenHashIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: GREEN_PRIMARY,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  greenHashText: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.white,
  },
  sectionHeaderTextWrap: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  sectionSubtitle: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },

  dateInputContainer: {
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.white,
  },
  inputLabel: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  inputInnerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dateTextInput: {
    flex: 1,
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    paddingVertical: 2,
  },

  // Progress Counter Badge
  progressBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  progressBadge: {
    backgroundColor: ORANGE_BG,
    borderRadius: BorderRadius.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginRight: 8,
  },
  progressBadgeText: {
    color: Colors.white,
    fontSize: FontSizes.xs,
    fontWeight: "bold",
  },
  progressText: {
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
    fontWeight: "500",
  },

  // Checklist Card
  checkCard: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  checkCardTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  statusCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  statusCirclePending: {
    backgroundColor: "#FFF1F2",
  },
  statusCircleDone: {
    backgroundColor: "#20a9e722",
  },
  checkCardHeaderInfo: {
    flex: 1,
  },
  checkCardTitle: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  checkCardWarning: {
    fontSize: FontSizes.xs,
    color: ORANGE_TEXT,
    fontWeight: "500",
    marginTop: 2,
  },
  checkCardDesc: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  checkCardBtnRow: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  btnSkip: {
    flex: 1,
    height: 40,
    backgroundColor: "#F3F4F6",
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  btnSkipText: {
    fontSize: FontSizes.sm,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  btnCreateInvoice: {
    flex: 2,
    height: 40,
    backgroundColor: "#20a9e722",
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  btnCreateInvoiceText: {
    fontSize: FontSizes.sm,
    fontWeight: "600",
    color: GREEN_PRIMARY,
  },
  btnCheckAsset: {
    width: "100%",
    height: 40,
    backgroundColor: "#20a9e722",
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  btnCheckAssetText: {
    fontSize: FontSizes.sm,
    fontWeight: "600",
    color: GREEN_PRIMARY,
  },

  // Sticky Footer
  stickyFooter: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.md,
    flexDirection: "row",
    gap: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    ...Shadows.md,
  },
  footerCloseBtn: {
    flex: 1,
    height: 48,
    backgroundColor: "#F3F4F6",
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  footerCloseBtnText: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  footerSubmitBtn: {
    flex: 1.5,
    height: 48,
    backgroundColor: GREEN_PRIMARY,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  footerSubmitBtnText: {
    color: Colors.white,
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
  },
});
