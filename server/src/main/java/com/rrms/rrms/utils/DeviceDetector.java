package com.rrms.rrms.utils;

import jakarta.servlet.http.HttpServletRequest;

/**
 * DeviceDetector - Senior-level utility để phân tích User-Agent và Client Hints
 * Phát hiện loại thiết bị, hệ điều hành, trình duyệt thực tế từ Client Request
 */
public final class DeviceDetector {

    private DeviceDetector() {}

    /**
     * Lấy địa chỉ IP thực của client, xử lý cả trường hợp qua proxy/load-balancer
     */
    public static String extractClientIp(HttpServletRequest request) {
        String[] headers = {
            "X-Forwarded-For",
            "Proxy-Client-IP",
            "WL-Proxy-Client-IP",
            "HTTP_X_FORWARDED_FOR",
            "HTTP_X_FORWARDED",
            "HTTP_FORWARDED_FOR",
            "HTTP_FORWARDED",
            "HTTP_CLIENT_IP"
        };

        for (String header : headers) {
            String ip = request.getHeader(header);
            if (ip != null && !ip.isEmpty() && !"unknown".equalsIgnoreCase(ip)) {
                return ip.split(",")[0].trim();
            }
        }

        return request.getRemoteAddr();
    }

    /**
     * Phát hiện loại thiết bị từ User-Agent
     * @return "MOBILE", "TABLET", "LAPTOP", hoặc "PC"
     */
    public static String detectDeviceType(String userAgent) {
        if (userAgent == null || userAgent.isBlank()) return "LAPTOP";

        String ua = userAgent.toLowerCase();

        // Kiểm tra tablet
        if (ua.contains("ipad") || ua.contains("tablet") || (ua.contains("android") && !ua.contains("mobile"))) {
            return "TABLET";
        }

        // Kiểm tra mobile
        if (ua.contains("mobile")
                || ua.contains("iphone")
                || ua.contains("ipod")
                || ua.contains("blackberry")
                || ua.contains("windows phone")) {
            return "MOBILE";
        }

        // Đa số máy tính đăng nhập hệ thống quản lý là Laptop
        return "LAPTOP";
    }

    /**
     * Phát hiện tên hệ điều hành từ User-Agent và Client Hints (Sec-CH-UA-Platform-Version)
     */
    public static String detectOsName(String userAgent, String platformVersion) {
        if (userAgent == null || userAgent.isBlank()) return "Windows 11";

        String ua = userAgent.toLowerCase();

        if (ua.contains("windows")) {
            if (platformVersion != null && !platformVersion.isBlank()) {
                String cleanVer = platformVersion.replaceAll("\"", "").trim();
                try {
                    String[] parts = cleanVer.split("\\.");
                    int major = Integer.parseInt(parts[0]);
                    if (major >= 13) return "Windows 11";
                    if (major > 0 && major < 13) return "Windows 10";
                } catch (Exception ignored) {
                }
            }
            if (ua.contains("windows nt 11") || ua.contains("windows 11")) return "Windows 11";
            // Do Windows 11 gửi User-Agent Windows NT 10.0 để tương thích ngược, mặc định máy tính Windows hiện đại là
            // Windows 11
            return "Windows 11";
        }

        if (ua.contains("mac os x") || ua.contains("macos") || ua.contains("macintosh")) return "macOS";
        if (ua.contains("android")) return "Android";
        if (ua.contains("iphone") || ua.contains("ios")) return "iOS";
        if (ua.contains("ipad")) return "iPadOS";
        if (ua.contains("linux")) return "Linux";
        if (ua.contains("ubuntu")) return "Ubuntu";
        if (ua.contains("chromeos") || ua.contains("cros")) return "Chrome OS";

        return "Windows 11";
    }

    public static String detectOsName(String userAgent) {
        return detectOsName(userAgent, null);
    }

