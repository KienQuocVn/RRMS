package com.rrms.rrms.database.seed;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import com.rrms.rrms.enums.Gender;
import com.rrms.rrms.enums.Roles;
import com.rrms.rrms.models.Account;
import com.rrms.rrms.models.Auth;
import com.rrms.rrms.models.Permission;
import com.rrms.rrms.models.Role;
import com.rrms.rrms.repositories.AccountRepository;
import com.rrms.rrms.repositories.AuthRepository;
import com.rrms.rrms.repositories.PermissionRepository;
import com.rrms.rrms.repositories.RoleRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * AccountSeeder - Seed dữ liệu Roles, Permissions và Accounts.
 * Thứ tự chạy: 1 (không phụ thuộc seeder khác)
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class AccountSeeder {

    private static final String DEFAULT_PASSWORD = "123456789";

    private final AccountRepository accountRepository;
    private final AuthRepository authRepository;
    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;

    // ── Roles & Permissions ───────────────────────────────────────────────────

    public void seedRolesAndPermissions() {
        log.info("[AccountSeeder] Seeding Roles & Permissions...");
        Map<String, Permission> pMap = new HashMap<>();
        String[] perms = {
            "CREATE_HOST",
            "UPDATE_HOST",
            "DELETE_HOST",
            "APPROVE_POST",
            "CREATE_MOTEL",
            "CREATE_ROOM",
            "CREATE_CONTRACT",
            "VIEW_REPORT"
        };
        for (String p : perms) {
            pMap.put(
                    p,
                    permissionRepository.save(Permission.builder()
                            .name(p)
                            .description("Permission for " + p)
                            .build()));
        }

        roleRepository.save(Role.builder()
                .roleName(Roles.ADMIN)
                .description("Full access")
                .permissions(new HashSet<>(pMap.values()))
                .build());
        roleRepository.save(Role.builder()
                .roleName(Roles.HOST)
                .description("Landlord access")
                .permissions(Set.of(pMap.get("CREATE_MOTEL"), pMap.get("CREATE_ROOM"), pMap.get("CREATE_CONTRACT")))
                .build());
        roleRepository.save(Role.builder()
                .roleName(Roles.CUSTOMER)
                .description("Tenant access")
                .permissions(new HashSet<>())
                .build());
        roleRepository.save(Role.builder()
                .roleName(Roles.EMPLOYEE)
                .description("Staff access")
                .permissions(new HashSet<>())
                .build());
        roleRepository.save(Role.builder()
                .roleName(Roles.BROKER)
                .description("Broker access")
                .permissions(new HashSet<>())
                .build());
        roleRepository.save(Role.builder()
                .roleName(Roles.GUEST)
                .description("Guest access")
                .permissions(new HashSet<>())
                .build());
    }

    // ── Accounts ──────────────────────────────────────────────────────────────

    public Account seedAdmin() {
        return createAccount(
                "admin", "Kiều Kiến Quốc Admin", "kieukienquocvn@gmail.com", "0919925302", "001001001001", Gender.MALE);
    }

    public Account seedHost() {
        return createAccount("host", "Kiều Kiến Quốc", "host@rrms.vn", "0911000002", "001001001002", Gender.FEMALE);
    }

    public Account seedEmployee() {
        return createAccount(
                "employee", "Kiều Kiến Quốc", "employee@rrms.vn", "0911000003", "001001001003", Gender.MALE);
    }

    public Account seedCustomer() {
        return createAccount(
                "customer", "Kiều Kiến Quốc", "customer@rrms.vn", "0911000004", "001001001004", Gender.FEMALE);
    }

    // ── Internal ──────────────────────────────────────────────────────────────

    private Account createAccount(String user, String name, String email, String phone, String cccd, Gender gender) {
        BCryptPasswordEncoder pe = new BCryptPasswordEncoder();
        Account acc = Account.builder()
                .username(user)
                .password(pe.encode(DEFAULT_PASSWORD))
                .fullName(name)
                .email(email)
                .phone(phone)
                .cccd(cccd)
                .gender(gender)
                .birthday(LocalDate.of(1995, 1, 1))
                .avatar("https://picsum.photos/seed/" + user + "/200/200")
                .build();
        acc = accountRepository.save(acc);

        Roles rName =
                switch (user) {
                    case "admin" -> Roles.ADMIN;
                    case "host" -> Roles.HOST;
                    case "employee" -> Roles.EMPLOYEE;
                    case "broker" -> Roles.BROKER;
                    default -> Roles.CUSTOMER;
                };

        Auth auth = new Auth();
        auth.setAccount(acc);
        auth.setRole(roleRepository.findByRoleName(rName).orElseThrow());
        authRepository.save(auth);
        return acc;
    }
}
