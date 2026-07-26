import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  FlatList,
  Linking,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  BorderRadius,
  Colors,
  FontSizes,
  FontWeights,
  Shadows,
  Spacing,
} from "@/constants/theme";
import { useAuth } from "@/hooks/use-auth";
import { motelService } from "@/services/api/motel.service";
import { roomService } from "@/services/api/room.service";
import { safeAsyncStorage } from "@/services/storage/safe-async-storage";
import { tenantService } from "@/services/api/tenant.service";
import { TenantResponse } from "@/types/tenant.types";

const GREEN = "#2b7ed7";
const CALL_GREEN = "#2b7ed7";
const BLUE = "#217DE2";
const ORANGE = "#FF5A00";
const PAGE_BG = "#EEF3F2";

type RoomOption = {
  roomId: string;
  name?: string;
};

type TenantListItem = TenantResponse & {
  fullname?: string;
  roomId?: string;
  roomName?: string;
  nameRoom?: string;
  room?: {
    roomId?: string;
    id?: string;
    name?: string;
    roomName?: string;
  };
};

function extractItems<T>(response: any): T[] {
  const candidates = [
    response,
    response?.data,
    response?.result,
    response?.data?.result,
    response?.items,
    response?.content,
    response?.result?.items,
    response?.result?.content,
    response?.data?.result?.items,
    response?.data?.result?.content,
  ];

  return candidates.find(Array.isArray) ?? [];
}

function getRoomName(room?: RoomOption | null) {
  return room?.name ? `Phòng ${room.name}` : "Phòng 1";
}

function getTenantRoomId(tenant: TenantListItem) {
  return tenant.roomId ?? tenant.room?.roomId ?? tenant.room?.id ?? "";
}

function getTenantRoomName(tenant: TenantListItem, fallback = "Chưa phân phòng") {
  const roomName = tenant.room?.name ?? tenant.room?.roomName ?? tenant.roomName ?? tenant.nameRoom;
  return roomName ? `Phòng ${roomName}` : fallback;
}

