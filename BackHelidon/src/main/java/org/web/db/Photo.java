package org.web.db;

import lombok.Builder;

@Builder
public record Photo(Integer id,Integer albumId,String title, String url, String thumbnailUrl) {
}
