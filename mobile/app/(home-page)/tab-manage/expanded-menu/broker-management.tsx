import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import {
  Colors,
  Spacing,
  FontSizes,
  FontWeights,
  BorderRadius,
  Shadows,
} from "@/constants/theme";
import { useAuth } from "@/hooks/use-auth";
import { motelService } from "@/services/api/motel.service";
import { brokerService } from "@/services/api/broker.service";
import { safeAsyncStorage } from "@/services/storage/safe-async-storage";
import { Broker } from "@/types/broker.types";

export default function BrokerManagementScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const user = useAuth((state) => state.user);
  const [motelId, setMotelId] = useState("");
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedBroker, setSelectedBroker] = useState<Broker | null>(null);
  const [showActionSheet, setShowActionSheet] = useState(false);

  const loadBrokers = useCallback(async () => {
    if (!user?.username) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await motelService.getMotelsByAccount(user.username);
      const motels = response?.result ?? [];
      const storedId = await safeAsyncStorage.getItem("rrms_active_motel_id");
      const motel =
        motels.find((item) => item.motelId === storedId) ?? motels[0];
      if (!motel?.motelId) {
        setMotelId("");
        setBrokers([]);
        return;
      }
      setMotelId(motel.motelId);
      await safeAsyncStorage.setItem("rrms_active_motel_id", motel.motelId);
      const brokerResponse = await brokerService.getByMotel(motel.motelId);
      setBrokers(brokerResponse?.result ?? []);
    } catch (error: any) {
      Alert.alert(
        "Lỗi",
        error?.response?.data?.message || "Không thể tải danh sách môi giới.",
      );
    } finally {
      setLoading(false);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      loadBrokers();
    }, [loadBrokers]),
  );

  const filteredBrokers = useMemo(() => {
    const term = query.trim().toLocaleLowerCase("vi");
    if (!term) return brokers;
    return brokers.filter((broker) =>
      `${broker.name} ${broker.phone} ${broker.source}`
        .toLocaleLowerCase("vi")
        .includes(term),
    );
  }, [brokers, query]);

  const openForm = (broker?: Broker) => {
    if (!motelId) {
      Alert.alert(
        "Chưa chọn nhà trọ",
        "Vui lòng tạo hoặc chọn nhà trọ trước khi quản lý môi giới.",
      );
      return;
    }
    router.push({
      pathname: "/(home-page)/tab-manage/expanded-menu/broker-form",
      params: {
        motelId,
        ...(broker ? { broker: JSON.stringify(broker) } : {}),
      },
    });
  };

  const confirmDelete = (broker: Broker) =>
    Alert.alert("Xóa môi giới", `Bạn có chắc muốn xóa ${broker.name}?`, [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          setShowActionSheet(false);
          try {
            await brokerService.delete(broker.brokerId);
            setBrokers((current) =>
              current.filter((item) => item.brokerId !== broker.brokerId),
            );
          } catch (error: any) {
            Alert.alert(
              "Không thể xóa",
              error?.response?.data?.message ||
                "Môi giới có thể đang được dùng trong hợp đồng.",
            );
          }
        },
      },
    ]);

  const showActions = (broker: Broker) => {
    setSelectedBroker(broker);
    setShowActionSheet(true);
  };

  const closeActionSheet = () => setShowActionSheet(false);

  const renderBroker = ({ item }: { item: Broker }) => (
    <View style={styles.brokerRow}>
      <View style={styles.avatar}>
        <Ionicons name="person" size={34} color={Colors.white} />
      </View>
      <View style={styles.brokerInfo}>
        <Text numberOfLines={1} style={styles.brokerName}>
          {item.name}
        </Text>
        <Text style={styles.phone}>{item.phone}</Text>
        <View style={styles.tagsRow}>
          <View style={styles.tag}>
            <View style={styles.greenDot} />
            <Text numberOfLines={1} style={styles.tagText}>
              {item.source || "Môi giới"}
            </Text>
          </View>
        </View>
      </View>
      <Text style={styles.commission}>{item.commissionRate}%</Text>
      <TouchableOpacity
        style={styles.moreButton}
        onPress={() => showActions(item)}
        accessibilityLabel={`Thao tác với ${item.name}`}
      >
        <Ionicons
          name="ellipsis-vertical"
          size={22}
          color={Colors.textPrimary}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
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
          accessibilityLabel="Quay lại"
        >
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>Quản lý môi giới</Text>
          <Text style={styles.headerSubtitle}>
            Dẫn khách, lấp phòng cấp tốc
          </Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.success} />
        </View>
      ) : (
        <FlatList
          data={filteredBrokers}
          keyExtractor={(item) => item.brokerId}
          renderItem={renderBroker}
          contentContainerStyle={
            filteredBrokers.length ? styles.listContent : styles.emptyList
          }
          onRefresh={loadBrokers}
          refreshing={loading}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons
                name="people-outline"
                size={54}
                color={Colors.gray400}
              />
              <Text style={styles.emptyTitle}>
                {query ? "Không tìm thấy môi giới" : "Chưa có môi giới"}
              </Text>
              <Text style={styles.emptyDesc}>
                Thêm môi giới để quản lý nguồn khách và mức hoa hồng.
              </Text>
            </View>
          }
        />
      )}

      <TouchableOpacity
        style={[styles.fab, { bottom: 104 + insets.bottom }]}
        onPress={() => openForm()}
        accessibilityLabel="Thêm môi giới mới"
      >
        <Ionicons name="add" size={32} color={Colors.white} />
      </TouchableOpacity>
      <View
        style={[
          styles.bottomSearchBar,
          { paddingBottom: Math.max(insets.bottom, Spacing.md) },
        ]}
      >
        <View style={styles.searchBox}>
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder="Nhập tên/sđt môi giới"
            placeholderTextColor={Colors.gray400}
            returnKeyType="search"
          />
          <Ionicons name="search" size={24} color={Colors.textPrimary} />
        </View>
      </View>

      <Modal
        visible={showActionSheet}
        transparent
        animationType="slide"
        onRequestClose={closeActionSheet}
        statusBarTranslucent
      >
        <View style={styles.sheetRoot}>
          <Pressable style={styles.sheetBackdrop} onPress={closeActionSheet} />
          <View style={[styles.actionSheet, { paddingBottom: Math.max(insets.bottom, Spacing.md) }]}>
            <View style={styles.sheetHandle} />
            <View style={styles.sheetHeader}>
              <View style={styles.sheetIcon}><Ionicons name="pricetag-outline" size={27} color={Colors.textPrimary} /></View>
              <View style={styles.sheetTitleWrap}>
                <Text style={styles.sheetTitle}>Môi giới “{selectedBroker?.name}”</Text>
                <Text style={styles.sheetSubtitle}>Menu thao tác cho môi giới</Text>
              </View>
            </View>
            <View style={styles.sheetStatus}>
              <Ionicons name="information-circle-outline" size={23} color="#E87524" />
              <Text style={styles.sheetStatusText}>{selectedBroker?.phone} · Hoa hồng {selectedBroker?.commissionRate}%</Text>
            </View>
            <View style={styles.actionList}>
              <TouchableOpacity style={styles.actionRow} onPress={() => {
                const broker = selectedBroker;  
                closeActionSheet();
                if (broker) openForm(broker);
              }}>
                <Ionicons name="create-outline" size={25} color={Colors.textPrimary} />
                <Text style={styles.actionText}>Chỉnh sửa môi giới</Text>
                <Ionicons name="chevron-forward" size={22} color={Colors.gray500} />
              </TouchableOpacity>
              <View style={styles.actionDivider} />
              <TouchableOpacity style={styles.actionRow} onPress={() => selectedBroker && confirmDelete(selectedBroker)}>
                <Ionicons name="close-circle-outline" size={25} color={Colors.textPrimary} />
                <View style={styles.actionCopy}>
                  <Text style={styles.deleteActionText}>Xóa môi giới</Text>
                  <Text style={styles.actionHint}>Xóa môi giới khỏi danh sách nhà trọ</Text>
                </View>
                <Ionicons name="chevron-forward" size={22} color={Colors.gray500} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#EAF0EF" },
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
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
    backgroundColor: Colors.gray100,
  },
  headerTitleWrap: { flex: 1 },
  headerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
    marginTop: 2,
  },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  listContent: { paddingBottom: 130 },
  emptyList: { flexGrow: 1, paddingBottom: 130 },
  brokerRow: {
    minHeight: 112,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: "#E8EEEE",
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#2479E8",
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  brokerInfo: { flex: 1, minWidth: 0 },
  brokerName: {
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
    fontWeight: FontWeights.medium,
  },
  phone: { fontSize: FontSizes.md, color: Colors.textPrimary, marginTop: 2 },
  tagsRow: { flexDirection: "row", marginTop: 7 },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F2F3",
    borderRadius: 14,
    paddingHorizontal: 8,
    paddingVertical: 4,
    maxWidth: 160,
  },
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#17A34A",
    marginRight: 5,
  },
  tagText: { fontSize: FontSizes.xs, color: Colors.textPrimary },
  commission: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: "#2b7ed7",
    marginHorizontal: Spacing.sm,
  },
  moreButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: Colors.gray100,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 4,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing["2xl"],
  },
  emptyTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginTop: Spacing.md,
  },
  emptyDesc: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: Spacing.xs,
  },
  fab: {
    position: "absolute",
    right: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#2b7ed7",
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.lg,
  },
  bottomSearchBar: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  searchBox: {
    height: 54,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.white,
  },
  searchInput: {
    flex: 1,
    height: "100%",
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
  },
  sheetRoot: { flex: 1, justifyContent: "flex-end" },
  sheetBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.52)" },
  actionSheet: { backgroundColor: Colors.white, borderTopLeftRadius: 22, borderTopRightRadius: 22, paddingHorizontal: Spacing.base, paddingTop: 10 },
  sheetHandle: { width: 48, height: 5, borderRadius: 3, backgroundColor: Colors.gray400, alignSelf: "center", marginBottom: Spacing.md },
  sheetHeader: { flexDirection: "row", alignItems: "center", paddingBottom: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  sheetIcon: { width: 54, height: 54, borderRadius: 27, backgroundColor: Colors.gray100, alignItems: "center", justifyContent: "center", marginRight: Spacing.md },
  sheetTitleWrap: { flex: 1 },
  sheetTitle: { fontSize: FontSizes.md, fontWeight: FontWeights.bold, color: Colors.textPrimary },
  sheetSubtitle: { fontSize: FontSizes.sm, color: Colors.textSecondary, marginTop: 3 },
  sheetStatus: { minHeight: 58, flexDirection: "row", alignItems: "center", gap: 8, borderWidth: 1, borderColor: "#F59A58", backgroundColor: "#FFF8F3", borderRadius: BorderRadius.md, paddingHorizontal: Spacing.md, marginVertical: Spacing.md },
  sheetStatusText: { flex: 1, fontSize: FontSizes.sm, color: Colors.textPrimary },
  actionList: { borderWidth: 1, borderColor: Colors.borderLight, borderRadius: BorderRadius.lg, overflow: "hidden" },
  actionRow: { minHeight: 70, flexDirection: "row", alignItems: "center", gap: Spacing.md, paddingHorizontal: Spacing.md },
  actionText: { flex: 1, fontSize: FontSizes.md, fontWeight: FontWeights.bold, color: Colors.textPrimary },
  actionCopy: { flex: 1 },
  deleteActionText: { fontSize: FontSizes.md, fontWeight: FontWeights.bold, color: "#E53935" },
  actionHint: { fontSize: FontSizes.sm, color: Colors.textSecondary, marginTop: 3 },
  actionDivider: { height: 1, backgroundColor: Colors.borderLight, marginLeft: 52 },
});