export default function TenantsListScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const user = useAuth((state) => state.user);

  const [isLoading, setIsLoading] = useState(true);
  const [rooms, setRooms] = useState<RoomOption[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<RoomOption | null>(null);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [tenants, setTenants] = useState<TenantListItem[]>([]);
  const [searchText, setSearchText] = useState("");
  const [selectedActionTenant, setSelectedActionTenant] = useState<TenantListItem | null>(null);

  const loadTenantsByMotel = useCallback(async (motelId: string) => {
    try {
      const response = await tenantService.getTenantsByMotel(motelId);
      setTenants(extractItems<TenantListItem>(response));
    } catch {
      setTenants([]);
    }
  }, []);

  const loadData = useCallback(async () => {
    if (!user?.username) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const motelsRes = await motelService.getMotelsByAccount(user.username);
      const motels = motelsRes.result || [];
      const storedId = await safeAsyncStorage.getItem("rrms_active_motel_id");
      const motel =
        motels.find((item: any) => item.motelId === storedId) ?? motels[0] ?? null;

      if (!motel) {
        setRooms([]);
        setTenants([]);
        setSelectedRoom(null);
        return;
      }

      const roomsResponse = await roomService.getRoomsByMotel(motel.motelId);
      const roomList = extractItems<RoomOption>(roomsResponse);
      setRooms(roomList);

      const nextRoom =
        roomList.find((room) => room.roomId === selectedRoom?.roomId) ?? null;
      setSelectedRoom(nextRoom);
      await loadTenantsByMotel(motel.motelId);
    } catch (err: any) {
      Alert.alert(
        "Lỗi",
        err?.response?.data?.message || "Không thể tải danh sách khách thuê.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [loadTenantsByMotel, selectedRoom?.roomId, user?.username]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const filteredTenants = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();

    return tenants.filter((tenant) => {
      const matchesRoom =
        !selectedRoom?.roomId || getTenantRoomId(tenant) === selectedRoom.roomId;

      if (!matchesRoom) {
        return false;
      }

      if (!keyword) {
        return true;
      }

      const searchableText = [
        tenant.fullName,
        tenant.fullname,
        tenant.phone,
        tenant.cccd,
        tenant.address,
        tenant.job,
        tenant.relationship,
        getTenantRoomName(tenant, ""),
      ]
        .join(" ")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

      return (
        searchableText.includes(keyword.normalize("NFD").replace(/[\u0300-\u036f]/g, "")) ||
        tenant.phone?.includes(keyword)
      );
    });
  }, [searchText, selectedRoom, tenants]);

  const tenantsByRoom = useMemo(() => {
    return filteredTenants.reduce<Record<string, TenantListItem[]>>((result, tenant) => {
      const roomName = getTenantRoomName(tenant);
      result[roomName] = result[roomName] || [];
      result[roomName].push(tenant);
      return result;
    }, {});
  }, [filteredTenants]);

  const handleSelectRoom = (room: RoomOption | null) => {
    setSelectedRoom(room);
    setShowRoomModal(false);
  };

  const handleCallTenant = (phone?: string) => {
    if (!phone) {
      Alert.alert("Thông báo", "Khách thuê chưa có số điện thoại.");
      return;
    }
    void Linking.openURL(`tel:${phone}`);
  };

  const openTenantDetail = (tenantId: string) => {
    router.push({
      pathname: "/tab-manage/management-menu/tenants/[id]",
      params: { id: tenantId },
    } as any);
  };

  const handleDeleteTenant = (tenant: TenantListItem) => {
    Alert.alert(
      "Xóa khách thuê",
      `Bạn có chắc muốn xóa ${tenant.fullName || tenant.fullname || "khách thuê"}?`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            try {
              await tenantService.deleteTenant(tenant.tenantId);
              setTenants((prev) => prev.filter((item) => item.tenantId !== tenant.tenantId));
              setSelectedActionTenant(null);
            } catch (err: any) {
              Alert.alert(
                "Lỗi",
                err?.response?.data?.message || "Không thể xóa khách thuê.",
              );
            }
          },
        },
      ],
    );
  };

  const renderTenant = ({ item }: { item: TenantListItem }) => (
    <View style={styles.tenantRow}>
      <View style={styles.avatar}>
        <Ionicons name="person" size={34} color="#F05A1A" />
      </View>

      <View style={styles.tenantInfo}>
        <Text style={styles.tenantName} numberOfLines={1}>
          {item.fullName || item.fullname || "Khách thuê"}
        </Text>
        <Text style={styles.tenantPhone}>SĐT: {item.phone || "---"}</Text>
        <View style={styles.warningRow}>
          <Ionicons name="information-circle-outline" size={13} color={ORANGE} />
          <Text style={styles.warningText}>Chưa sử dụng APP</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.callButton}
        activeOpacity={0.82}
        onPress={() => handleCallTenant(item.phone)}
        accessibilityLabel={`Gọi ${item.fullName || item.fullname || "khách thuê"}`}
      >
        <Ionicons name="call" size={20} color={Colors.white} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.moreButton}
        activeOpacity={0.82}
        onPress={() => setSelectedActionTenant(item)}
        accessibilityLabel="Mở tuỳ chọn khách thuê"
      >
        <Ionicons name="ellipsis-vertical" size={21} color="#000" />
      </TouchableOpacity>

      <View style={styles.tenantStatusRow}>
        <StatusPill label="Chưa đăng ký tạm trú" />
        <StatusPill label="Chưa đầy đủ giấy tờ" />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.header,
          { paddingTop: Platform.OS === "ios" ? insets.top + 12 : 28 },
        ]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityLabel="Quay lại"
        >
          <Ionicons name="arrow-back" size={23} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Danh sách khách thuê</Text>
      </View>

      <View style={styles.topActions}>
        <TouchableOpacity style={[styles.quickAction, styles.excelButton]} activeOpacity={0.85}>
          <Ionicons name="calculator-outline" size={20} color={Colors.white} />
          <Text style={styles.quickActionText}>Chia sẻ excel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.quickAction, styles.oldTenantButton]} activeOpacity={0.85}>
          <Ionicons name="person-circle" size={25} color={Colors.white} />
          <Text style={styles.quickActionText}>Quản lý khách cũ</Text>
          <Ionicons name="chevron-forward" size={21} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.filterRow}>
        <TouchableOpacity style={styles.roomFilter} onPress={() => setShowRoomModal(true)}>
          <View>
            <Text style={styles.filterLabel}>Chọn phòng</Text>
            <Text style={styles.filterValue}>
              {selectedRoom?.roomId ? getRoomName(selectedRoom) : "Tất cả phòng"}
            </Text>
          </View>
          <Ionicons name="chevron-down" size={20} color="#000" />
        </TouchableOpacity>
        <View style={styles.searchBox}>
          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            style={styles.searchInput}
            placeholder="Nhập SĐT/tên tìm kiếm..."
            placeholderTextColor={Colors.gray500}
          />
          <Ionicons name="search" size={25} color="#000" />
        </View>
      </View>

      <Text style={styles.countTitle}>Tổng Có ({filteredTenants.length}) khách</Text>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={GREEN} />
        </View>
      ) : filteredTenants.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="people-outline" size={48} color={Colors.gray300} />
          <Text style={styles.emptyTitle}>Chưa có khách thuê</Text>
          <Text style={styles.emptyDesc}>Thử đổi phòng hoặc nhập từ khóa khác.</Text>
        </View>
      ) : (
        <FlatList
          data={Object.entries(tenantsByRoom)}
          keyExtractor={([roomName]) => roomName}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item: [roomName, roomTenants] }) => (
            <View style={styles.roomCard}>
              <View style={styles.roomCardHeader}>
                <View style={styles.roomIcon}>
                  <Ionicons name="list" size={18} color={Colors.white} />
                </View>
                <Text style={styles.roomTitle}>{roomName}</Text>
                <View style={styles.roomHeaderSpacer} />
                <TouchableOpacity style={styles.chatAction} activeOpacity={0.8}>
                  <View style={styles.outlineIconButton}>
                    <Ionicons name="chatbox" size={18} color={BLUE} />
                  </View>
                  <Text style={styles.roomActionText}>Chat</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.addAction}
                  activeOpacity={0.8}
                  onPress={() =>
                    router.push({
                      pathname: "/tab-manage/management-menu/tenants/add",
                      params: selectedRoom
                        ? { roomId: selectedRoom.roomId, roomName: selectedRoom.name }
                        : {},
                    } as any)
                  }
                >
                  <View style={styles.outlineIconButton}>
                    <Ionicons name="add" size={23} color="#000" />
                  </View>
                  <Text style={styles.roomActionText}>Thêm</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={roomTenants}
                keyExtractor={(tenant) => tenant.tenantId}
                renderItem={renderTenant}
                scrollEnabled={false}
              />
            </View>
          )}
        />
      )}

      <RoomModal
        rooms={rooms}
        selectedRoom={selectedRoom}
        visible={showRoomModal}
        onClose={() => setShowRoomModal(false)}
        onSelect={handleSelectRoom}
      />

      <TenantActionSheet
        selected={selectedActionTenant}
        onClose={() => setSelectedActionTenant(null)}
        onOpenDetail={(tenantId) => {
          setSelectedActionTenant(null);
          openTenantDetail(tenantId);
        }}
        onDelete={handleDeleteTenant}
      />
    </View>
  );
}

