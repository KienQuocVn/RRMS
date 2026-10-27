package com.rrms.rrms.controllers;

import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClient;
import org.springframework.web.server.ResponseStatusException;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import lombok.extern.slf4j.Slf4j;

/** Proxies address API with resilient fallback to open-api.vn when esgoo is down or blocked by Imunify360. */
@RestController
@RequestMapping("/public/address")
@Slf4j
public class AddressProxyController {
    private static final String NEW_API = "https://esgoo.net/api-tinhthanh-new";
    private static final String OLD_API = "https://esgoo.net/api-tinhthanh";
    private static final String OPEN_API = "https://provinces.open-api.vn/api";
    private static final Set<String> ALLOWED_APIS = Set.of("new", "old");
    private static final Set<Integer> ALLOWED_LEVELS = Set.of(1, 2, 3, 4, 5);

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final Map<String, JsonNode> cache = new ConcurrentHashMap<>();

    private final RestClient restClient = RestClient.builder()
            .defaultHeader(
                    "User-Agent",
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
            .defaultHeader("Accept", "application/json, text/plain, */*")
            .build();

    @GetMapping("/{api}/{level}/{id}.htm")
    public ResponseEntity<JsonNode> getAddressData(
            @PathVariable String api, @PathVariable int level, @PathVariable String id) {
        if (!ALLOWED_APIS.contains(api) || !ALLOWED_LEVELS.contains(level) || !id.matches("\\d{1,10}")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid address query");
        }

        String cacheKey = api + ":" + level + ":" + id;
        JsonNode cached = cache.get(cacheKey);
        if (cached != null) {
            return ResponseEntity.ok(cached);
        }

        // 1. Try esgoo.net first
        try {
            String baseUrl = "new".equals(api) ? NEW_API : OLD_API;
            JsonNode response = restClient
                    .get()
                    .uri(baseUrl + "/{level}/{id}.htm", level, id)
                    .retrieve()
                    .body(JsonNode.class);

            if (response != null
                    && response.has("error")
                    && response.get("error").asInt() == 0
                    && response.has("data")) {
                cache.put(cacheKey, response);
                return ResponseEntity.ok(response);
            }
        } catch (Exception e) {
            log.warn(
                    "Esgoo API unavailable for {}/{}/{} ({}). Falling back to provinces.open-api.vn.",
                    api,
                    level,
                    id,
                    e.getMessage());
        }

        // 2. Fallback to provinces.open-api.vn
        JsonNode fallback = fetchFromOpenApi(api, level, id);
        if (fallback != null) {
            cache.put(cacheKey, fallback);
            return ResponseEntity.ok(fallback);
        }

        // 3. Fallback to empty successful response to prevent 500 error on client
        ObjectNode emptyResponse = objectMapper.createObjectNode();
        emptyResponse.put("error", 0);
        emptyResponse.put("error_text", "Thành công");
        emptyResponse.putArray("data");
        return ResponseEntity.ok(emptyResponse);
    }

    private JsonNode fetchFromOpenApi(String api, int level, String id) {
        try {
            ObjectNode root = objectMapper.createObjectNode();
            root.put("error", 0);
            root.put("error_text", "Thành công");
            ArrayNode data = root.putArray("data");

            if (level == 1) {
                // Tỉnh / Thành
                JsonNode res = restClient.get().uri(OPEN_API + "/p/").retrieve().body(JsonNode.class);
                if (res != null && res.isArray()) {
                    for (JsonNode p : res) {
                        int code = p.path("code").asInt();
                        String name = p.path("name").asText();
                        ObjectNode item = data.addObject();
                        item.put("id", String.format("%02d", code));
                        item.put("name", name);
                        item.put("full_name", name);
                    }
                }
            } else if ("old".equals(api) && level == 2) {
                // Quận / Huyện
                int code = Integer.parseInt(id);
                JsonNode res = restClient
                        .get()
                        .uri(OPEN_API + "/p/{code}?depth=2", code)
                        .retrieve()
                        .body(JsonNode.class);
                if (res != null && res.has("districts") && res.get("districts").isArray()) {
                    for (JsonNode d : res.get("districts")) {
                        int dCode = d.path("code").asInt();
                        String name = d.path("name").asText();
                        ObjectNode item = data.addObject();
                        item.put("id", String.format("%03d", dCode));
                        item.put("name", name);
                        item.put("full_name", name);
                    }
                }
            } else if ("old".equals(api) && level == 3) {
                // Phường / Xã (theo Quận/Huyện)
                int code = Integer.parseInt(id);
                JsonNode res = restClient
                        .get()
                        .uri(OPEN_API + "/d/{code}?depth=2", code)
                        .retrieve()
                        .body(JsonNode.class);
                if (res != null && res.has("wards") && res.get("wards").isArray()) {
                    for (JsonNode w : res.get("wards")) {
                        int wCode = w.path("code").asInt();
                        String name = w.path("name").asText();
                        ObjectNode item = data.addObject();
                        item.put("id", String.format("%05d", wCode));
                        item.put("name", name);
                        item.put("full_name", name);
                    }
                }
            } else if ("new".equals(api) && level == 2) {
                // Phường / Xã (theo Tỉnh) - Chuẩn 34 tỉnh mới (không có quận/huyện)
                int code = Integer.parseInt(id);
                if (code == 79 || code == 2) {
                    // Danh sách chuẩn các phường xã mới của TP.HCM sau sáp nhập theo esgoo.net (Ảnh 2)
                    String[] hcmWards = {
                        "Phường An Hội Tây", "Phường An Hội Đông", "Phường An Khánh", "Phường An Lạc",
                        "Xã An Long", "Phường An Nhơn", "Xã An Nhơn Tây", "Phường An Phú", "Phường An Phú Đông",
                        "Xã An Thới Đông", "Phường An Đông", "Phường Bà Rịa", "Xã Bà Điểm", "Xã Bắc Tân Uyên",
                        "Phường Bàn Cờ", "Xã Bàu Bàng", "Xã Bàu Lâm", "Phường Bảy Hiền", "Phường Bến Cát",
                        "Phường Bến Nghé", "Phường Bến Thành", "Phường Bình An", "Phường Bình Chiểu",
                        "Phường Bình Chánh", "Phường Bình Hòa", "Phường Bình Hưng", "Phường Bình Hưng Hòa",
                        "Phường Bình Khánh", "Phường Bình Thạnh", "Phường Bình Thọ", "Phường Cần Giờ",
                        "Phường Cát Lái", "Phường Cầu Kho", "Phường Cầu Ông Lãnh", "Phường Củ Chi",
                        "Phường Đa Kao", "Phường Dĩ An", "Phường Gia Định", "Phường Gò Vấp", "Phường Hạnh Thông",
                        "Phường Hiệp Bình", "Phường Hiệp Phước", "Phường Hiệp Thành", "Phường Hóc Môn",
                        "Phường Lái Thiêu", "Phường Linh Chiểu", "Phường Linh Trung", "Phường Linh Xuân",
                        "Phường Long Bình", "Phường Long Phước", "Phường Long Thành", "Phường Nhà Bè",
                        "Phường Phú Cường", "Phường Phú Định", "Phường Phú Nhuận", "Phường Phước Long",
                        "Phường Tam Bình", "Phường Tân Bình", "Phường Tân Định", "Phường Tân Phú",
                        "Phường Tân Tạo", "Phường Tân Thuận", "Phường Thắng Nhất", "Phường Thạnh Mỹ Lợi",
                        "Phường Thủ Dầu Một", "Phường Thủ Đức", "Phường Thuận An", "Phường Vũng Tàu"
                    };
                    for (int i = 0; i < hcmWards.length; i++) {
                        String name = hcmWards[i];
                        ObjectNode item = data.addObject();
                        item.put("id", String.format("%05d", i + 1));
                        item.put("name", name);
                        item.put("full_name", name);
                    }
                } else {
                    JsonNode res = restClient
                            .get()
                            .uri(OPEN_API + "/p/{code}?depth=3", code)
                            .retrieve()
                            .body(JsonNode.class);
                    if (res != null && res.has("districts") && res.get("districts").isArray()) {
                        Set<String> seen = new java.util.HashSet<>();
                        for (JsonNode d : res.get("districts")) {
                            if (d.has("wards") && d.get("wards").isArray()) {
                                for (JsonNode w : d.get("wards")) {
                                    int wCode = w.path("code").asInt();
                                    String wName = w.path("name").asText();
                                    if (seen.add(wName)) {
                                        ObjectNode item = data.addObject();
                                        item.put("id", String.format("%05d", wCode));
                                        item.put("name", wName);
                                        item.put("full_name", wName);
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return root;
        } catch (Exception e) {
            log.error("Failed to fetch address from open-api.vn: {}", e.getMessage());
            return null;
        }
    }
}
