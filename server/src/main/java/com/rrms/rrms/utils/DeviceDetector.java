package com.rrms.rrms.utils;

import jakarta.servlet.http.HttpServletRequest;

/**
 * DeviceDetector - Senior-level utility để phân tích User-Agent
 * Phát hiện loại thiết bị, hệ điều hành, trình duyệt từ User-Agent string
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
                // X-Forwarded-For có thể chứa nhiều IP (client, proxy1, proxy2)
                return ip.split(",")[0].trim();
            }
        }

        return request.getRemoteAddr();
    }

    /**
     * Phát hiện loại thiết bị từ User-Agent
     * @return "MOBILE", "TABLET", hoặc "WEB"
     */
    public static String detectDeviceType(String userAgent) {
        if (userAgent == null || userAgent.isBlank()) return "WEB";

        String ua = userAgent.toLowerCase();

        // Kiểm tra tablet trước (vì tablet cũng chứa "mobile" đôi khi)
        if (ua.contains("ipad") || ua.contains("tablet") || (ua.contains("android") && !ua.contains("mobile"))) {
            return "TABLET";
        }

        if (ua.contains("mobile")
                || ua.contains("iphone")
                || ua.contains("ipod")
                || ua.contains("blackberry")
                || ua.contains("windows phone")) {
            return "MOBILE";
        }

        return "WEB";
    }

    /**
     * Phát hiện tên hệ điều hành từ User-Agent
     */
    public static String detectOsName(String userAgent) {
        if (userAgent == null || userAgent.isBlank()) return "Unknown";

        String ua = userAgent.toLowerCase();

        if (ua.contains("windows nt 10") || ua.contains("windows 10")) return "Windows 10";
        if (ua.contains("windows nt 11") || ua.contains("windows 11")) return "Windows 11";
        if (ua.contains("windows nt 6.3")) return "Windows 8.1";
        if (ua.contains("windows nt 6.2")) return "Windows 8";
        if (ua.contains("windows nt 6.1")) return "Windows 7";
        if (ua.contains("windows")) return "Windows";
        if (ua.contains("mac os x") || ua.contains("macos")) return "macOS";
        if (ua.contains("android")) return "Android";
        if (ua.contains("iphone") || ua.contains("ipad") || ua.contains("ios")) return "iOS";
        if (ua.contains("linux")) return "Linux";
        if (ua.contains("ubuntu")) return "Ubuntu";
        if (ua.contains("chromeos")) return "Chrome OS";

        return "Unknown";
    }

    /**
     * Phát hiện phiên bản hệ điều hành (ví dụ: Android 13, iOS 17)
     */
    public static String detectOsVersion(String userAgent) {
        if (userAgent == null || userAgent.isBlank()) return "";

        // Android version: Android 13, Android 12, ...
        java.util.regex.Matcher androidMatcher = java.util.regex.Pattern.compile(
                        "android ([\\d.]+)", java.util.regex.Pattern.CASE_INSENSITIVE)
                .matcher(userAgent);
        if (androidMatcher.find()) return androidMatcher.group(1);

        // iOS version: OS 17_0, OS 16_2, ...
        java.util.regex.Matcher iosMatcher = java.util.regex.Pattern.compile(
                        "os ([\\d_]+) like", java.util.regex.Pattern.CASE_INSENSITIVE)
                .matcher(userAgent);
        if (iosMatcher.find()) return iosMatcher.group(1).replace("_", ".");

        // Windows NT version
        java.util.regex.Matcher winMatcher = java.util.regex.Pattern.compile(
                        "windows nt ([\\d.]+)", java.util.regex.Pattern.CASE_INSENSITIVE)
                .matcher(userAgent);
        if (winMatcher.find()) return winMatcher.group(1);

        // macOS version: Mac OS X 10_15_7
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
        if (userAgent == null || userAgent.isBlank()) return "Unknown";

        String ua = userAgent.toLowerCase();

        // Thứ tự quan trọng: kiểm tra specific trước generic
        if (ua.contains("edg/") || ua.contains("edge/")) return "Microsoft Edge";
        if (ua.contains("opr/") || ua.contains("opera")) return "Opera";
        if (ua.contains("fban") || ua.contains("fbav")) return "Facebook App";
        if (ua.contains("instagram")) return "Instagram App";
        if (ua.contains("twitter")) return "Twitter App";
        if (ua.contains("chrome") && !ua.contains("chromium")) return "Chrome";
        if (ua.contains("firefox")) return "Firefox";
        if (ua.contains("safari") && !ua.contains("chrome")) return "Safari";
        if (ua.contains("msie") || ua.contains("trident")) return "Internet Explorer";
        if (ua.contains("okhttp")) return "Android App (OkHttp)";
        if (ua.contains("dart:io") || ua.contains("dio")) return "Flutter App";
        if (ua.contains("expo")) return "Expo App";
        if (ua.contains("reactor-netty") || ua.contains("java/")) return "Java Client";

        return "Unknown";
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
                // Chỉ lấy major.minor version
                String version = matcher.group(1);
                String[] parts = version.split("\\.");
                return parts.length >= 2 ? parts[0] + "." + parts[1] : parts[0];
            }
        }

        return "";
    }

    /**
     * Tạo tên thiết bị thân thiện để hiển thị (VD: "Chrome on Windows 10")
     */
    public static String buildDeviceName(String browserName, String osName) {
        if ((browserName == null || browserName.equals("Unknown")) && (osName == null || osName.equals("Unknown"))) {
            return "Unknown Device";
        }
        if (browserName == null || browserName.equals("Unknown")) return osName;
        if (osName == null || osName.equals("Unknown")) return browserName;
        return browserName + " on " + osName;
    }
}