function StatusPill({ label }: { label: string }) {
  return (
    <View style={styles.statusPill}>
      <View style={styles.statusDot} />
      <Text style={styles.statusText}>{label}</Text>
    </View>
  );
}

function TenantActionSheet({
  onClose,
  onDelete,
  onOpenDetail,
  selected,
}: {
  onClose: () => void;
  onDelete: (tenant: TenantListItem) => void;
  onOpenDetail: (tenantId: string) => void;
  selected: TenantListItem | null;
}) {
  const slideY = useRef(new Animated.Value(620)).current;

  useEffect(() => {
    if (selected) {
      slideY.setValue(620);
      Animated.timing(slideY, {
        toValue: 0,
        duration: 260,
        useNativeDriver: true,
      }).start();
    }
  }, [selected, slideY]);

  return (
    <Modal
      visible={Boolean(selected)}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.actionSheetBackdrop}>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.actionSheetDim}
          onPress={onClose}
        />
        <Animated.View
          style={[
            styles.actionSheetAnimatedWrap,
            { transform: [{ translateY: slideY }] },
          ]}
        >
          <View style={styles.actionSheetHandle} />
          <View style={styles.actionSheet}>
            <View style={styles.actionWarningBox}>
              <Ionicons name="warning-outline" size={22} color={ORANGE} />
              <Text style={styles.actionWarningText}>Chưa sử dụng APP khách</Text>
            </View>

            <ScrollView style={styles.actionMenuScroll} showsVerticalScrollIndicator={false}>
              <View style={styles.actionMenu}>
                <ActionSheetItem
                  icon="phone-portrait-outline"
                  label="Cho phép sử dụng APP - Khách thuê"
                  description="Gửi hóa đơn tự động cho khách, thanh toán hóa đơn online..."
                  labelColor="#2b7ed7"
                  pro
                  onPress={onClose}
                />
                <ActionSheetItem
                  icon="lock-closed-outline"
                  label="Cấp quyền khóa thông minh"
                  description="Có thể ra vào phòng bằng khóa thông minh"
                  labelColor="#2b7ed7"
                  pro
                  onPress={onClose}
                />
                <ActionSheetItem
                  icon="person-outline"
                  label="Xem chi tiết khách thuê"
                  onPress={() => selected?.tenantId && onOpenDetail(selected.tenantId)}
                />
                <ActionSheetItem
                  icon="create-outline"
                  label="Chỉnh sửa khách thuê"
                  onPress={() => selected?.tenantId && onOpenDetail(selected.tenantId)}
                />
                <ActionSheetItem
                  icon="document-outline"
                  label="Xem văn bản tờ khai tạm trú"
                  onPress={onClose}
                />
                <ActionSheetItem
                  icon="print-outline"
                  label="In tờ khai tạm trú"
                  onPress={onClose}
                />
                <ActionSheetItem
                  icon="print-outline"
                  label="In tờ khai gia hạn tạm trú"
                  onPress={onClose}
                />
                <ActionSheetItem
                  icon="print-outline"
                  label="In tờ khai hủy tạm trú"
                  onPress={onClose}
                />
                <ActionSheetItem
                  icon="backspace-outline"
                  label="Xóa khách thuê"
                  labelColor="#F2363C"
                  onPress={() => selected && onDelete(selected)}
                />
              </View>
            </ScrollView>

            <TouchableOpacity style={styles.actionCloseButton} onPress={onClose} activeOpacity={0.85}>
              <Text style={styles.actionCloseText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

function ActionSheetItem({
  description,
  icon,
  label,
  labelColor = "#000",
  onPress,
  pro,
}: {
  description?: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  labelColor?: string;
  onPress: () => void;
  pro?: boolean;
}) {
  return (
    <TouchableOpacity style={styles.actionItem} activeOpacity={0.75} onPress={onPress}>
      <Ionicons name={icon} size={21} color="#000" style={styles.actionItemIcon} />
      <View style={styles.actionItemTextWrap}>
        <View style={styles.actionItemTitleRow}>
          <Text style={[styles.actionItemLabel, { color: labelColor }]}>{label}</Text>
          {pro ? (
            <View style={styles.proBadge}>
              <Text style={styles.proBadgeText}>PRO</Text>
            </View>
          ) : null}
        </View>
        {description ? (
          <Text style={styles.actionItemDescription}>{description}</Text>
        ) : null}
      </View>
      <Ionicons name="chevron-forward" size={20} color={Colors.gray600} />
    </TouchableOpacity>
  );
}

function RoomModal({
  onClose,
  onSelect,
  rooms,
  selectedRoom,
  visible,
}: {
  onClose: () => void;
  onSelect: (room: RoomOption | null) => void;
  rooms: RoomOption[];
  selectedRoom: RoomOption | null;
  visible: boolean;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>Chọn phòng</Text>
          <TouchableOpacity
            style={styles.roomOption}
            onPress={() => {
              onSelect(null);
              onClose();
            }}
          >
            <Text style={[styles.roomOptionText, !selectedRoom?.roomId && styles.roomOptionTextActive]}>
              Tất cả phòng
            </Text>
          </TouchableOpacity>
          {rooms.map((room) => {
            const active = selectedRoom?.roomId === room.roomId;
            return (
              <TouchableOpacity
                key={room.roomId}
                style={styles.roomOption}
                onPress={() => onSelect(room)}
              >
                <Text style={[styles.roomOptionText, active && styles.roomOptionTextActive]}>
                  {getRoomName(room)}
                </Text>
              </TouchableOpacity>
            );
          })}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  actionCloseButton: {
    alignItems: "center",
    backgroundColor: Colors.gray200,
    borderRadius: BorderRadius.md,
    justifyContent: "center",
    marginTop: 9,
    minHeight: 44,
  },
  actionCloseText: {
    color: "#000",
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
  },
  actionItem: {
    alignItems: "center",
    borderBottomColor: Colors.gray300,
    borderBottomWidth: 1,
    flexDirection: "row",
    minHeight: 48,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  actionItemDescription: {
    color: Colors.textSecondary,
    fontSize: 11,
    lineHeight: 15,
    marginTop: 2,
  },
  actionItemIcon: {
    marginRight: 12,
    width: 25,
  },
  actionItemLabel: {
    color: "#000",
    flexShrink: 1,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
  },
  actionItemTextWrap: {
    flex: 1,
    paddingRight: 8,
  },
  actionItemTitleRow: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  actionMenu: {
    backgroundColor: Colors.white,
    borderColor: Colors.gray300,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    overflow: "hidden",
  },
  actionMenuScroll: {
    flex: 1,
  },
  actionSheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    flex: 1,
    padding: 8,
    width: "100%",
  },
  actionSheetAnimatedWrap: {
    height: "75%",
    width: "100%",
  },
  actionSheetBackdrop: {
    backgroundColor: "rgba(0,0,0,0.56)",
    flex: 1,
    justifyContent: "flex-end",
  },
  actionSheetDim: {
    flex: 1,
  },
  actionSheetHandle: {
    alignSelf: "center",
    backgroundColor: Colors.white,
    borderRadius: 4,
    height: 7,
    marginBottom: 8,
    width: 48,
  },
  actionWarningBox: {
    alignItems: "center",
    backgroundColor: "#FFF9F6",
    borderColor: ORANGE,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    flexDirection: "row",
    gap: 8,
    marginBottom: 9,
    minHeight: 46,
    paddingHorizontal: 12,
  },
  actionWarningText: {
    color: "#000",
    flex: 1,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
  },
  addAction: {
    alignItems: "center",
    flexDirection: "row",
    gap: 5,
  },
  avatar: {
    alignItems: "center",
    backgroundColor: "#5BC3E6",
    borderColor: Colors.gray300,
    borderRadius: 23,
    borderWidth: 1,
    height: 46,
    justifyContent: "center",
    width: 46,
  },
  backButton: {
    alignItems: "center",
    backgroundColor: Colors.gray50,
    borderColor: Colors.gray300,
    borderRadius: 24,
    borderWidth: 1,
    height: 48,
    justifyContent: "center",
    marginRight: 12,
    width: 48,
  },
  callButton: {
    alignItems: "center",
    backgroundColor: CALL_GREEN,
    borderRadius: 22,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  center: {
    alignItems: "center",
    flex: 1,
    gap: Spacing.sm,
    justifyContent: "center",
    paddingHorizontal: Spacing.xl,
  },
  chatAction: {
    alignItems: "center",
    flexDirection: "row",
    gap: 5,
  },
  closeButton: {
    alignItems: "center",
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.md,
    justifyContent: "center",
    marginTop: Spacing.md,
    minHeight: 48,
  },
  closeButtonText: {
    color: "#000",
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
  },
  container: {
    backgroundColor: PAGE_BG,
    flex: 1,
  },
  countTitle: {
    color: "#000",
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  emptyDesc: {
    color: Colors.textSecondary,
    fontSize: FontSizes.sm,
    textAlign: "center",
  },
  emptyTitle: {
    color: Colors.textPrimary,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
  },
  excelButton: {
    backgroundColor: "#2b7ed7",
    flex: 0.96,
  },
  filterLabel: {
    color: "#000",
    fontSize: FontSizes.sm,
  },
  filterRow: {
    backgroundColor: PAGE_BG,
    flexDirection: "row",
    paddingHorizontal: 8,
  },
  filterValue: {
    color: "#000",
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    marginTop: 3,
  },
  header: {
    alignItems: "center",
    backgroundColor: Colors.white,
    borderBottomColor: Colors.gray100,
    borderBottomWidth: 1,
    flexDirection: "row",
    minHeight: 94,
    paddingBottom: 12,
    paddingHorizontal: 12,
  },
  headerTitle: {
    color: Colors.textPrimary,
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
  },
  listContent: {
    paddingBottom: 18,
  },
  modalBackdrop: {
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.55)",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  modalCard: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: Spacing.lg,
    width: "100%",
  },
  modalTitle: {
    color: "#000",
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    marginBottom: Spacing.sm,
  },
  moreButton: {
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    borderRadius: 22,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  oldTenantButton: {
    backgroundColor: "#000",
    flex: 1.93,
  },
  proBadge: {
    alignItems: "center",
    backgroundColor: ORANGE,
    borderRadius: BorderRadius.full,
    justifyContent: "center",
    paddingHorizontal: 7,
    paddingVertical: 1,
  },
  proBadgeText: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: FontWeights.bold,
  },
  outlineIconButton: {
    alignItems: "center",
    backgroundColor: Colors.white,
    borderColor: "#000",
    borderRadius: 18,
    borderWidth: 1,
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  quickAction: {
    alignItems: "center",
    borderRadius: BorderRadius.md,
    flexDirection: "row",
    gap: 7,
    justifyContent: "center",
    minHeight: 48,
    paddingHorizontal: 8,
    ...Shadows.sm,
  },
  quickActionText: {
    color: Colors.white,
    flexShrink: 1,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
  },
  roomActionText: {
    color: "#000",
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
  },
  roomCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    marginBottom: 8,
    marginHorizontal: 8,
    overflow: "hidden",
    ...Shadows.sm,
  },
  roomCardHeader: {
    alignItems: "center",
    borderBottomColor: Colors.gray300,
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: 7,
    minHeight: 54,
    paddingHorizontal: 10,
  },
  roomFilter: {
    alignItems: "center",
    backgroundColor: Colors.white,
    borderColor: Colors.gray300,
    borderTopLeftRadius: BorderRadius.lg,
    borderWidth: 1,
    flex: 1.05,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 54,
    paddingHorizontal: 12,
  },
  roomHeaderSpacer: {
    flex: 1,
  },
  roomIcon: {
    alignItems: "center",
    backgroundColor: GREEN,
    borderRadius: 18,
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  roomOption: {
    borderBottomColor: Colors.gray200,
    borderBottomWidth: 1,
    justifyContent: "center",
    minHeight: 48,
  },
  roomOptionText: {
    color: "#000",
    fontSize: FontSizes.sm,
  },
  roomOptionTextActive: {
    color: GREEN,
    fontWeight: FontWeights.bold,
  },
  roomTitle: {
    color: "#000",
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    textDecorationLine: "underline",
  },
  searchBox: {
    alignItems: "center",
    backgroundColor: Colors.white,
    borderBottomRightRadius: BorderRadius.lg,
    borderColor: Colors.gray300,
    borderLeftWidth: 0,
    borderTopRightRadius: BorderRadius.lg,
    borderWidth: 1,
    flex: 1.63,
    flexDirection: "row",
    minHeight: 54,
    paddingHorizontal: 14,
  },
  searchInput: {
    color: "#000",
    flex: 1,
    fontSize: FontSizes.sm,
    paddingVertical: 8,
  },
  statusDot: {
    backgroundColor: ORANGE,
    borderRadius: 6,
    height: 8,
    width: 8,
  },
  statusPill: {
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    borderRadius: BorderRadius.full,
    flexDirection: "row",
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  statusText: {
    color: "#000",
    fontSize: 11,
    fontWeight: FontWeights.medium,
  },
  tenantInfo: {
    flex: 1,
    minWidth: 96,
  },
  tenantName: {
    color: "#000",
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
  },
  tenantPhone: {
    color: "#000",
    fontSize: FontSizes.sm,
    marginTop: 2,
  },
  tenantRow: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 9,
    paddingHorizontal: 10,
    paddingVertical: 14,
  },
  tenantStatusRow: {
    flexBasis: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 55,
  },
  topActions: {
    flexDirection: "row",
    gap: 8,
    padding: 8,
  },
  warningRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 4,
    marginTop: 6,
  },
  warningText: {
    color: ORANGE,
    fontSize: FontSizes.sm,
  },
});
