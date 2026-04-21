package com.rrms.rrms.services.servicesImp;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.rrms.rrms.dto.request.PermissionRequest;
import com.rrms.rrms.dto.response.PermissionResponse;
import com.rrms.rrms.enums.ErrorCode;
import com.rrms.rrms.exceptions.AppException;
import com.rrms.rrms.mapper.PermissionMapper;
import com.rrms.rrms.models.Permission;
import com.rrms.rrms.repositories.PermissionRepository;
import com.rrms.rrms.services.IPermissionService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Slf4j
public class PermissionService implements IPermissionService {

    PermissionRepository permissionRepository;
    PermissionMapper permissionMapper;

    @Override
    public List<PermissionResponse> getAllPermissions() {
        return permissionRepository.findAll().stream()
                .map(permissionMapper::toPermissionResponse)
                .toList();
    }

    @Override
    public PermissionResponse createPermission(PermissionRequest permissionRequest) {
        Permission permission = permissionRepository.save(permissionMapper.toPermission(permissionRequest));
        log.info("Permission saved: {}", permission.getName());
        return permissionMapper.toPermissionResponse(permission);
    }

    @Override
    public PermissionResponse updatePermission(PermissionRequest permissionRequest) {
        Permission existingPermission = permissionRepository
                .findById(permissionRequest.getPermissionId())
                .orElseThrow(() -> new AppException(ErrorCode.PERMISSION_NOT_FOUND));

        existingPermission.setName(permissionRequest.getName());
        existingPermission.setDescription(permissionRequest.getDescription());

        return permissionMapper.toPermissionResponse(permissionRepository.save(existingPermission));
    }

    @Override
    public void deletePermission(UUID id) {
        if (!permissionRepository.existsById(id)) {
            throw new AppException(ErrorCode.PERMISSION_NOT_FOUND);
        }
        permissionRepository.deleteById(id);
    }

    @Override
    public PermissionResponse getPermissionById(Long id) {
        return null;
    }
}
