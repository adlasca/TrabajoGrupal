package org.web.db;

import lombok.Builder;

@Builder
public record Todo (Integer id, Integer userId, String title, Boolean completed) {
}
