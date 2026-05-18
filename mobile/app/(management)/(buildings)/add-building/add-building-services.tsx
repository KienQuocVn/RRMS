import React, { useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RefreshableScrollView } from "@/components/ui/refreshable-scroll-view";
import {
  BorderRadius,
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
} from "@/constants/theme";
import { useAddBuildingFlow } from "@/hooks/use-add-building-flow";

interface ServiceItem {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  mode: string;
  options: string[];
}

interface FeatureState {
  tenantApp: boolean;
  zaloInvoice: boolean;
  assets: boolean;
  vehicles: boolean;
  posting: boolean;
  files: boolean;
  broker: boolean;
  tasks: boolean;
  sms: boolean;
}

interface FeatureItem {
  id: keyof FeatureState;
  icon: keyof typeof Ionicons.glyphMap;
  iconTint: string;
  title: string;
  description: string;
  highlight?: string;
}

const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: "electric",
    title: "Dịch vụ điện",
    icon: "flash",
    mode: "Tính theo đồng hồ (phổ biến)",
    options: [
      "Miễn phí tiền điện/không sử dụng",
      "Tính theo người",
      "Tính theo tháng",
      "Tính theo đồng hồ (phổ biến)",
    ],
  },
  {
    id: "water",
    title: "Dịch vụ nước",
    icon: "water",
    mode: "Tính theo đồng hồ (phổ biến)",
    options: [
      "Miễn phí tiền nước/không sử dụng",
      "Tính theo người",
      "Tính theo tháng",
      "Tính theo đồng hồ (phổ biến)",
    ],
  },
  {
    id: "trash",
    title: "Dịch vụ rác",
    icon: "trash",
    mode: "Miễn phí tiền điện/không sử dụng",
    options: [
      "Miễn phí tiền điện/không sử dụng",
      "Tính theo người",
      "Tính theo tháng",
    ],
  },
  {
    id: "internet",
    title: "Dịch vụ internet/mạng",
    icon: "wifi",
    mode: "Miễn phí tiền điện/không sử dụng",
    options: [
      "Miễn phí tiền điện/không sử dụng",
      "Tính theo người",
      "Tính theo tháng",
    ],
  },
];

const INITIAL_FEATURES: FeatureState = {
  tenantApp: true,
  zaloInvoice: true,
  assets: true,
  vehicles: true,
  posting: true,
  files: true,
  broker: true,
  tasks: true,
  sms: false,
};

const FEATURE_ITEMS: FeatureItem[] = [
  {
    id: "tenantApp",
    icon: "phone-portrait-outline",
    iconTint: "#22C7D6",
    title: "APP dành riêng cho khách thuê",
    description:
      "Tạo & kết nối dễ dàng, hóa đơn tự động, thanh toán online, ký hợp đồng online....",
    highlight: "* Hoàn toàn miễn phí",
  },
  {
    id: "zaloInvoice",
    icon: "chatbubble-ellipses-outline",
    iconTint: "#3B82F6",
    title: "Gửi hóa đơn tự động qua ZALO",
    description: "Dễ dàng gửi hóa đơn hàng loạt qua ZALO",
  },
  {
    id: "assets",
    icon: "cube-outline",
    iconTint: "#F59E0B",
    title: "Chức năng quản lý tài sản",
    description: "Dùng để quản lý tài sản khi khách thuê sử dụng",
  },
  {
    id: "vehicles",
    icon: "bicycle-outline",
    iconTint: "#FF7A59",
    title: "Chức năng quản lý xe",
    description: "Dùng để quản lý xe của khách thuê",
  },
  {
    id: "posting",
    icon: "cloud-upload-outline",
    iconTint: "#36C5F0",
    title: "Tính năng đăng tin tiếp cận khách thuê",
    description:
      "Đăng tin tìm khách thuê, khách tiềm năng... trên hệ thống LOZIDO",
  },
  {
    id: "files",
    icon: "document-text-outline",
    iconTint: "#14B8A6",
    title: "Hình ảnh, File chứng từ hợp đồng",
    description: "Hình ảnh CCCD, hình ảnh hợp đồng giấy",
  },
  {
    id: "broker",
    icon: "people-outline",
    iconTint: "#A855F7",
    title: "Quản lý môi giới",
    description:
      "Bạn có làm việc với môi giới? Bạn có thể lưu trữ, chi hoa hồng...",
  },
  {
    id: "tasks",
    icon: "clipboard-outline",
    iconTint: "#F97316",
    title: "Quản lý công việc",
    description:
      "Báo cáo sự cố, hệ thống tự động nhắc việc, tạo việc cá nhân, nhân viên",
  },
  {
    id: "sms",
    icon: "chatbox-ellipses-outline",
    iconTint: "#84CC16",
    title: "Gửi tin nhắn SMS tự động cho khách thuê",
    description:
      "Khi lập hóa đơn bạn có muốn gửi tin nhắn SMS tiền nhà cho khách thuê hay không?",
  },
];

function SectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <View style={styles.sectionTitle}>
      <View style={styles.hashIcon}>
        <Text style={styles.hashText}>#</Text>
      </View>
      <View style={styles.sectionTitleText}>
        <Text style={styles.sectionTitleMain}>{title}</Text>
        <Text style={styles.sectionTitleSub}>{subtitle}</Text>
      </View>
    </View>
  );
}

function Toggle({ value, onPress }: { value: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[styles.toggle, value && styles.toggleActive]}
    >
      <View style={[styles.toggleThumb, value && styles.toggleThumbActive]} />
    </TouchableOpacity>
  );
}

function ServiceModeModal({
  service,
  onClose,
  onSelect,
}: {
  service: ServiceItem | null;
  onClose: () => void;
  onSelect: (serviceId: string, mode: string) => void;
}) {
  if (!service) {
    return null;
  }

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable
          style={styles.modalCard}
          onPress={(event) => event.stopPropagation()}
        >
          <View style={styles.modalHeader}>
            <View style={styles.modalHeaderIcon}>
              <Ionicons
                name={service.icon}
                size={22}
                color={Colors.textPrimary}
              />
            </View>
            <Text style={styles.modalHeaderTitle}>{service.title}</Text>
          </View>

          <View style={styles.modalDivider} />

          <ScrollView
            style={styles.modalList}
            showsVerticalScrollIndicator={false}
          >
            {service.options.map((option, index) => {
              const isSelected = service.mode === option;

              return (
                <View key={option}>
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => {
                      onSelect(service.id, option);
                      onClose();
                    }}
                    style={styles.modalOption}
                  >
                    <Text style={styles.modalOptionTitle}>{option}</Text>
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

                  {index < service.options.length - 1 ? (
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

export default function AddBuildingServicesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const address = useAddBuildingFlow((state) => state.address);
  const [services, setServices] = useState(INITIAL_SERVICES);
  const [featureState, setFeatureState] = useState(INITIAL_FEATURES);
  const [activeServiceId, setActiveServiceId] = useState<string | null>(null);

  const addressSummary = [
    address.detail,
    address.ward,
    address.district,
    address.city,
  ]
    .filter(Boolean)
    .join(", ");

  const handleSave = () => {
    Alert.alert(
      "Đã lưu thông tin",
      "Thiết lập dịch vụ và tính năng đã được cập nhật trong giao diện mẫu.",
    );
  };

  const activeService =
    services.find((service) => service.id === activeServiceId) ?? null;

  const handleChangeServiceMode = (serviceId: string, mode: string) => {
    setServices((current) =>
      current.map((service) =>
        service.id === serviceId ? { ...service, mode } : service,
      ),
    );
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.header,
          { paddingTop: Platform.OS === "ios" ? insets.top : Spacing.xl },
        ]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thêm mới nhà cho thuê</Text>
      </View>

      <RefreshableScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <SectionTitle
          title="Cài đặt dịch vụ Nhà trọ"
          subtitle="Thiết lập các dịch vụ khách thuê sử dụng khi thuê"
        />

        <View style={styles.card}>
          {services.map((service, index) => (
            <View key={service.id}>
              <View style={styles.serviceRow}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => setActiveServiceId(service.id)}
                  style={styles.serviceContentButton}
                >
                  <View style={styles.serviceTextWrap}>
                    <Text style={styles.serviceTitle}>{service.title}</Text>
                    <Text style={styles.serviceMode}>{service.mode}</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() =>
                    setServices((current) =>
                      current.filter((item) => item.id !== service.id),
                    )
                  }
                  style={styles.removeButton}
                >
                  <Ionicons name="close" size={24} color={Colors.textPrimary} />
                </TouchableOpacity>
              </View>

              {index < services.length - 1 && <View style={styles.divider} />}
            </View>
          ))}

          {services.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>
                Bạn đã gỡ toàn bộ dịch vụ mặc định.
              </Text>
            </View>
          ) : null}
        </View>

        <View style={styles.sectionSpacer} />

        <SectionTitle
          title="Cài đặt tính năng"
          subtitle="Tùy chỉnh tính năng sử dụng cho Nhà trọ"
        />

        <View style={styles.card}>
          {FEATURE_ITEMS.map((item, index) => (
            <View key={item.id}>
              <View style={styles.featureRow}>
                <View style={styles.featureIconWrap}>
                  <Ionicons name={item.icon} size={24} color={item.iconTint} />
                </View>

                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>{item.title}</Text>
                  <Text style={styles.featureDesc}>{item.description}</Text>
                  {item.highlight ? (
                    <Text style={styles.featureHighlight}>
                      {item.highlight}
                    </Text>
                  ) : null}
                </View>

                <Toggle
                  value={featureState[item.id]}
                  onPress={() =>
                    setFeatureState((current) => ({
                      ...current,
                      [item.id]: !current[item.id],
                    }))
                  }
                />
              </View>

              {index < FEATURE_ITEMS.length - 1 && (
                <View style={styles.divider} />
              )}
            </View>
          ))}
        </View>

        <View style={styles.sectionSpacer} />

        <SectionTitle
          title="Địa chỉ & vị trí"
          subtitle="Địa chỉ giúp khách tìm đến chính xác để xem nhà cho thuê"
        />

        <View style={styles.card}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.push("/add-building/add-building-address")}
            style={styles.addressAction}
          >
            <View style={styles.addressActionIcon}>
              <Ionicons name="add" size={28} color={Colors.textPrimary} />
            </View>
            <Text style={styles.addressActionText}>
              Thêm địa chỉ & vị trí trên bản đồ
            </Text>
          </TouchableOpacity>

          {addressSummary ? (
            <View style={styles.addressSummaryCard}>
              <View style={styles.addressSummaryIcon}>
                <Ionicons name="location" size={18} color={Colors.white} />
              </View>
              <View style={styles.addressSummaryText}>
                <Text style={styles.addressSummaryTitle}>Địa chỉ đã chọn</Text>
                <Text style={styles.addressSummaryValue}>{addressSummary}</Text>
                {address.mapLabel ? (
                  <Text style={styles.addressSummaryMeta}>
                    {address.mapLabel}
                  </Text>
                ) : null}
              </View>
            </View>
          ) : null}
        </View>
      </RefreshableScrollView>

      <ServiceModeModal
        service={activeService}
        onClose={() => setActiveServiceId(null)}
        onSelect={handleChangeServiceMode}
      />

      <View
        style={[
          styles.footer,
          {
            paddingBottom:
              Platform.OS === "ios" ? Math.max(insets.bottom, 18) : Spacing.md,
          },
        ]}
      >
        <View style={styles.progressContainer}>
          <View
            style={[styles.progressSegment, styles.progressSegmentInactive]}
          />
          <View
            style={[styles.progressSegment, styles.progressSegmentActive]}
          />
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.back()}
          >
            <Text style={styles.secondaryButtonText}>Quay lại trước</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.primaryButton} onPress={handleSave}>
            <Text style={styles.primaryButtonText}>Lưu thông tin</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray50,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.sm,
  },
  headerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 180,
  },
  sectionTitle: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  hashIcon: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: Colors.success,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.sm,
  },
  hashText: {
    color: Colors.white,
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
  },
  sectionTitleText: {
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
  },
  sectionSpacer: {
    height: 0,
  },
  card: {
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.borderLight,
    paddingVertical: Spacing.base,
  },
  serviceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: Spacing.base,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
    minHeight: 48,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.white,
  },
  serviceContentButton: {
    flex: 1,
  },
  serviceTextWrap: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingRight: Spacing.md,
  },
  serviceTitle: {
    fontSize: FontSizes.base,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  serviceMode: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  removeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.gray300,
    alignItems: "center",
    justifyContent: "center",
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
    maxHeight: "72%",
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
    minHeight: 56,
    paddingVertical: Spacing.sm,
  },
  modalOptionTitle: {
    flex: 1,
    paddingRight: Spacing.md,
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
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
  emptyBox: {
    marginHorizontal: Spacing.base,
    padding: Spacing.base,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.gray100,
  },
  emptyText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginHorizontal: Spacing.base,
    marginBottom: Spacing.md,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  featureIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.gray100,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  featureContent: {
    flex: 1,
    paddingRight: Spacing.md,
  },
  featureTitle: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  featureDesc: {
    fontSize: FontSizes.sm,
    lineHeight: 18,
    color: Colors.textSecondary,
  },
  featureHighlight: {
    marginTop: 4,
    fontSize: FontSizes.sm,
    color: "#FF7A00",
  },
  toggle: {
    width: 52,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#505050",
    justifyContent: "center",
    paddingHorizontal: 2,
  },
  toggleActive: {
    backgroundColor: Colors.success,
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#BDBDBD",
  },
  toggleThumbActive: {
    alignSelf: "flex-end",
    backgroundColor: Colors.white,
  },
  addressAction: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.lg,
  },
  addressActionIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: Colors.textPrimary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.sm,
  },
  addressActionText: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  addressSummaryCard: {
    flexDirection: "row",
    marginHorizontal: Spacing.base,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: "#F3FAF4",
    borderWidth: 1,
    borderColor: "#BFE8C8",
  },
  addressSummaryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.success,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.sm,
  },
  addressSummaryText: {
    flex: 1,
  },
  addressSummaryTitle: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
    color: "#13823B",
    marginBottom: 4,
  },
  addressSummaryValue: {
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  addressSummaryMeta: {
    marginTop: 4,
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderBottomColor: Colors.borderLight,
    borderTopColor: Colors.borderLight,
    paddingTop: 0,
    paddingHorizontal: 0,
  },
  progressContainer: {
    flexDirection: "row",
    height: 3,
    width: "100%",
    marginBottom: Spacing.md,
  },
  progressSegment: {
    flex: 1,
  },
  progressSegmentInactive: {
    backgroundColor: Colors.gray200,
    marginHorizontal: 1,
  },
  progressSegmentActive: {
    backgroundColor: Colors.success,
    marginHorizontal: 1,
  },
  buttonRow: {
    flexDirection: "row",
    paddingHorizontal: Spacing.base,
    gap: Spacing.md,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
  },
  secondaryButtonText: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: Colors.success,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
  },
  primaryButtonText: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Colors.white,
  },
});
