package org.web.db;

import lombok.Builder;

@Builder
public record Album(Integer id,Integer userId,String title)  {
}
