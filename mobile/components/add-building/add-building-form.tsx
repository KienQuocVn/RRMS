import React, { useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RefreshableScrollView } from "@/components/ui/refreshable-scroll-view";
import {
  BorderRadius,
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
} from "@/constants/theme";
import { RentType } from "@/types/building.types";
import { useAddBuildingFlow } from "@/hooks/use-add-building-flow";

interface AddBuildingFormProps {
  rentType: RentType;
  setRentType: (type: RentType) => void;
  isAutoInit: boolean;
  setIsAutoInit: (val: boolean) => void;
}

type ActiveModal = "rentType" | "floor" | "occupancy" | null;

interface PickerOption {
  value: string;
  title: string;
  description?: string;
}

const RENT_TYPE_OPTIONS: (PickerOption & { value: RentType })[] = [
  { value: "room", title: "Nhà trọ", description: "Cho thuê theo phòng" },
  {
    value: "bed",
    title: "Ký túc xá/sleepbox",
    description: "Cho thuê theo giường",
  },
  {
    value: "mini_apartment",
    title: "Chung cư mini",
    description: "Cho thuê theo căn hộ",
  },
  {
    value: "apartment_building",
    title: "Tòa nhà chung cư",
    description: "Cho thuê hoặc quản lý cư dân theo căn hộ",
  },
  {
    value: "whole_house",
    title: "Nhà nguyên căn",
    description: "Cho thuê theo phòng/nhà",
  },
  {
    value: "office",
    title: "Văn phòng cho thuê",
    description: "Tòa nhà văn phòng, dịch vụ văn phòng",
  },
];

const FLOOR_OPTIONS: PickerOption[] = [
  { value: "ground", title: "Tầng trệt (không có tầng)" },
  { value: "2", title: "2 tầng (Gồm 1 trệt + 1 tầng)" },
  { value: "3", title: "3 tầng (Gồm 1 trệt + 2 tầng)" },
  { value: "4", title: "4 tầng (Gồm 1 trệt + 3 tầng)" },
  { value: "5", title: "5 tầng (Gồm 1 trệt + 4 tầng)" },
  { value: "6", title: "6 tầng (Gồm 1 trệt + 5 tầng)" },
  { value: "7", title: "7 tầng (Gồm 1 trệt + 6 tầng)" },
  { value: "8", title: "8 tầng (Gồm 1 trệt + 7 tầng)" },
];

const OCCUPANCY_OPTIONS: PickerOption[] = [
  { value: "1", title: "1 người/phòng" },
  { value: "2", title: "2 người/phòng" },
  { value: "3", title: "3 người/phòng" },
  { value: "4", title: "4 người/phòng" },
  { value: "5", title: "5 người/phòng" },
  { value: "6", title: "6 người/phòng" },
];

const SectionTitle = ({
  title,
  subTitle,
}: {
  title: string;
  subTitle: string;
}) => (
  <View style={styles.sectionTitleContainer}>
    <View style={styles.hashtagIcon}>
      <Text style={styles.hashtagText}>#</Text>
    </View>
    <View style={styles.sectionTitleWrap}>
      <Text style={styles.sectionTitleMain}>{title}</Text>
      <Text style={styles.sectionTitleSub}>{subTitle}</Text>
    </View>
  </View>
);

