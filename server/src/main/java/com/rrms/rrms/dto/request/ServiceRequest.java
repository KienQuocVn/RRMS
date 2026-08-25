package com.rrms.rrms.dto.request;

import java.util.Set;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ServiceRequest {

    @NotBlank(message = "Loại dịch vụ không được để trống")
    String typeService;

    @NotBlank(message = "Tên dịch vụ không được để trống")
    String nameService;

    /**
     * Đơn vị tính – chỉ chấp nhận các giá trị trong VALID_UNITS.
     */
    @NotBlank(message = "Đơn vị tính không được để trống")
    @Pattern(
            regexp = "kWh|Khối|mét khối|Người|Tháng|Lần|Cái|Chiếc",
            message = "Đơn vị không hợp lệ. Chỉ chấp nhận: kWh, Khối, mét khối, Người, Tháng, Lần, Cái, Chiếc")
    String unit;

    /** Tập hợp đơn vị hợp lệ (để tham chiếu từ code khác). */
    Set<String> VALID_UNITS = Set.of("kWh", "Khối", "mét khối", "Người", "Tháng", "Lần", "Cái", "Chiếc");
}
