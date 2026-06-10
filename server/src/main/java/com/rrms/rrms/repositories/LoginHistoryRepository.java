package com.rrms.rrms.repositories;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.rrms.rrms.models.LoginHistory;

@Repository
public interface LoginHistoryRepository extends JpaRepository<LoginHistory, UUID> {

    /** Lấy toàn bộ lịch sử đăng nhập của một tài khoản, sắp xếp mới nhất trước */
    List<LoginHistory> findByUsernameOrderByLoginAtDesc(String username);

    /** Xóa tất cả lịch sử đăng nhập theo username */
    void deleteByUsername(String username);
}
