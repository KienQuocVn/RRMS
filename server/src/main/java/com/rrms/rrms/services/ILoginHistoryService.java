package com.rrms.rrms.services;

import java.util.List;
import java.util.UUID;

import jakarta.servlet.http.HttpServletRequest;

import com.rrms.rrms.dto.response.LoginHistoryResponse;
import com.rrms.rrms.models.Account;

public interface ILoginHistoryService {

    /**
     * Ghi nhận lịch sử đăng nhập thành công.
     * Được gọi ngay sau khi xác thực tài khoản thành công.
     *
     * @param account Tài khoản vừa đăng nhập
     * @param request HTTP request để lấy IP và User-Agent
     */
    void recordLoginSuccess(Account account, HttpServletRequest request);

    /**
     * Lấy danh sách lịch sử đăng nhập của một tài khoản
     */
    List<LoginHistoryResponse> getLoginHistoryByUsername(String username);

    /**
     * Xóa một bản ghi lịch sử đăng nhập cụ thể theo ID
     */
    void deleteLoginHistory(UUID historyId, String requestingUsername);
}
