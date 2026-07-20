package org.web.db;

import lombok.Builder;

@Builder
public record Post (Integer id, Integer userId, String title, String body) {
}
