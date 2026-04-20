package com.rrms.rrms.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import com.rrms.rrms.dto.request.RoleRequest;
import com.rrms.rrms.dto.response.RoleResponse;
import com.rrms.rrms.models.Role;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE) // Mapper sá»­ dá»¥ng MapStruct
public interface RoleMapper {

    // Chuyá»ƒn Ä‘á»•i tá»« RoleRequest sang Role
    @Mapping(
            target = "description",
            source =
                    "roleDescription") // Thiáº¿t láº­p ráº±ng trÆ°á»ng "description" trong Role sáº½ nháº­n giÃ¡ trá»‹
    // tá»« trÆ°á»ng
    // "roleDescription" trong RoleRequest
    @Mapping(
            target = "permissions",
            ignore = true) // Bá» qua trÆ°á»ng "permissions" trong Role, khÃ´ng chuyá»ƒn Ä‘á»•i tá»« RoleRequest
    Role toRole(
            RoleRequest request); // PhÆ°Æ¡ng thá»©c nÃ y nháº­n má»™t RoleRequest vÃ  tráº£ vá» Ä‘á»‘i tÆ°á»£ng Role

    // Chuyá»ƒn Ä‘á»•i tá»« Role sang RoleResponse
    @Mapping(
            target = "roleDescription",
            source = "description") // Thiáº¿t láº­p ráº±ng trÆ°á»ng "roleDescription" trong RoleResponse sáº½ nháº­n
    // giÃ¡ trá»‹ tá»«
    // trÆ°á»ng "description" trong Role
    @Mapping(
            target = "roleId",
            source = "roleId") // Thiáº¿t láº­p ráº±ng trÆ°á»ng "roleId" trong RoleResponse sáº½ nháº­n giÃ¡ trá»‹ tá»«
    // trÆ°á»ng "roleId"
    // trong Role
    RoleResponse toRoleResponse(
            Role role); // PhÆ°Æ¡ng thá»©c nÃ y nháº­n má»™t Role vÃ  tráº£ vá» Ä‘á»‘i tÆ°á»£ng RoleResponse
}