    /**
     * Phát hiện phiên bản hệ điều hành
     */
    public static String detectOsVersion(String userAgent) {
        if (userAgent == null || userAgent.isBlank()) return "";

        java.util.regex.Matcher androidMatcher = java.util.regex.Pattern.compile(
                        "android ([\\d.]+)", java.util.regex.Pattern.CASE_INSENSITIVE)
                .matcher(userAgent);
        if (androidMatcher.find()) return androidMatcher.group(1);

        java.util.regex.Matcher iosMatcher = java.util.regex.Pattern.compile(
                        "os ([\\d_]+) like", java.util.regex.Pattern.CASE_INSENSITIVE)
                .matcher(userAgent);
        if (iosMatcher.find()) return iosMatcher.group(1).replace("_", ".");

        java.util.regex.Matcher macMatcher = java.util.regex.Pattern.compile(
                        "mac os x ([\\d_.]+)", java.util.regex.Pattern.CASE_INSENSITIVE)
                .matcher(userAgent);
        if (macMatcher.find()) return macMatcher.group(1).replace("_", ".");

        return "";
    }

    /**
     * Phát hiện tên trình duyệt/app
     */
    public static String detectBrowserName(String userAgent) {
        if (userAgent == null || userAgent.isBlank()) return "Chrome";

        String ua = userAgent.toLowerCase();

        if (ua.contains("edg/") || ua.contains("edge/")) return "Microsoft Edge";
        if (ua.contains("opr/") || ua.contains("opera")) return "Opera";
        if (ua.contains("fban") || ua.contains("fbav")) return "Facebook App";
        if (ua.contains("instagram")) return "Instagram App";
        if (ua.contains("chrome") && !ua.contains("chromium")) return "Chrome";
        if (ua.contains("firefox")) return "Firefox";
        if (ua.contains("safari") && !ua.contains("chrome")) return "Safari";
        if (ua.contains("msie") || ua.contains("trident")) return "Internet Explorer";
        if (ua.contains("okhttp")) return "Android App";
        if (ua.contains("dart:io") || ua.contains("dio") || ua.contains("expo")) return "RRMS Mobile App";

        return "Chrome";
    }

    /**
     * Phát hiện phiên bản trình duyệt
     */
    public static String detectBrowserVersion(String userAgent) {
        if (userAgent == null || userAgent.isBlank()) return "";

        java.util.regex.Pattern[] patterns = {
            java.util.regex.Pattern.compile("edg/([\\d.]+)", java.util.regex.Pattern.CASE_INSENSITIVE),
            java.util.regex.Pattern.compile("edge/([\\d.]+)", java.util.regex.Pattern.CASE_INSENSITIVE),
            java.util.regex.Pattern.compile("opr/([\\d.]+)", java.util.regex.Pattern.CASE_INSENSITIVE),
            java.util.regex.Pattern.compile("chrome/([\\d.]+)", java.util.regex.Pattern.CASE_INSENSITIVE),
            java.util.regex.Pattern.compile("firefox/([\\d.]+)", java.util.regex.Pattern.CASE_INSENSITIVE),
            java.util.regex.Pattern.compile("version/([\\d.]+)", java.util.regex.Pattern.CASE_INSENSITIVE),
        };

        for (java.util.regex.Pattern pattern : patterns) {
            java.util.regex.Matcher matcher = pattern.matcher(userAgent);
            if (matcher.find()) {
                String version = matcher.group(1);
                String[] parts = version.split("\\.");
                return parts.length >= 2 ? parts[0] + "." + parts[1] : parts[0];
            }
        }

        return "";
    }

    /**
     * Tạo tên thiết bị thân thiện động (VD: "Chrome trên Windows 11" hoặc "RRMS Mobile App trên Android")
     */
    public static String buildDeviceName(String browserName, String osName) {
        String b = (browserName != null && !browserName.isBlank() && !browserName.equals("Unknown"))
                ? browserName
                : "Trình duyệt Web";
        String os = (osName != null && !osName.isBlank() && !osName.equals("Unknown")) ? osName : "Windows 11";

        if (b.toLowerCase().contains("expo") || b.toLowerCase().contains("mobile app")) {
            return "Ứng dụng di động (" + os + ")";
        }

        return b + " trên " + os;
    }
}
