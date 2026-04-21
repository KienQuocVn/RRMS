package com.rrms.rrms.utils;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

public final class PageableUtils {
    private static final int DEFAULT_PAGE = 0;
    private static final int DEFAULT_SIZE = 20;
    private static final int MAX_SIZE = 100;

    private PageableUtils() {}

    public static Pageable of(Integer page, Integer size, String sortBy, String sortDirection) {
        int sanitizedPage = page == null || page < 0 ? DEFAULT_PAGE : page;
        int sanitizedSize = size == null || size < 1 ? DEFAULT_SIZE : Math.min(size, MAX_SIZE);
        String sanitizedSortBy = sortBy == null || sortBy.isBlank() ? "createdAt" : sortBy;
        Sort.Direction direction =
                Sort.Direction.fromOptionalString(sortDirection).orElse(Sort.Direction.DESC);

        return PageRequest.of(sanitizedPage, sanitizedSize, Sort.by(direction, sanitizedSortBy));
    }
}
