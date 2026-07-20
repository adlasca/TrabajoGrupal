package org.web.respositories;

import io.helidon.dbclient.DbClient;
import io.helidon.dbclient.DbRow;
import org.web.db.Photo;

import java.util.List;

public class PhotoRepository {
    private final DbClient dbClient;

    public PhotoRepository(DbClient dbClient) {
        this.dbClient = dbClient;
    }

    private Photo mapRow(DbRow row){
        return  Photo.builder()
                .id(row.column("id").as(Integer.class).get())
                .title(row.column("title").as(String.class).orElse(null))
                .url(row.column("url").as(String.class).orElse(null))
                .thumbnailUrl(row.column("thumbnailUrl").as(String.class).orElse(null))
                .albumId(row.column("albumId").as(Integer.class).get())
                .build();
    }

    public List<Photo> findAll(){
        return dbClient.execute()
                .createNamedGet("select-photos")
                .execute()
                .map(this::mapRow)
                .stream().toList();
    }

}
