package com.rrms.rrms.controllers;

import java.util.Set;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClient;
import org.springframework.web.server.ResponseStatusException;

import com.fasterxml.jackson.databind.JsonNode;

/** Proxies the fixed Esgoo address API so browser clients do not depend on its CORS headers. */
@RestController
@RequestMapping("/public/address")
public class AddressProxyController {
    private static final String NEW_API = "https://esgoo.net/api-tinhthanh-new";
    private static final String OLD_API = "https://esgoo.net/api-tinhthanh";
    private static final Set<String> ALLOWED_APIS = Set.of("new", "old");
    private static final Set<Integer> ALLOWED_LEVELS = Set.of(1, 2, 3, 4, 5);

    private final RestClient restClient = RestClient.create();

    @GetMapping("/{api}/{level}/{id}.htm")
    public ResponseEntity<JsonNode> getAddressData(
            @PathVariable String api, @PathVariable int level, @PathVariable String id) {
        if (!ALLOWED_APIS.contains(api) || !ALLOWED_LEVELS.contains(level) || !id.matches("\\d{1,10}")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid address query");
        }

        String baseUrl = "new".equals(api) ? NEW_API : OLD_API;
        JsonNode response = restClient
                .get()
                .uri(baseUrl + "/{level}/{id}.htm", level, id)
                .retrieve()
                .body(JsonNode.class);
        if (response == null) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Address provider returned an empty response");
        }
        return ResponseEntity.ok(response);
    }
}
