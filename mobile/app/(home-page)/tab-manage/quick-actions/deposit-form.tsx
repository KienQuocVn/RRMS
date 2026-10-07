import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { RefreshableScrollView as ScrollView } from "@/components/ui/refreshable-scroll-view";
import {
  Colors,
  Spacing,
  FontSizes,
  FontWeights,
  BorderRadius,
  Shadows,
} from "@/constants/theme";
import { reservationService } from "@/services/api/reservation.service";
import { RoomReservation } from "@/types/deposit.types";
import { CalendarDateField, CalendarDatePickerModal } from "@/components/ui/calendar-date-picker-modal";

export default function DepositFormScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{
    roomId: string;
    roomName: string;
    roomPrice: string;
    roomDeposit: string;
    reservationId?: string;
    reservationData?: string;
  }>();

  const roomId = params.roomId || "";
  const roomName = params.roomName || "Phòng";
  const roomPriceNum = Number(params.roomPrice || 0);
  const roomDepositNum = Number(params.roomDeposit || 0);

  // Kiểm tra xem phòng đã có cọc chưa
  const existingReservation: RoomReservation | null = params.reservationData
    ? JSON.parse(params.reservationData)
    : null;
  const isDeposited = !!existingReservation || !!params.reservationId;

  // Helper: Chuyển chuỗi DD/MM/YYYY hoặc ISO sang DD/MM/YYYY để hiển thị UI
  const toDisplayDate = (d?: string | null): string => {
    if (!d) {
      const today = new Date();
      const dd = String(today.getDate()).padStart(2, "0");
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      return `${dd}/${mm}/${today.getFullYear()}`;
    }
    if (d.includes("/")) return d; // Đã là DD/MM/YYYY
    // Nếu là YYYY-MM-DD hoặc ISO string
    const parts = d.split("T")[0].split("-");
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return d;
  };

  // Helper: Chuyển chuỗi DD/MM/YYYY sang YYYY-MM-DD để gửi lên Backend
  const toBackendDate = (d: string): string => {
    if (!d) return new Date().toISOString().split("T")[0];
    const trimmed = d.trim();
    if (trimmed.includes("/")) {
      const parts = trimmed.split("/");
      if (parts.length === 3) {
        const day = parts[0].padStart(2, "0");
        const month = parts[1].padStart(2, "0");
        const year = parts[2];
        return `${year}-${month}-${day}`;
      }
    }
    return trimmed;
  };

  const [createDate, setCreateDate] = useState<string>(
    toDisplayDate(existingReservation?.createDate),
  );
  const [moveInDate, setMoveInDate] = useState<string>(
    toDisplayDate(existingReservation?.moveInDate),
  );
  const [nameTenant, setNameTenant] = useState<string>(
    existingReservation?.nameTenant || "",
  );
  const [phoneTenant, setPhoneTenant] = useState<string>(
    existingReservation?.phoneTenant || "",
  );
  const [depositAmount, setDepositAmount] = useState<string>(
    existingReservation
      ? String(existingReservation.deposit || 0)
      : roomDepositNum > 0
        ? String(roomDepositNum)
        : String(roomPriceNum || 300000),
  );
  const [note, setNote] = useState<string>(existingReservation?.note || "");
  const [paymentMethod, setPaymentMethod] = useState<string>("Tiền mặt");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showExtendDatePicker, setShowExtendDatePicker] = useState(false);

  // Validate form
  const validateForm = (): boolean => {
    if (!nameTenant.trim()) {
      Alert.alert("Lỗi nhập liệu", "Vui lòng nhập họ tên người cọc.");
      return false;
    }

    const phoneTrim = phoneTenant.trim().replace(/[\s.-]/g, "");
    const phoneRegex = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;
    if (!phoneTrim) {
      Alert.alert("Lỗi nhập liệu", "Vui lòng nhập số điện thoại người cọc.");
      return false;
    }
    if (!phoneRegex.test(phoneTrim)) {
      Alert.alert(
        "Lỗi nhập liệu",
        "Số điện thoại không đúng định dạng Việt Nam (VD: 0912345678 hoặc +84912345678).",
      );
      return false;
    }

    const depNum = Number(depositAmount.replace(/\D/g, ""));
    if (!depNum || depNum <= 0) {
      Alert.alert(
        "Lỗi nhập liệu",
        "Vui lòng nhập số tiền cọc hợp lệ lớn hơn 0.",
      );
      return false;
    }

    return true;
  };

  // 1. Thêm cọc giữ chỗ (Tạo mới)
  const handleCreateDeposit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const depNum = Number(depositAmount.replace(/\D/g, ""));
      const payload = {
        createDate: toBackendDate(createDate),
        moveInDate: toBackendDate(moveInDate),
        nameTenant: nameTenant.trim(),
        phoneTenant: phoneTenant.trim(),
        deposit: depNum,
        note: note.trim(),
        status: "ACTIVE",
        roomId: roomId,
      };

      const res = await reservationService.createReservation(payload);
      if (res && (res.code === 200 || res.code === 201 || res.result)) {
        Alert.alert(
          "Thành công",
          "Đặt cọc giữ chỗ thành công cho " + roomName,
          [{ text: "OK", onPress: () => router.back() }],
        );
      } else {
        Alert.alert("Thất bại", res?.message || "Không thể tạo cọc giữ chỗ.");
      }
    } catch (error: any) {
      console.error("Error creating deposit:", error);
      Alert.alert(
        "Thất bại",
        error?.response?.data?.message ||
          "Đã có lỗi xảy ra khi tạo cọc giữ chỗ.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper: Tìm reservationId của phòng
  const resolveReservationId = async (): Promise<string | null> => {
    if (existingReservation?.id) return existingReservation.id;
    if (existingReservation?.roomReservationId)
      return existingReservation.roomReservationId;
    if (params.reservationId) return params.reservationId;

    // Fallback: Query lại API theo roomId
    try {
      const res = await reservationService.getReservationsByRoom(roomId);
      const list = res.result || [];
      if (list.length > 0) {
        return list[0].roomReservationId || list[0].id || null;
      }
    } catch (e) {
      console.warn("Cannot resolve reservation ID from API:", e);
    }
    return null;
  };

  // 2. Logic BỎ CỌC (Xóa reservation)
  const handleCancelDeposit = async () => {
    setIsSubmitting(true);
    const resId = await resolveReservationId();
    setIsSubmitting(false);

    if (!resId) {
      Alert.alert("Lỗi", "Không tìm thấy mã cọc giữ chỗ của phòng này.");
      return;
    }

    Alert.alert(
      "Xác nhận bỏ cọc",
      `Bạn có chắc chắn muốn bỏ cọc cho phòng "${roomName}" không?\n\nSau khi bỏ cọc, phòng sẽ trở về trạng thái "Đang trống".`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Bỏ cọc",
          style: "destructive",
          onPress: async () => {
            setIsSubmitting(true);
            try {
              await reservationService.deleteReservation(resId);
              Alert.alert(
                "Thành công",
                `Đã bỏ cọc phòng ${roomName} thành công.`,
                [{ text: "OK", onPress: () => router.back() }],
              );
            } catch (error: any) {
              console.error("Error deleting deposit:", error);
              Alert.alert(
                "Thất bại",
                error?.response?.data?.message || "Không thể thực hiện bỏ cọc.",
              );
            } finally {
              setIsSubmitting(false);
            }
          },
        },
      ],
    );
  };

  const updateReservationDate = async (
    resId: string,
    targetMoveInDate: string,
  ) => {
    setIsSubmitting(true);
    try {
      const depNum = Number(depositAmount.replace(/\D/g, ""));
      const payload = {
        createDate: toBackendDate(createDate),
        moveInDate: toBackendDate(targetMoveInDate),
        nameTenant: nameTenant.trim(),
        phoneTenant: phoneTenant.trim(),
        deposit: depNum,
        note: note.trim(),
        status: existingReservation?.status || "ACTIVE",
        roomId: roomId,
      };

      const res = await reservationService.updateReservation(resId, payload);
      if (res && (res.code === 200 || res.result)) {
        setMoveInDate(toDisplayDate(targetMoveInDate));
        Alert.alert(
          "Thành công",
          `Đã gia hạn ngày vào ở phòng ${roomName} đến ngày ${toDisplayDate(targetMoveInDate)}.`,
          [{ text: "OK", onPress: () => router.back() }],
        );
      } else {
        Alert.alert(
          "Thất bại",
          res?.message || "Không thể cập nhật ngày vào ở.",
        );
      }
    } catch (error: any) {
      console.error("Error updating deposit date:", error);
      Alert.alert(
        "Thất bại",
        error?.response?.data?.message || "Không thể gia hạn ngày vào ở.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmPickedDate = async (date: string) => {
    setShowExtendDatePicker(false);
    setIsSubmitting(true);
    const resId = await resolveReservationId();
    if (!resId) {
      setIsSubmitting(false);
      Alert.alert("Lỗi", "Không tìm thấy mã cọc giữ chỗ của phòng này.");
      return;
    }
    await updateReservationDate(resId, date);
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop:
              Platform.OS === "ios" ? insets.top : insets.top + Spacing.sm,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isDeposited ? "Thông tin cọc giữ chỗ" : "Đặt cọc giữ chỗ"}
        </Text>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* SECTION 1: Thông tin cơ bản */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionIconBox}>
            <Ionicons name="grid-outline" size={18} color={Colors.white} />
          </View>
          <View>
            <Text style={styles.sectionTitle}>Thông tin cơ bản</Text>
            <Text style={styles.sectionSubtitle}>
              Ngày cọc, ngày vào ở, thông tin khách cọc
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          {/* Row Ngày cọc & Ngày dự kiến */}
          <View style={styles.row}>
            <View style={[styles.flex1, styles.inputBox]}>
              <Text style={styles.inputLabel}>
                Ngày cọc giữ chỗ <Text style={styles.required}>*</Text>
              </Text>
              <CalendarDateField value={createDate} onChange={setCreateDate} title="Ngày cọc giữ chỗ" disabled={isDeposited} containerStyle={styles.inputWithIcon} textStyle={styles.textInput} />
            </View>

            <View style={[styles.flex1, styles.inputBox]}>
              <Text style={styles.inputLabel}>
                Ngày dự kiến vào ở <Text style={styles.required}>*</Text>
              </Text>
              <CalendarDateField value={moveInDate} onChange={setMoveInDate} title="Ngày dự kiến vào ở" containerStyle={styles.inputWithIcon} textStyle={styles.textInput} />
            </View>
          </View>

          {/* Banner Nhập từ QR */}
          {!isDeposited && (
            <TouchableOpacity style={styles.qrBanner} activeOpacity={0.7}>
              <View style={styles.qrBadge}>
                <Ionicons name="flash" size={12} color="#E65100" />
                <Text style={styles.qrBadgeText}>Nhanh+</Text>
              </View>
              <View style={styles.qrContentRow}>
                <View style={styles.qrIconBox}>
                  <Ionicons
                    name="qr-code-outline"
                    size={20}
                    color={Colors.success}
                  />
                </View>
                <View style={styles.flex1}>
                  <Text style={styles.qrTitle}>Nhập từ QR</Text>
                  <Text style={styles.qrSubtitle}>
                    Quét CCCD để nhập nhanh tên người cọc
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={Colors.gray400}
                />
              </View>
            </TouchableOpacity>
          )}

          {/* Row Tên người cọc & Số điện thoại */}
          <View style={styles.row}>
            <View style={[styles.flex1, styles.inputBox]}>
              <Text style={styles.inputLabel}>
                Tên người cọc <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.textInput, styles.inputBordered]}
                value={nameTenant}
                onChangeText={setNameTenant}
                placeholder="Nhập tên người cọc"
                placeholderTextColor={Colors.placeholder}
                editable={!isDeposited}
              />
            </View>

            <View style={[styles.flex1, styles.inputBox]}>
              <Text style={styles.inputLabel}>
                Số điện thoại <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.textInput, styles.inputBordered]}
                value={phoneTenant}
                onChangeText={setPhoneTenant}
                placeholder="Số điện thoại"
                placeholderTextColor={Colors.placeholder}
                keyboardType="phone-pad"
                editable={!isDeposited}
              />
            </View>
          </View>
        </View>

        {/* SECTION 2: Thông tin giá cọc */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionIconBox}>
            <Ionicons name="grid-outline" size={18} color={Colors.white} />
          </View>
          <View>
            <Text style={styles.sectionTitle}>Thông tin giá cọc</Text>
            <Text style={styles.sectionSubtitle}>
              Số tiền cọc, số tiền này sẽ chuyển thành cọc chính thức khi thêm
              hợp đồng
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          {/* Số tiền cọc giữ chỗ */}
          <View style={styles.inputBox}>
            <Text style={styles.inputLabel}>
              Số tiền cọc giữ chỗ <Text style={styles.required}>*</Text>
            </Text>
            <View style={[styles.inputWithIcon, styles.inputBordered]}>
              <TextInput
                style={[
                  styles.textInput,
                  { fontSize: FontSizes.base, fontWeight: FontWeights.bold },
                ]}
                value={depositAmount}
                onChangeText={setDepositAmount}
                placeholder="0"
                keyboardType="numeric"
                editable={!isDeposited}
              />
              <Text style={styles.currencyUnit}>đ</Text>
            </View>
          </View>

          {/* Giá thuê hiện tại */}
          <View style={styles.currentPriceBox}>
            <Text style={styles.currentPriceLabel}>Giá thuê hiện tại</Text>
            <Text style={styles.currentPriceValue}>
              {roomPriceNum.toLocaleString("vi-VN")} đ
            </Text>
          </View>

          {/* Phương thức thanh toán */}
          <View style={styles.paymentMethodBox}>
            <View style={styles.paymentMethodIconBox}>
              <Ionicons name="people" size={18} color={Colors.gray700} />
            </View>
            <View style={styles.flex1}>
              <Text style={styles.paymentMethodLabel}>P.thức thanh toán</Text>
              <Text style={styles.paymentMethodValue}>{paymentMethod}</Text>
            </View>
            {!isDeposited && (
              <Ionicons name="close-circle" size={18} color={Colors.gray400} />
            )}
          </View>
        </View>

        {/* SECTION 3: Hình ảnh, file chứng từ */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionIconBox}>
            <Ionicons name="grid-outline" size={18} color={Colors.white} />
          </View>
          <View>
            <Text style={styles.sectionTitle}>Hình ảnh, file chứng từ</Text>
            <Text style={styles.sectionSubtitle}>
              Chứng từ liên quan đến cọc giữ chỗ
            </Text>
          </View>
        </View>

        <View style={[styles.card, styles.uploadCard]}>
          <View style={styles.uploadIconWrap}>
            <Ionicons
              name="cloud-upload-outline"
              size={32}
              color={Colors.success}
            />
          </View>
          <Text style={styles.uploadLimitText}>
            Tối đa thêm được 2 hình ảnh
          </Text>
          <View style={styles.uploadBtnRow}>
            <TouchableOpacity
              style={styles.uploadOptionBtn}
              activeOpacity={0.7}
            >
              <Ionicons
                name="camera-outline"
                size={18}
                color={Colors.textPrimary}
              />
              <Text style={styles.uploadOptionText}>Chụp ảnh</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.uploadOptionBtn}
              activeOpacity={0.7}
            >
              <Ionicons
                name="add-circle-outline"
                size={18}
                color={Colors.textPrimary}
              />
              <Text style={styles.uploadOptionText}>Thêm từ thư viện</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* SECTION 4: Ghi chú thêm */}
        <View style={styles.noteSection}>
          <Text style={styles.noteTitle}>Ghi chú thêm</Text>
          <Text style={styles.noteSubtitle}>Thêm công việc nếu cần thiết</Text>
          <TextInput
            style={styles.noteInput}
            value={note}
            onChangeText={setNote}
            placeholder="Ghi chú thêm"
            placeholderTextColor={Colors.placeholder}
            multiline
            numberOfLines={3}
            editable={!isDeposited}
          />
        </View>
      </ScrollView>

      {/* FOOTER ACTIONS */}
      <View
        style={[
          styles.footer,
          { paddingBottom: Math.max(insets.bottom, Spacing.base) },
        ]}
      >
        {!isDeposited ? (
          // Trường hợp phòng CHƯA CỌC: Nút Đóng + Nút Thêm cọc giữ chỗ
          <View style={styles.footerRow}>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => router.back()}
              disabled={isSubmitting}
            >
              <Text style={styles.closeBtnText}>Đóng</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.submitBtn, isSubmitting && styles.btnDisabled]}
              onPress={handleCreateDeposit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <>
                  <Ionicons name="add" size={18} color={Colors.white} />
                  <Text style={styles.submitBtnText}>Thêm cọc giữ chỗ</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          // Trường hợp phòng ĐÃ CỌC: Nút Bỏ cọc + Nút Gia hạn ngày vào
          <View style={styles.footerRow}>
            <TouchableOpacity
              style={[
                styles.cancelDepositBtn,
                isSubmitting && styles.btnDisabled,
              ]}
              onPress={handleCancelDeposit}
              disabled={isSubmitting}
            >
              <Ionicons name="close" size={18} color={Colors.white} />
              <Text style={styles.cancelDepositBtnText}>Bỏ cọc</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.extendBtn, isSubmitting && styles.btnDisabled]}
              onPress={() => setShowExtendDatePicker(true)}
              disabled={isSubmitting}
            >
              <Ionicons name="add" size={18} color={Colors.white} />
              <Text style={styles.extendBtnText}>Gia hạn ngày vào</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      {showExtendDatePicker && (
        <CalendarDatePickerModal
          visible
          value={moveInDate}
          title="Gia hạn ngày vào ở"
          subtitle="Chọn ngày dự kiến mới để cập nhật lịch vào ở của khách."
          onCancel={() => setShowExtendDatePicker(false)}
          onConfirm={handleConfirmPickedDate}
        />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
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
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: Colors.gray300,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  headerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.base,
    paddingBottom: Spacing["3xl"],
  },

  // Section Header
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  sectionIconBox: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: "#2b7ed7",
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  sectionSubtitle: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    maxWidth: "90%",
  },

  // Card
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  row: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  flex1: {
    flex: 1,
  },

  // Inputs
  inputBox: {
    marginBottom: Spacing.sm,
  },
  inputLabel: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  required: {
    color: Colors.error,
  },
  inputWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.gray50,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Platform.OS === "ios" ? 10 : 6,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  inputBordered: {
    borderWidth: 1,
    borderColor: Colors.gray200,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.md,
    paddingVertical: Platform.OS === "ios" ? 10 : 6,
  },
  textInput: {
    flex: 1,
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
  },
  currencyUnit: {
    fontSize: FontSizes.base,
    color: Colors.textSecondary,
    marginLeft: 4,
  },

  // QR Banner
  qrBanner: {
    backgroundColor: "#20a9e722",
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: "#20a9e722",
  },
  qrBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#FFE0B2",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 6,
  },
  qrBadgeText: {
    fontSize: 10,
    fontWeight: FontWeights.bold,
    color: "#E65100",
    marginLeft: 2,
  },
  qrContentRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  qrIconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.sm,
  },
  qrTitle: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  qrSubtitle: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
  },

  // Current Price Box
  currentPriceBox: {
    backgroundColor: "#20a9e722",
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginTop: Spacing.xs,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: "#20a9e722",
  },
  currentPriceLabel: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    textAlign: "right",
  },
  currentPriceValue: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    textAlign: "right",
  },

  // Payment Method Box
  paymentMethodBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.gray50,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  paymentMethodIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.sm,
  },
  paymentMethodLabel: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
  },
  paymentMethodValue: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },

  // Upload Box
  uploadCard: {
    alignItems: "center",
    paddingVertical: Spacing.xl,
  },
  uploadIconWrap: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#20a9e722",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },
  uploadLimitText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  uploadBtnRow: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  uploadOptionBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.gray300,
    gap: 6,
  },
  uploadOptionText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: Colors.textPrimary,
  },

  // Note Section
  noteSection: {
    marginBottom: Spacing.xl,
  },
  noteTitle: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  noteSubtitle: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  noteInput: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.gray200,
    padding: Spacing.md,
    fontSize: FontSizes.sm,
    textAlignVertical: "top",
    minHeight: 80,
  },

  // Footer Actions
  footer: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
    ...Shadows.md,
  },
  footerRow: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  closeBtn: {
    flex: 1,
    backgroundColor: "#E0E0E0",
    borderRadius: BorderRadius.md,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  closeBtnText: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  submitBtn: {
    flex: 1.5,
    backgroundColor: "#2b7ed7",
    borderRadius: BorderRadius.md,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  submitBtnText: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Colors.white,
  },
  cancelDepositBtn: {
    flex: 1,
    backgroundColor: "#E65100",
    borderRadius: BorderRadius.md,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  cancelDepositBtnText: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Colors.white,
  },
  extendBtn: {
    flex: 1.5,
    backgroundColor: "#2b7ed7",
    borderRadius: BorderRadius.md,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  extendBtnText: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Colors.white,
  },
  btnDisabled: {
    opacity: 0.6,
  },
});
