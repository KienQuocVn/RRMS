package com.rrms.rrms.services.servicesImp;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.rrms.rrms.dto.request.RoleRequest;
import com.rrms.rrms.dto.response.RoleResponse;
import com.rrms.rrms.enums.Roles;
import com.rrms.rrms.mapper.RoleMapper;
import com.rrms.rrms.models.Permission;
import com.rrms.rrms.models.Role;
import com.rrms.rrms.repositories.PermissionRepository;
import com.rrms.rrms.repositories.RoleRepository;
import com.rrms.rrms.services.IRoleService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class RoleServiceImp implements IRoleService {

    final RoleRepository roleRepository;

    final PermissionRepository permissionRepository;

    final RoleMapper roleMapper;

    @Override
    public List<RoleResponse> GetAllRoles() {
        return roleRepository.findAll().stream().map(roleMapper::toRoleResponse).toList();
    }

    @Override
    public RoleResponse createRole(RoleRequest roleRequest) {
        var role = roleMapper.toRole(roleRequest);

        // TÃ¬m cÃ¡c permission báº±ng tÃªn thay vÃ¬ UUID
        Set<Permission> permissions = roleRequest.getPermissions().stream()
                .map(permissionName -> permissionRepository
                        .findByName(permissionName)
                        .orElseThrow(() -> new RuntimeException("Permission not found: " + permissionName)))
                .collect(Collectors.toSet());

        role.setPermissions(permissions);
        role.setDescription(roleRequest.getRoleDescription());

        role = roleRepository.save(role);
        return roleMapper.toRoleResponse(role);
    }

    @Override
    public RoleResponse updateRole(RoleRequest roleRequest) {
        // TÃ¬m Role theo ID
        Role existingRole = roleRepository
                .findById(roleRequest.getRoleId())
                .orElseThrow(() -> new RuntimeException("Role not found"));

        Roles roleEnum = Roles.valueOf(roleRequest.getRoleName());

        existingRole.setRoleName(roleEnum);
        existingRole.setDescription(roleRequest.getRoleDescription());

        // LÆ°u láº¡i role Ä‘Ã£ cáº­p nháº­t
        existingRole = roleRepository.save(existingRole);
        return roleMapper.toRoleResponse(existingRole);
    }

    @Override
    public void deleteRole(UUID id) {
        if (!roleRepository.existsById(id)) {
            throw new RuntimeException("Role not found");
        }
        roleRepository.deleteById(id);
    }

    @Override
    public Optional<Role> findByRoleName(Roles roleName) {
        return roleRepository.findByRoleName(roleName);
    }

    @Override
    public RoleResponse findById(UUID id) {
        return roleMapper.toRoleResponse(
                roleRepository.findById(id).orElseThrow(() -> new RuntimeException("Role not found")));
    }
}
