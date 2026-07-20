package org.web.db;

import lombok.Builder;

@Builder
public record Comment (Integer id,Integer postId,String name, String email, String body) {
}
