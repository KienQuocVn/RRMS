package com.rrms.rrms.mapper;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import com.rrms.rrms.dto.request.AccountRequest;
import com.rrms.rrms.dto.response.AccountResponse;
import com.rrms.rrms.dto.response.BrokerResponse;
import com.rrms.rrms.models.Account;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public abstract class AccountMapper {

    // Nhận một AccountRequest và trả về đối tượng Account
    @Mapping(target = "authorities", ignore = true)
    @Mapping(target = "commissionRate", ignore = true)
    @Mapping(target = "contracts", ignore = true)
    @Mapping(target = "motels", ignore = true)
    @Mapping(target = "favoriteBulletinBoards", ignore = true)
    public abstract Account toAccount(AccountRequest request);

    // Chuyển đổi từ Account sang AccountResponse
    @Mapping(target = "role", expression = "java(mapRole(account))")
    @Mapping(target = "permissions", expression = "java(mapPermissions(account))")
    @Mapping(target = "password", ignore = true)
    public abstract AccountResponse toAccountResponse(Account account);

    // Phương thức để cập nhật thông tin của tài khoản người dùng mà không thay đổi mật khẩu
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "authorities", ignore = true)
    @Mapping(target = "commissionRate", ignore = true)
    @Mapping(target = "contracts", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "motels", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "favoriteBulletinBoards", ignore = true)
    public abstract void updateAccount(@MappingTarget Account user, AccountRequest request);

    @Mapping(target = "name", source = "fullName")
    @Mapping(target = "status", ignore = true)
    public abstract BrokerResponse toBrokerResponse(Account account);

    // Phương thức để ánh xạ vai trò từ đối tượng Account
    @Named("mapRole")
    public List<String> mapRole(Account account) {
        if (account.getAuthorities() != null && !account.getAuthorities().isEmpty()) {
            return account.getAuthorities().stream()
                    .map(auth -> auth.getRole().getRoleName().name())
                    .collect(Collectors.toList());
        }
        return Collections.emptyList();
    }

    // Phương thức để ánh xạ quyền từ các vai trò
    @Named("mapPermissions")
    public List<String> mapPermissions(Account account) {
        if (account.getAuthorities() != null && !account.getAuthorities().isEmpty()) {
            return account.getAuthorities().stream()
                    .flatMap(auth -> auth.getRole().getPermissions().stream())
                    .map(permission -> permission.getName())
                    .distinct()
                    .collect(Collectors.toList());
        }
        return Collections.emptyList();
    }
}
