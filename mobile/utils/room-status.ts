/**
 * Utility functions for Room Status filtering and formatting
 * Tuân thủ: CODING_STANDARDS.md
 */

/**
 * Kiểm tra phòng có trạng thái cọc / giữ chỗ
 */
export function isDeposited(r: any): boolean {
  const rs = r?.roomReservation?.status || r?.reserveAPlace?.status;
  return (
    rs === "DEPOSITED" ||
    rs === "Stake" ||
    r?.latestContract?.status === "DEPOSITED" ||
    r?.status === "RESERVED"
  );
}

/**
 * Kiểm tra phòng đang thuê (hợp đồng ACTIVE hoặc đang ở)
 */
export function isRenting(r: any): boolean {
  const s = r?.latestContract?.status;
  return s === "ACTIVE" || s === "EXPIRING" || s === "IATExpire";
}

/**
 * Kiểm tra phòng sắp kết thúc hợp đồng (trong vòng 30 ngày)
 */
export function isExpiring(r: any, now: number = Date.now()): boolean {
  const s = r?.latestContract?.status;
  if (s === "EXPIRING" || s === "IATExpire") return true;
  if (s === "ACTIVE" && r?.latestContract?.closeContract) {
    const closeTime = new Date(r.latestContract.closeContract).getTime();
    const diffDays = (closeTime - now) / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays <= 30;
  }
  return false;
}

/**
 * Kiểm tra phòng báo kết thúc hợp đồng
 */
export function isReportedLeaving(r: any): boolean {
  const s = r?.latestContract?.status;
  return (
    s === "TERMINATED" ||
    s === "ReportEnd" ||
    Boolean(r?.latestContract?.reportCloseContract)
  );
}

/**
 * Kiểm tra phòng quá hạn hợp đồng
 */
export function isOverdue(r: any, now: number = Date.now()): boolean {
  const s = r?.latestContract?.status;
  if (s === "OVERDUE") return true;
  if (s === "ACTIVE" && r?.latestContract?.closeContract) {
    return new Date(r.latestContract.closeContract).getTime() < now;
  }
  return false;
}

/**
 * Kiểm tra phòng đang nợ tiền
 */
export function isDebt(r: any): boolean {
  const roomDebt = Number(r?.debt) || 0;
  const contractDebt = Number(r?.latestContract?.debt) || 0;
  return roomDebt > 0 || contractDebt > 0;
}

/**
 * Kiểm tra phòng có thể cho thuê
 */
export function isAvailable(r: any): boolean {
  const s = r?.latestContract?.status;
  const hasActiveContract = Boolean(s && s !== "ENDED");
  return (!hasActiveContract && !isDeposited(r)) || r?.status === "AVAILABLE";
}

/**
 * Tính số tiền khách nợ của phòng
 */
export function getCustomerDebt(r: any): number {
  return Number(r?.debt) || Number(r?.latestContract?.debt) || 0;
}

/**
 * Tính số tiền khách thuê đặt cọc khi ở
 * Chỉ tính cho phòng có hợp đồng đang có hiệu lực hoặc đang ở
 */
export function getRoomDeposit(r: any): number {
  const hasActiveContract = r?.latestContract && r.latestContract.status !== "ENDED";
  if (hasActiveContract || isRenting(r)) {
    return Number(r?.latestContract?.deposit) || Number(r?.deposit) || 0;
  }
  return 0;
}

/**
 * Tính số tiền khách cọc giữ chỗ
 */
export function getHoldingDeposit(r: any): number {
  if (isDeposited(r)) {
    return (
      Number(r?.roomReservation?.deposit) ||
      Number(r?.reserveAPlace?.deposit) ||
      Number(r?.deposit) ||
      0
    );
  }
  return (
    Number(r?.roomReservation?.deposit) ||
    Number(r?.reserveAPlace?.deposit) ||
    0
  );
}

/**
 * Định dạng tiền tệ VND
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("vi-VN").format(amount || 0) + " đ";
}

/**
 * Định dạng ngày tháng DD/MM/YYYY
 */
export function formatDisplayDate(dateStr?: string | null): string {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return String(dateStr);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return String(dateStr);
  }
}

/**
 * Lấy thông tin khách thuê hoặc người cọc
 */
export function getTenantInfo(room: any): { name: string; phone: string } {
  // 1. Kiểm tra từ roomReservation
  if (room?.roomReservation?.nameTenant || room?.roomReservation?.phoneTenant) {
    return {
      name: room.roomReservation.nameTenant || "Khách cọc",
      phone: room.roomReservation.phoneTenant || "",
    };
  }

  // 2. Kiểm tra từ reserveAPlace
  if (room?.reserveAPlace?.nameTenant || room?.reserveAPlace?.phoneTenant) {
    return {
      name: room.reserveAPlace.nameTenant || "Khách cọc",
      phone: room.reserveAPlace.phoneTenant || "",
    };
  }

  // 3. Kiểm tra từ latestContract
  const contract = room?.latestContract;
  if (contract) {
    if (contract.tenant) {
      return {
        name: contract.tenant.fullname || contract.tenant.name || "Khách thuê",
        phone: contract.tenant.phone || contract.tenant.phoneNumber || "",
      };
    }
    if (contract.tenants && Array.isArray(contract.tenants) && contract.tenants.length > 0) {
      const firstTenant = contract.tenants[0];
      return {
        name: firstTenant.fullname || firstTenant.name || "Khách thuê",
        phone: firstTenant.phone || firstTenant.phoneNumber || "",
      };
    }
    if (contract.tenantName || contract.phone) {
      return {
        name: contract.tenantName || "Khách thuê",
        phone: contract.phone || contract.phoneNumber || "",
      };
    }
  }

  return {
    name: "Khách thuê",
    phone: "",
  };
}

/**
 * Trích xuất danh sách tầng từ danh sách phòng
 */
export function extractUniqueFloors(rooms: any[]): string[] {
  if (!rooms || rooms.length === 0) {
    return ["Tất cả", "Tầng trệt"];
  }
  const groups = rooms.map((r) => r.group?.trim() || "Tầng trệt");
  const unique = Array.from(new Set(groups)).sort((a, b) => {
    const getOrder = (name: string) => {
      const lower = name.toLowerCase();
      if (lower.includes("trệt") || lower.includes("tret")) return 0;
      const num = parseInt(lower.replace(/\D/g, ""), 10);
      return isNaN(num) ? 999 : num;
    };
    return getOrder(a) - getOrder(b);
  });
  return ["Tất cả", ...unique];
}