function PickerModal({
  visible,
  title,
  icon,
  options,
  selectedValue,
  onSelect,
  onClose,
}: {
  visible: boolean;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  options: PickerOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
  onClose: () => void;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable
          style={styles.modalCard}
          onPress={(event) => event.stopPropagation()}
        >
          <View style={styles.modalHeader}>
            <View style={styles.modalHeaderIcon}>
              <Ionicons name={icon} size={22} color={Colors.textPrimary} />
            </View>
            <Text style={styles.modalHeaderTitle}>{title}</Text>
          </View>

          <View style={styles.modalDivider} />

          <ScrollView
            style={styles.modalList}
            showsVerticalScrollIndicator={false}
          >
            {options.map((option, index) => {
              const isSelected = selectedValue === option.value;

              return (
                <View key={option.value}>
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => {
                      onSelect(option.value);
                      onClose();
                    }}
                    style={styles.modalOption}
                  >
                    <View style={styles.modalOptionText}>
                      <Text style={styles.modalOptionTitle}>
                        {option.title}
                      </Text>
                      {option.description ? (
                        <Text style={styles.modalOptionDescription}>
                          {option.description}
                        </Text>
                      ) : null}
                    </View>

                    {isSelected ? (
                      <View style={styles.modalCheck}>
                        <Ionicons
                          name="checkmark"
                          size={20}
                          color={Colors.white}
                        />
                      </View>
                    ) : null}
                  </TouchableOpacity>

                  {index < options.length - 1 ? (
                    <View style={styles.modalOptionDivider} />
                  ) : null}
                </View>
              );
            })}
          </ScrollView>

          <TouchableOpacity style={styles.modalCloseButton} onPress={onClose}>
            <Text style={styles.modalCloseButtonText}>Đóng</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export const AddBuildingForm = ({
  rentType,
  setRentType,
  isAutoInit,
  setIsAutoInit,
}: AddBuildingFormProps) => {
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});

  const handleTouch = (field: string) => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
  };

  // Đọc/ghi basicInfo từ flow state
  const basicInfo = useAddBuildingFlow((state) => state.basicInfo);
  const setBasicInfo = useAddBuildingFlow((state) => state.setBasicInfo);

  // Destructure để dùng
  const {
    buildingName,
    floorValue,
    sampleRoomCount,
    sampleArea,
    samplePrice,
    maxOccupancy,
    invoiceDay,
    paymentDeadline,
  } = basicInfo;

  // Đồng bộ rentType & isAutoInit với basicInfo
  const handleRentTypeChange = (type: RentType) => {
    setRentType(type);
    setBasicInfo({ rentType: type });
  };

  const handleIsAutoInitChange = (val: boolean) => {
    setIsAutoInit(val);
    setBasicInfo({ isAutoInit: val });
  };

  const handleFieldChange = (field: string, val: string) => {
    setBasicInfo({ [field]: val });
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
  };

  // Validate inline
  const buildingNameError = useMemo(() => {
    if (!touchedFields.buildingName) return null;
    if (buildingName.trim().length === 0) return "Vui lòng nhập tên nhà trọ";
    return null;
  }, [buildingName, touchedFields.buildingName]);

  const sampleRoomCountError = useMemo(() => {
    if (!touchedFields.sampleRoomCount) return null;
    const val = sampleRoomCount.trim();
    if (val.length === 0) return "Vui lòng nhập số lượng phòng mẫu";
    const num = Number(val);
    if (isNaN(num) || !Number.isInteger(num) || num <= 0) return "Số phòng phải là số nguyên dương";
    return null;
  }, [sampleRoomCount, touchedFields.sampleRoomCount]);

  const sampleAreaError = useMemo(() => {
    if (!touchedFields.sampleArea) return null;
    const val = sampleArea.trim();
    if (val.length === 0) return "Vui lòng nhập diện tích mẫu";
    const num = Number(val);
    if (isNaN(num) || num <= 0) return "Diện tích phải là số dương";
    return null;
  }, [sampleArea, touchedFields.sampleArea]);

  const samplePriceError = useMemo(() => {
    if (!touchedFields.samplePrice) return null;
    const val = samplePrice.trim();
    if (val.length === 0) return "Vui lòng nhập giá thuê mẫu";
    const num = Number(val);
    if (isNaN(num) || num <= 0) return "Giá thuê phải là số dương";
    return null;
  }, [samplePrice, touchedFields.samplePrice]);

  const invoiceDayError = useMemo(() => {
    if (!touchedFields.invoiceDay) return null;
    const val = invoiceDay.trim();
    if (val.length === 0) return "Vui lòng nhập ngày lập hóa đơn";
    const num = Number(val);
    if (isNaN(num) || !Number.isInteger(num) || num < 1 || num > 31) return "Ngày lập hóa đơn phải từ 1 đến 31";
    return null;
  }, [invoiceDay, touchedFields.invoiceDay]);

  const paymentDeadlineError = useMemo(() => {
    if (!touchedFields.paymentDeadline) return null;
    const val = paymentDeadline.trim();
    if (val.length === 0) return "Vui lòng nhập hạn đóng tiền";
    const num = Number(val);
    if (isNaN(num) || !Number.isInteger(num) || num < 0) return "Hạn đóng tiền phải là số không âm";
    return null;
  }, [paymentDeadline, touchedFields.paymentDeadline]);

  const selectedRentType = useMemo(
    () =>
      RENT_TYPE_OPTIONS.find((option) => option.value === rentType) ??
      RENT_TYPE_OPTIONS[0],
    [rentType],
  );
  const selectedFloor =
    FLOOR_OPTIONS.find((option) => option.value === floorValue) ??
    FLOOR_OPTIONS[0];
  const selectedOccupancy = OCCUPANCY_OPTIONS.find(
    (option) => option.value === maxOccupancy,
  );

  return (
    <>
      <RefreshableScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <SectionTitle
          title="Thông tin nhà cho thuê"
          subTitle="Thông tin cơ bản tên, loại hình..."
        />

        <View style={styles.card}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setActiveModal("rentType")}
            style={[styles.selectorField, styles.selectorFieldLarge]}
          >
            <View style={styles.selectorTextWrap}>
              <Text style={styles.selectorLabel}>
                Loại hình cho thuê <Text style={styles.required}>*</Text>
              </Text>
              <Text style={styles.selectorValue}>{selectedRentType.title}</Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => handleRentTypeChange("room")}
              style={styles.clearButton}
            >
              <Ionicons name="close" size={16} color={Colors.textPrimary} />
            </TouchableOpacity>
          </TouchableOpacity>

          {/* Tên nhà trọ */}
          <Text style={styles.label}>
            Tên Nhà trọ <Text style={styles.required}>*</Text>
          </Text>
          <View
            style={[
              styles.inputContainer,
              styles.inputContainerBorder,
              buildingNameError ? styles.inputErrorBorder : null,
            ]}
          >
            <TextInput
              style={styles.textInput}
              value={buildingName}
              onChangeText={(text) => handleFieldChange("buildingName", text)}
              onBlur={() => handleTouch("buildingName")}
              placeholder="Ví dụ: Nguyễn Thanh"
              placeholderTextColor={Colors.gray500}
            />
            <View style={styles.inputSuffixBox}>
              <Text style={styles.inputSuffixText}>Nhà trọ</Text>
            </View>
          </View>
          {buildingNameError ? (
            <Text style={styles.errorText}>{buildingNameError}</Text>
          ) : null}
        </View>

        <View style={styles.sectionGap} />

        <SectionTitle
          title="Cách khởi tạo dữ liệu"
          subTitle="Theo mẫu hoặc từ excel hoặc thủ công"
        />

        <View style={styles.card}>
          <View style={styles.methodCards}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => handleIsAutoInitChange(true)}
              style={[styles.methodCard, isAutoInit && styles.methodCardActive]}
            >
              <Ionicons
                name="chatbox-ellipses-outline"
                size={42}
                color={isAutoInit ? "#FDB515" : Colors.gray500}
              />
              <Text style={styles.methodTitle}>Tự động theo mẫu</Text>
              <Text style={styles.methodDesc}>
                Số room được tạo tự động theo mẫu bạn nhập bên dưới
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => handleIsAutoInitChange(false)}
              style={[
                styles.methodCard,
                !isAutoInit && styles.methodCardActive,
              ]}
            >
              <Ionicons
                name="document-text-outline"
                size={42}
                color={!isAutoInit ? "#2E7D32" : Colors.gray500}
              />
              <Text style={styles.methodTitle}>Tạo theo Excel</Text>
              <Text style={styles.methodDesc}>
                Số room và giá được tạo từ file Excel bạn nhập
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setActiveModal("floor")}
            style={[styles.selectorField, styles.selectorFieldLarge]}
          >
            <View style={styles.selectorTextWrap}>
              <Text style={styles.selectorLabel}>
                Thiết lập số tầng (Gồm tầng triệt){" "}
                <Text style={styles.required}>*</Text>
              </Text>
              <Text style={styles.selectorValue}>{selectedFloor.title}</Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setBasicInfo({ floorValue: FLOOR_OPTIONS[0].value })}
              style={styles.clearButton}
            >
              <Ionicons name="close" size={16} color={Colors.textPrimary} />
            </TouchableOpacity>
          </TouchableOpacity>

          <View style={styles.divider} />

          <Text style={styles.label}>
            Số lượng phòng mẫu <Text style={styles.required}>*</Text>
          </Text>
          <View
            style={[
              styles.inputContainer,
              styles.inputContainerBorder,
              sampleRoomCountError ? styles.inputErrorBorder : null,
            ]}
          >
            <TextInput
              style={styles.textInput}
              value={sampleRoomCount}
              onChangeText={(text) => handleFieldChange("sampleRoomCount", text)}
              onBlur={() => handleTouch("sampleRoomCount")}
              keyboardType="numeric"
            />
            <View style={styles.inputSuffixBox}>
              <Text style={styles.inputSuffixText}>phòng</Text>
            </View>
          </View>
          {sampleRoomCountError ? (
            <Text style={styles.errorText}>{sampleRoomCountError}</Text>
          ) : null}

          <View style={styles.row}>
            <View style={styles.columnView}>
              <Text style={styles.label}>
                Diện tích mẫu <Text style={styles.required}>*</Text>
              </Text>
              <View
                style={[
                  styles.inputContainer,
                  styles.inputContainerBorder,
                  sampleAreaError ? styles.inputErrorBorder : null,
                ]}
              >
                <TextInput
                  style={styles.textInput}
                  value={sampleArea}
                  onChangeText={(text) => handleFieldChange("sampleArea", text)}
                  onBlur={() => handleTouch("sampleArea")}
                  keyboardType="numeric"
                />
                <View style={styles.inputSuffixBox}>
                  <Text style={styles.inputSuffixText}>m2</Text>
                </View>
              </View>
              {sampleAreaError ? (
                <Text style={styles.errorText}>{sampleAreaError}</Text>
              ) : null}
            </View>

            <View style={styles.columnView}>
              <Text style={styles.label}>
                Giá thuê mẫu <Text style={styles.required}>*</Text>
              </Text>
              <View
                style={[
                  styles.inputContainer,
                  styles.inputContainerBorder,
                  samplePriceError ? styles.inputErrorBorder : null,
                ]}
              >
                <TextInput
                  style={styles.textInput}
                  value={samplePrice}
                  onChangeText={(text) => handleFieldChange("samplePrice", text)}
                  onBlur={() => handleTouch("samplePrice")}
                  placeholder="Nhập giá"
                  placeholderTextColor={Colors.gray500}
                  keyboardType="numeric"
                />
                <View style={styles.inputSuffixBox}>
                  <Text style={styles.inputSuffixText}>đ/tháng</Text>
                </View>
              </View>
              {samplePriceError ? (
                <Text style={styles.errorText}>{samplePriceError}</Text>
              ) : null}
            </View>
          </View>

          <Text style={styles.noteText}>
            * Chú ý: Đây là giá thuê & diện tích hầu hết các phòng
          </Text>
          <Text style={styles.noteText}>
            * Sau khi thêm nhà bạn vẫn có thể sửa cho từng phòng
          </Text>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setActiveModal("occupancy")}
            style={[
              styles.selectorField,
              styles.selectorFieldCompact,
              { marginTop: Spacing.md },
            ]}
          >
            <View style={styles.selectorTextWrap}>
              <Text style={styles.selectorLabel}>Tối đa người ở / phòng</Text>
              <Text style={styles.selectorValue}>
                {selectedOccupancy ? selectedOccupancy.title : "Chọn giá trị"}
              </Text>
            </View>
            <Ionicons name="chevron-down" size={20} color={Colors.gray800} />
          </TouchableOpacity>
        </View>

        <View style={styles.sectionGap} />

        <SectionTitle
          title="Cài đặt ngày"
          subTitle="Cấu hình ngày giúp hệ thống thông báo cho bạn"
        />

        <View style={styles.cardNoPadding}>
          <View style={[styles.row, { padding: Spacing.base, paddingBottom: 0 }]}>
            <View style={styles.columnView}>
              <Text style={styles.label}>
                Ngày lập hóa đơn thu tiền <Text style={styles.required}>*</Text>
              </Text>
              <View
                style={[
                  styles.inputContainer,
                  styles.inputContainerBorder,
                  invoiceDayError ? styles.inputErrorBorder : null,
                  { marginBottom: Spacing.xs },
                ]}
              >
                <TextInput
                  style={styles.textInput}
                  value={invoiceDay}
                  onChangeText={(text) => handleFieldChange("invoiceDay", text)}
                  onBlur={() => handleTouch("invoiceDay")}
                  keyboardType="numeric"
                />
              </View>
              {invoiceDayError ? (
                <Text style={[styles.errorText, { marginTop: 0, marginBottom: Spacing.xs }]}>{invoiceDayError}</Text>
              ) : null}
              <Text style={styles.helperText}>
                Nhập ngày cuối tháng hoặc ngày cố định trong tháng.
              </Text>
            </View>

            <View style={styles.columnView}>
              <Text style={styles.label}>
                Hạn đóng tiền <Text style={styles.required}>*</Text>
              </Text>
              <View
                style={[
                  styles.inputContainer,
                  styles.inputContainerBorder,
                  paymentDeadlineError ? styles.inputErrorBorder : null,
                  { marginBottom: Spacing.xs },
                ]}
              >
                <TextInput
                  style={styles.textInput}
                  value={paymentDeadline}
                  onChangeText={(text) => handleFieldChange("paymentDeadline", text)}
                  onBlur={() => handleTouch("paymentDeadline")}
                  keyboardType="numeric"
                />
                <View style={styles.inputSuffixBox}>
                  <Text style={styles.inputSuffixText}>Ngày</Text>
                </View>
              </View>
              {paymentDeadlineError ? (
                <Text style={[styles.errorText, { marginTop: 0, marginBottom: Spacing.xs }]}>{paymentDeadlineError}</Text>
              ) : null}
              <Text style={styles.helperText}>
                Số ngày hết đóng tiền thuê kể từ ngày lập hóa đơn
              </Text>
            </View>
          </View>

          <View style={styles.infoAlert}>
            <View style={styles.infoAlertIcon}>
              <Ionicons name="information" size={16} color={Colors.white} />
            </View>
            <Text style={styles.infoAlertText}>
              <Text style={styles.infoStrong}>Thông tin:</Text> Khi có khách
              thuê không đóng tiền đúng hạn. Phần mềm sẽ nhắc nhở bạn.
            </Text>
          </View>
        </View>
      </RefreshableScrollView>

      <PickerModal
        visible={activeModal === "rentType"}
        title="Loại hình cho thuê"
        icon="home"
        options={RENT_TYPE_OPTIONS}
        selectedValue={rentType}
        onSelect={(value) => handleRentTypeChange(value as RentType)}
        onClose={() => setActiveModal(null)}
      />

      <PickerModal
        visible={activeModal === "floor"}
        title="Thiết lập số tầng (Gồm tầng triệt)"
        icon="list"
        options={FLOOR_OPTIONS}
        selectedValue={floorValue}
        onSelect={(value) => setBasicInfo({ floorValue: value })}
        onClose={() => setActiveModal(null)}
      />

      <PickerModal
        visible={activeModal === "occupancy"}
        title="Tối đa người ở / phòng"
        icon="people"
        options={OCCUPANCY_OPTIONS}
        selectedValue={maxOccupancy}
        onSelect={(value) => setBasicInfo({ maxOccupancy: value })}
        onClose={() => setActiveModal(null)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing["4xl"],
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.borderLight,
  },
  hashtagIcon: {
    width: 32,
    height: 32,
    backgroundColor: Colors.success,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.sm,
  },
  hashtagText: {
    color: Colors.white,
    fontWeight: FontWeights.bold,
    fontSize: FontSizes.lg,
  },
  sectionTitleWrap: {
    flex: 1,
  },
  sectionTitleMain: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  sectionTitleSub: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  sectionGap: {
    height: Spacing.base,
  },
  card: {
    backgroundColor: Colors.white,
    padding: Spacing.base,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.borderLight,
  },
  cardNoPadding: {
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.borderLight,
  },
  label: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semiBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  required: {
    color: Colors.error,
  },
  errorText: {
    fontSize: FontSizes.xs,
    color: Colors.error,
    marginTop: -Spacing.sm,
    marginBottom: Spacing.sm,
  },
  selectorField: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  selectorFieldLarge: {
    minHeight: 72,
  },
  selectorFieldCompact: {
    minHeight: 48,
  },
  selectorTextWrap: {
    flex: 1,
    justifyContent: "center",
    paddingVertical: Spacing.sm,
    paddingRight: Spacing.md,
  },
  selectorLabel: {
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  selectorValue: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.md,
    minHeight: 48,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  inputContainerBorder: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  inputErrorBorder: {
    borderColor: Colors.error,
  },
  textInput: {
    flex: 1,
    fontSize: FontSizes.base,
    paddingVertical: Spacing.sm,
    color: Colors.textPrimary,
  },
  inputSuffixBox: {
    backgroundColor: "#F5FAEE",
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  inputSuffixText: {
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
  },
  clearButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.gray300,
    alignItems: "center",
    justifyContent: "center",
  },
  methodCards: {
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  methodCard: {
    flex: 1,
    minHeight: 150,
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
    borderStyle: "dashed",
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  methodCardActive: {
    borderColor: Colors.success,
    backgroundColor: "#FCFFFB",
  },
  methodTitle: {
    marginTop: Spacing.sm,
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    textAlign: "center",
  },
  methodDesc: {
    marginTop: 6,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginBottom: Spacing.md,
  },
  row: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  columnView: {
    flex: 1,
  },
  noteText: {
    fontSize: FontSizes.sm,
    color: "#D84315",
    fontStyle: "italic",
    marginBottom: 4,
  },
  helperText: {
    fontSize: FontSizes.xs,
    color: "#D84315",
    marginTop: -8,
    fontStyle: "italic",
  },
  infoAlert: {
    flexDirection: "row",
    backgroundColor: "#F1F9F4",
    borderWidth: 1,
    borderColor: Colors.success,
    padding: Spacing.md,
    marginHorizontal: Spacing.base,
    marginBottom: Spacing.base,
    borderRadius: BorderRadius.md,
    alignItems: "flex-start",
  },
  infoAlertIcon: {
    backgroundColor: Colors.success,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.sm,
    marginTop: 2,
  },
  infoAlertText: {
    flex: 1,
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  infoStrong: {
    fontWeight: FontWeights.bold,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.lg,
  },
  modalCard: {
    width: "100%",
    maxHeight: "78%",
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalHeaderIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.textPrimary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.sm,
  },
  modalHeaderTitle: {
    flex: 1,
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  modalDivider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginTop: Spacing.base,
    marginBottom: Spacing.sm,
  },
  modalList: {
    flexGrow: 0,
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.base,
  },
  modalOptionText: {
    flex: 1,
    paddingRight: Spacing.md,
  },
  modalOptionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  modalOptionDescription: {
    marginTop: 2,
    fontSize: FontSizes.base,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  modalOptionDivider: {
    height: 1,
    backgroundColor: Colors.borderLight,
  },
  modalCheck: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.success,
    alignItems: "center",
    justifyContent: "center",
  },
  modalCloseButton: {
    marginTop: Spacing.base,
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },
  modalCloseButtonText: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
});
